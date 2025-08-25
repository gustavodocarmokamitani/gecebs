// src/routes/team.route.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /details
 * Busca os detalhes do time do usuário logado.
 * @access TEAM
 */
router.get('/details', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    // Apenas o proprietário do time (role 'TEAM') pode acessar esta rota
    if (role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas o proprietário do time pode ver as configurações.',
      });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'Time não encontrado.' });
    }

    res.status(200).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar os detalhes do time.' });
  }
});

/**
 * PATCH /update
 * Atualiza os detalhes do time.
 * @access TEAM
 */
router.patch('/update', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;
    const { name, email, phone, image } = req.body;

    // Apenas o proprietário do time pode atualizar as configurações
    if (role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas o proprietário do time pode atualizar as configurações.',
      });
    }

    // Verifique se o e-mail ou telefone já existem em outro time
    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
        NOT: { id: teamId },
      },
    });

    if (existingTeam) {
      return res.status(409).json({ message: 'E-mail ou telefone já utilizados por outro time.' });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        email,
        phone,
        image,
      },
    });

    res.status(200).json({
      message: 'Configurações do time atualizadas com sucesso.',
      team: updatedTeam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar as configurações do time.' });
  }
});

/**
 * PATCH /update-manager-passwords
 * Atualiza a senha de todos os managers do time.
 * @access TEAM
 */
router.patch('/update-manager-passwords', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;
    const { password } = req.body;

    if (role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'A nova senha é obrigatória.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.updateMany({
      where: {
        teamId: teamId,
        role: 'MANAGER',
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: `${result.count} senhas de managers atualizadas com sucesso.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar as senhas dos managers.' });
  }
});

/**
 * PATCH /update-athlete-passwords
 * Atualiza a senha de todos os atletas do time.
 * @access TEAM
 */
router.patch('/update-athlete-passwords', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;
    const { password } = req.body;

    if (role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'A nova senha é obrigatória.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.updateMany({
      where: {
        teamId: teamId,
        role: 'ATHLETE',
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: `${result.count} senhas de atletas atualizadas com sucesso.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar as senhas dos atletas.' });
  }
});

export default router;
