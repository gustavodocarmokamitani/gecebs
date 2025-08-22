// src/routes/v1/athlete.route.js
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
    const { firstName, lastName, phone, birthDate, federationId, confederationId, houseNumber } =
      req.body;
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
      houseNumber,
      shirtNumber,
      categoryIds,
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

    const result = await prisma.$transaction(async (prisma) => {
      const updatedAthlete = await prisma.athlete.update({
        where: { id: Number(id) },
        data: {
          firstName,
          lastName,
          phone,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          federationId,
          confederationId,
          houseNumber,
          shirtNumber,
        },
      });

      if (categoryIds) {
        await prisma.categoryAthlete.deleteMany({
          where: { athleteId: Number(id) },
        });

        if (categoryIds.length > 0) {
          const newAssociations = categoryIds.map((categoryId) => ({
            athleteId: Number(id),
            categoryId: categoryId,
          }));
          await prisma.categoryAthlete.createMany({
            data: newAssociations,
          });
        }
      }
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
 * DELETE /athlete/:id
 * Exclui um atleta e seu usuário associado.
 */
router.delete('/athlete/:id', authenticateToken, async (req, res) => {
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
      await prisma.athlete.delete({
        where: { id: Number(id) },
      });

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

export default router;
