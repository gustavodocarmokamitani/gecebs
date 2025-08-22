// src/routes/v1/user.route.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /create-user
 * Cria um novo usuário genérico.
 */
router.post('/create-user', authenticateToken, async (req, res) => {
  try {
    const { username, password, role, teamId } = req.body;
    const { role: requesterRole } = req.user;

    if (requesterRole !== 'ADMIN' && requesterRole !== 'MANAGER') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Nome de usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role,
        teamId: teamId,
      },
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o usuário.' });
  }
});

/**
 * PATCH /update-user/:id
 * Atualiza os dados de um usuário (username, password, etc.).
 */
router.patch('/update-user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, teamId } = req.body;
    const { role: requesterRole, teamId: requesterTeamId } = req.user;

    const userToUpdate = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!userToUpdate || userToUpdate.teamId !== requesterTeamId) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado ou você não tem permissão para atualizá-lo.' });
    }

    // Apenas ADMINs podem alterar a role de um usuário
    if (role && requesterRole !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Apenas admins podem alterar a função de um usuário.' });
    }

    const data = {};
    if (username) {
      data.username = username;
    }
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    if (role) {
      data.role = role;
    }
    if (teamId) {
      data.teamId = teamId;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json({
      message: 'Usuário atualizado com sucesso.',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
  }
});

/**
 * DELETE /delete-user/:id
 * Exclui um usuário.
 */
router.delete('/delete-user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role: requesterRole, teamId: requesterTeamId } = req.user;

    const userToDelete = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!userToDelete || userToDelete.teamId !== requesterTeamId) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado ou você não tem permissão para excluí-lo.' });
    }

    if (requesterRole !== 'ADMIN' && userToDelete.role === 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado. Você não pode excluir outro admin.' });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir o usuário.' });
  }
});

// Rotas de autenticação, etc.
router.post('/auth/login', async (req, res) => {
  // Sua lógica de login
});

export default router;
