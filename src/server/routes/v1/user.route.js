import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /create-athlete
 * Cria um novo usuário (atleta) para o time.
 */
router.post('/create-athlete', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, birthDate, federationId, houseNumber } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem criar atletas
    if (role !== 'MANAGER') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Gera um nome de usuário único
    const username = `${firstName.replace(/\s/g, '').toLowerCase()}${lastName.replace(/\s/g, '').toLowerCase()}${teamId}`;

    // Gera uma senha genérica e a criptografa
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
            houseNumber,
          },
        },
      },
      include: {
        athlete: true,
      },
    });

    res.status(201).json({
      message: 'Atleta criado com sucesso. Senha temporária: ' + genericPassword,
      athlete: newAthlete,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o atleta.' });
  }
});

/**
 * GET /list-athletes
 * Lista todos os atletas de um time.
 */
router.get('/list-athletes', authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.user;

    const athletes = await prisma.user.findMany({
      where: {
        teamId: teamId,
        role: 'ATHLETE',
      },
      include: {
        athlete: true,
      },
    });

    res.status(200).json(athletes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os atletas.' });
  }
});

/**
 * POST /add-category
 * Adiciona uma categoria a um atleta.
 */
router.post('/add-category', authenticateToken, async (req, res) => {
  try {
    const { athleteId, categoryId } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem adicionar categorias
    if (role !== 'MANAGER') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Verifica se a categoria e o atleta pertencem ao mesmo time
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: { user: true },
    });
    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!athlete || athlete.user.teamId !== teamId || !category || category.teamId !== teamId) {
      return res.status(404).json({ message: 'Atleta ou categoria não encontrados no seu time.' });
    }

    // Cria a associação na tabela de junção
    const newAssociation = await prisma.categoryAthlete.create({
      data: {
        athleteId,
        categoryId,
      },
    });

    res.status(201).json({
      message: 'Categoria adicionada ao atleta com sucesso.',
      association: newAssociation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao adicionar a categoria ao atleta.' });
  }
});

/**
 * GET /:id/categories
 * Lista todas as categorias de um atleta específico.
 */
router.get('/:id/categories', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId } = req.user;

    // Procura o atleta e suas categorias, garantindo que ele pertence ao time do manager
    const athlete = await prisma.athlete.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        categories: {
          include: { category: true },
        },
      },
    });

    if (!athlete || athlete.user.teamId !== teamId) {
      return res.status(404).json({ message: 'Atleta não encontrado no seu time.' });
    }

    res.status(200).json(athlete.categories.map((ca) => ca.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar as categorias do atleta.' });
  }
});

/**
 * DELETE /remove-category
 * Remove uma categoria de um atleta.
 */
router.delete('/remove-category', authenticateToken, async (req, res) => {
  try {
    const { athleteId, categoryId } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem remover categorias
    if (role !== 'MANAGER') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Verifica se a associação existe e pertence ao time
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: { user: true },
    });
    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!athlete || athlete.user.teamId !== teamId || !category || category.teamId !== teamId) {
      return res.status(404).json({ message: 'Atleta ou categoria não encontrados no seu time.' });
    }

    await prisma.categoryAthlete.delete({
      where: {
        athleteId_categoryId: {
          athleteId,
          categoryId,
        },
      },
    });

    res.status(200).json({ message: 'Categoria removida do atleta com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover a categoria do atleta.' });
  }
});

export default router;
