import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /list-athletes
 * Lista todos os atletas de um time.
 * @access MANAGER ou TEAM
 */
router.get('/list-athletes', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    // Apenas managers ou o dono do time podem listar atletas
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas managers e o proprietário da equipe podem ver os atletas.',
      });
    }

    const athletes = await prisma.athlete.findMany({
      where: {
        user: {
          teamId: teamId,
        },
      },
      // Inclui os dados do usuário para ter acesso ao `username` (telefone) e `role`
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
        // Inclui as categorias para o agrupamento no frontend
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    res.status(200).json(athletes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os atletas.' });
  }
});

/**
 * GET /list-athletes-without-categories
 * Lista todos os atletas de um time sem as categorias.
 * @access MANAGER ou TEAM
 * 👈 Nova rota adicionada
 */
router.get('/list-athletes-without-categories', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas managers e o proprietário da equipe podem ver os atletas.',
      });
    }

    const athletes = await prisma.athlete.findMany({
      where: {
        user: {
          teamId: teamId,
        },
      },
      // Inclui apenas os dados do usuário, sem as categorias
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json(athletes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os atletas.' });
  }
});

/**
 * POST /create-athlete
 * Cria um novo usuário (atleta) e o associa a pagamentos existentes.
 */
router.post('/create-athlete', authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      birthDate,
      federationId,
      confederationId,
      shirtNumber,
      categories,
    } = req.body;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers ou equipes podem criar atletas.' });
    }

    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      select: {
        name: true,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Time não encontrado.' });
    }

    const username = phone;
    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Um usuário com este telefone já existe.' });
    }

    // Usando a transação para garantir que a criação e a associação são atômicas
    const result = await prisma.$transaction(async (prisma) => {
      const genericPassword = `${firstName.replace(/\s/g, '').toLowerCase()}123`;
      const hashedPassword = await bcrypt.hash(genericPassword, 10);

      const newAthlete = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: 'ATHLETE',
          teamId: teamId,
          athlete: {
            create: {
              firstName,
              lastName,
              phone,
              birthDate: new Date(birthDate),
              federationId,
              confederationId,
              shirtNumber,
              categories: {
                createMany: {
                  data: categories.map((categoryId) => ({ categoryId })),
                },
              },
            },
          },
        },
        include: {
          athlete: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      // Lógica para associar o novo atleta a pagamentos existentes que NÃO FORAM FINALIZADOS
      const paymentUsersToCreate = [];
      for (const categoryId of categories) {
        const existingPayments = await prisma.payment.findMany({
          where: {
            categoryId: categoryId,
            isFinalized: false, // Adicionado para ignorar pagamentos finalizados
          },
          select: {
            id: true,
          },
        });

        existingPayments.forEach((payment) => {
          paymentUsersToCreate.push({
            paymentId: payment.id,
            userId: newAthlete.id,
          });
        });
      }

      if (paymentUsersToCreate.length > 0) {
        await prisma.paymentUser.createMany({
          data: paymentUsersToCreate,
          skipDuplicates: true,
        });
      }

      return { newAthlete, genericPassword };
    });

    res.status(201).json({
      message: 'Atleta criado com sucesso. Senha temporária: ' + result.genericPassword,
      athlete: result.newAthlete,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o atleta.' });
  }
});

/**
 * PATCH /update-athlete/:id
 * Atualiza os dados de um atleta e suas categorias.
 */
