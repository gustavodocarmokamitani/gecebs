// src/routes/analytics.route.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/export/analytics', authenticateToken, async (req, res) => {
  const userPayload = req.user;
  const teamId = userPayload.teamId;

  try {
    const analyticsData = await prisma.category.findMany({
      where: { teamId: teamId },
      include: {
        athletes: {
          select: {
            athlete: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                birthDate: true,
                shirtNumber: true,
                federationId: true,
                confederationId: true,
                user: {
                  select: {
                    email: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            name: true,
            value: true,
            dueDate: true,
          },
        },
        events: {
          select: {
            name: true,
            date: true,
            location: true,
            type: true,
          },
        },
      },
    });

    res.json(analyticsData);
  } catch (error) {
    console.error('Erro na rota de exportação:', error);
    res.status(500).json({ error: 'Erro ao gerar o relatório.' });
  }
});

export default router;
