import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// ======================================================
// ⚠️ Rotas GET
// As rotas mais específicas devem vir antes das mais genéricas.
// ======================================================

/**
 * GET /categories/list
 * Lista todas as categorias de um time.
 * @access MANAGER ou TEAM
 */
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

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
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar categorias.' });
  }
});

/**
 * GET /categories/:id
 * Busca uma categoria específica por ID.
 * @access MANAGER ou TEAM
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message:
          'Acesso negado. Apenas managers e o proprietário da equipe podem ver as categorias.',
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category || category.teamId !== teamId) {
      return res.status(404).json({ message: 'Categoria não encontrada ou acesso negado.' });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar a categoria.' });
  }
});

// ======================================================
// ⚠️ Rotas de Modificação
// Manter as rotas de POST, PATCH e DELETE agrupadas.
// ======================================================

/**
 * POST /categories/create
 * Cria uma nova categoria para o time.
 * @access TEAM
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const { teamId, role } = req.user;

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
 * PATCH /categories/:id
 * Atualiza o nome de uma categoria.
 * @access MANAGER ou TEAM
 */
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message:
          'Acesso negado. Apenas managers e o proprietário da equipe podem atualizar categorias.',
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: parseInt(id),
        teamId: teamId,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      message: 'Categoria atualizada com sucesso.',
      category: updatedCategory,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res
        .status(404)
        .json({ message: 'Categoria não encontrada ou não pertence ao seu time.' });
    }
    res.status(500).json({ message: 'Erro ao atualizar a categoria.' });
  }
});

/**
 * DELETE /categories/:id
 * Deleta uma categoria.
 * @access MANAGER ou TEAM
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    if (role !== 'TEAM') {
      return res.status(403).json({
        message:
          'Acesso negado. Apenas managers e o proprietário da equipe podem apagar as categorias.',
      });
    }

    const categoryToDelete = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!categoryToDelete || categoryToDelete.teamId !== teamId) {
      return res
        .status(404)
        .json({ message: 'Categoria não encontrada ou não pertence ao seu time.' });
    }

    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: 'Categoria deletada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar a categoria.' });
  }
});

export default router;
