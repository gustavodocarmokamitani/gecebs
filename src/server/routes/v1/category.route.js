import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /create
 * Cria uma nova categoria para o time.
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem criar categorias
    if (role !== 'MANAGER') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        team: {
          connect: { id: teamId },
        },
      },
    });

    res.status(201).json({ message: 'Categoria criada com sucesso.', category: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar a categoria.' });
  }
});

/**
 * GET /list
 * Lista todas as categorias de um time.
 */
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.user;

    const categories = await prisma.category.findMany({
      where: {
        teamId: teamId,
      },
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar categorias.' });
  }
});

export default router;
