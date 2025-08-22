// src/routes/v1/manager.route.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /create-manager
 * Cria um novo usuário (manager) para o time, associado a categorias.
 */
router.post('/create-manager', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, categories } = req.body;
    const { teamId, role } = req.user;

    if (role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas o proprietário da equipe pode criar um manager.' });
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .json({ message: 'É obrigatório selecionar pelo menos uma categoria para o manager.' });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { name: true },
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

    const genericPassword = `${firstName.replace(/\s/g, '').toLowerCase()}123`;
    const hashedPassword = await bcrypt.hash(genericPassword, 10);

    const newManager = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'MANAGER',
        teamId: teamId,
        manager: {
          create: {
            firstName,
            lastName,
            phone,
            categories: {
              create: categories.map((id) => ({ categoryId: id })),
            },
          },
        },
      },
      include: {
        manager: {
          include: {
            categories: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Manager criado com sucesso. Senha temporária: ' + genericPassword,
      manager: newManager,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o manager.' });
  }
});

/**
 * PATCH /update-manager/:id
 * Atualiza os dados de um manager.
 */
router.patch('/update-manager/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;
    const { firstName, lastName, phone } = req.body;

    // Apenas o proprietário do time 'TEAM' pode atualizar managers
    if (role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const manager = await prisma.manager.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!manager || manager.user.teamId !== teamId) {
      return res.status(404).json({ message: 'Manager não encontrado no seu time.' });
    }

    const updatedManager = await prisma.manager.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        phone,
      },
    });

    res.status(200).json({
      message: 'Manager atualizado com sucesso.',
      manager: updatedManager,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o manager.' });
  }
});

/**
 * DELETE /manager/:id
 * Exclui um manager e seu usuário associado.
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    // Apenas o proprietário do time 'TEAM' pode excluir managers
    if (role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const manager = await prisma.manager.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!manager || manager.user.teamId !== teamId) {
      return res.status(404).json({ message: 'Manager não encontrado no seu time.' });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.manager.delete({
        where: { id: Number(id) },
      });

      await prisma.user.delete({
        where: { id: manager.user.id },
      });
    });

    res.status(200).json({ message: 'Manager e usuário associado excluídos com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir o manager.' });
  }
});

/**
 * GET /manager/list-all
 * Lista todos os managers de um time, incluindo as categorias que eles gerenciam.
 * @access TEAM ou MANAGER
 */
router.get('/list-all', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Você não tem permissão para listar managers.' });
    }

    const managers = await prisma.manager.findMany({
      where: {
        user: {
          teamId: teamId,
        },
      },
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os managers.' });
  }
});

/**
 * GET /managers/:id
 * Busca um manager por ID e inclui os dados do usuário associado.
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId } = req.user;

    const manager = await prisma.manager.findFirst({
      where: {
        id: Number(id),
        user: {
          teamId: teamId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!manager) {
      return res
        .status(404)
        .json({ message: 'Manager não encontrado ou não pertence ao seu time.' });
    }

    res.status(200).json(manager);
  } catch (err) {
    console.error('Erro ao buscar manager por ID:', err);
    res.status(500).json({ message: 'Erro ao buscar dados do manager.' });
  }
});

export default router;
