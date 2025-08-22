// src/routes/category.route.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /create
 * Cria uma nova categoria para o time.
 * @access TEAM
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const { teamId, role } = req.user;

    // Apenas o dono do time pode criar categorias
    if (role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas o proprietário da equipe pode criar categorias.' });
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
 * @access MANAGER ou TEAM
 */
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    // Apenas managers e o dono do time podem listar categorias
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message:
          'Acesso negado. Apenas managers e o proprietário da equipe podem ver as categorias.',
      });
    }

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