router.patch('/update-athlete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;
    const {
      firstName,
      lastName,
      phone,
      birthDate,
      federationId,
      confederationId,
      shirtNumber,
      categories,
    } = req.body;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const athlete = await prisma.athlete.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!athlete || athlete.user.teamId !== teamId) {
      return res.status(404).json({ message: 'Atleta não encontrado no seu time.' });
    }

    // Usamos uma transação para garantir que as operações de atualização sejam atômicas.
    const result = await prisma.$transaction(async (prisma) => {
      // Passo 1: Obter as categorias atuais e as categorias enviadas
      const oldCategories = await prisma.categoryAthlete.findMany({
        where: { athleteId: Number(id) },
        select: { categoryId: true },
      });
      const oldCategoryIds = oldCategories.map((c) => c.categoryId);
      const newCategoryIds = categories.map(Number);

      // Passo 2: Excluir associações de pagamentos que não são mais relevantes E NÃO ESTÃO FINALIZADOS
      const removedCategoryIds = oldCategoryIds.filter((catId) => !newCategoryIds.includes(catId));
      if (removedCategoryIds.length > 0) {
        const paymentsToRemove = await prisma.payment.findMany({
          where: {
            categoryId: { in: removedCategoryIds },
            isFinalized: false, // Adicionado para verificar se o pagamento não está finalizado
          },
          select: {
            id: true,
          },
        });
        const paymentIdsToRemove = paymentsToRemove.map((p) => p.id);

        if (paymentIdsToRemove.length > 0) {
          await prisma.paymentUser.deleteMany({
            where: {
              paymentId: { in: paymentIdsToRemove },
              userId: athlete.userId,
            },
          });
        }
      }

      // Passo 3: Adicionar novas associações de pagamentos QUE NÃO ESTÃO FINALIZADOS
      const addedCategoryIds = newCategoryIds.filter((catId) => !oldCategoryIds.includes(catId));
      if (addedCategoryIds.length > 0) {
        const paymentsToAdd = await prisma.payment.findMany({
          where: {
            categoryId: { in: addedCategoryIds },
            isFinalized: false, // Adicionado para garantir que o pagamento não está finalizado
          },
          select: {
            id: true,
          },
        });

        const paymentUsersToAdd = paymentsToAdd.map((p) => ({
          paymentId: p.id,
          userId: athlete.userId,
        }));

        if (paymentUsersToAdd.length > 0) {
          await prisma.paymentUser.createMany({
            data: paymentUsersToAdd,
            skipDuplicates: true,
          });
        }
      }

      // Passo 4: Atualizar os dados do atleta e as associações de categoria
      await prisma.categoryAthlete.deleteMany({
        where: { athleteId: Number(id) },
      });
      if (categories.length > 0) {
        await prisma.categoryAthlete.createMany({
          data: categories.map((categoryId) => ({
            athleteId: Number(id),
            categoryId,
          })),
        });
      }

      const updatedAthlete = await prisma.athlete.update({
        where: { id: Number(id) },
        data: {
          firstName,
          lastName,
          phone,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          federationId,
          confederationId,
          shirtNumber,
          user: phone ? { update: { username: phone } } : undefined, // Atualiza o username do User
        },
      });

      return updatedAthlete;
    });

    res.status(200).json({
      message: 'Atleta atualizado com sucesso.',
      athlete: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o atleta.' });
  }
});

/**
 * DELETE /:id
 * Exclui um atleta e seu usuário associado, incluindo todas as dependências.
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const athlete = await prisma.athlete.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!athlete || athlete.user.teamId !== teamId) {
      return res.status(404).json({ message: 'Atleta não encontrado no seu time.' });
    }

    await prisma.$transaction(async (prisma) => {
      // 1. Excluir associações do usuário (User)
      await prisma.paymentUser.deleteMany({
        where: { userId: athlete.user.id },
      });

      await prisma.confirmationUser.deleteMany({
        where: { userId: athlete.user.id },
      });

      // 2. Excluir associações do atleta (Athlete)
      await prisma.categoryAthlete.deleteMany({
        where: { athleteId: Number(id) },
      });

      // 3. Excluir o registro do atleta
      await prisma.athlete.delete({
        where: { id: Number(id) },
      });

      // 4. Excluir o registro do usuário
      await prisma.user.delete({
        where: { id: athlete.user.id },
      });
    });

    res.status(200).json({ message: 'Atleta e usuário associado excluídos com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir o atleta.' });
  }
});

/**
 * GET /athlete/:id
 * Busca um único atleta por ID.
 * @access MANAGER ou TEAM
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    // Verificação de acesso para garantir que apenas o manager ou o time dono possa ver
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const athlete = await prisma.athlete.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
            teamId: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!athlete || athlete.user.teamId !== teamId) {
      return res.status(404).json({ message: 'Atleta não encontrado no seu time.' });
    }

    res.status(200).json(athlete);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar o atleta.' });
  }
});

export default router;
