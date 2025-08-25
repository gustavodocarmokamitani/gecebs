import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// ======================================================
// ⚠️ Rotas GET (mais específicas primeiro)
// ======================================================

/**
 * GET /event/list-all-team-events
 * Lista todos os eventos criados para um time.
 */
router.get('/list-all-team-events', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas managers e equipes podem listar todos os eventos do time.',
      });
    }

    const events = await prisma.event.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        category: true,
      },
    });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os eventos do time.' });
  }
});

/**
 * GET /event/list-all-events-athletics
 * Lista todos os eventos aos quais o atleta está associado.
 */
router.get('/list-all-events-athletics', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== 'ATHLETE') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas atletas podem listar seus eventos.' });
    }

    const myConfirmations = await prisma.confirmationUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        confirmation: {
          include: {
            event: true,
          },
        },
      },
      orderBy: {
        confirmation: {
          event: {
            date: 'desc',
          },
        },
      },
    });

    const myEvents = myConfirmations.map((conf) => ({
      ...conf.confirmation.event,
      confirmedAt: conf.confirmedAt,
    }));

    res.status(200).json(myEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os eventos do atleta.' });
  }
});

/**
 * GET /event/get-by-id/:id
 * Busca um evento específico por ID.
 */
router.get('/get-by-id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas managers e equipes podem acessar eventos do time.',
      });
    }

    const eventId = parseInt(id);

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        teamId: teamId,
      },
      include: {
        category: true,
      },
    });

    if (!event) {
      return res
        .status(404)
        .json({ message: 'Evento não encontrado ou não pertence ao seu time.' });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar o evento.' });
  }
});

/**
 * GET /event/athletes/:id
 * Retorna os atletas de um time para um evento específico.
 * Adicionei um `/event` no caminho para evitar conflito com outras rotas de atletas.
 */
router.get('/athletes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);
    const { teamId } = req.user;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { categoryId: true },
    });

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    const athletes = await prisma.athlete.findMany({
      where: {
        user: {
          teamId: teamId,
          role: 'ATHLETE',
        },
        categories: {
          some: {
            categoryId: event.categoryId,
          },
        },
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        user: {
          select: {
            confirmations: {
              where: {
                confirmation: {
                  eventId: eventId,
                },
              },
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const result = athletes.map((athlete) => ({
      userId: athlete.userId,
      firstName: athlete.firstName,
      lastName: athlete.lastName,
      status: athlete.user.confirmations[0]?.status ?? false,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar atletas do evento.' });
  }
});

// ======================================================
// ⚠️ Rotas de Modificação
// ======================================================

/**
 * POST /event/create
 * Cria um novo evento e uma solicitação de confirmação para todos os atletas.
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, date, location, type, categoryId } = req.body;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem criar eventos.' });
    }

    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        type,
        teamId,
        categoryId,
      },
    });

    const newConfirmation = await prisma.confirmation.create({
      data: {
        eventId: newEvent.id,
      },
    });

    const athletes = await prisma.user.findMany({
      where: {
        teamId: teamId,
        role: 'ATHLETE',
      },
    });

    const confirmationUsersData = athletes.map((athlete) => ({
      confirmationId: newConfirmation.id,
      userId: athlete.id,
      status: false,
    }));

    await prisma.confirmationUser.createMany({
      data: confirmationUsersData,
    });

    res.status(201).json({
      message: 'Evento e solicitação de confirmação criados com sucesso.',
      event: newEvent,
      confirmation: newConfirmation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o evento.' });
  }
});

/**
 * PATCH /event/update/:id
 * Atualiza os dados de um evento existente.
 */
router.patch('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, location, type } = req.body;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem atualizar eventos.' });
    }

    const eventId = parseInt(id);

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent || existingEvent.teamId !== teamId) {
      return res
        .status(404)
        .json({ message: 'Evento não encontrado ou não pertence ao seu time.' });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name,
        description,
        date: date !== undefined ? new Date(date) : undefined,
        location,
        type,
      },
    });

    res.status(200).json({
      message: 'Evento atualizado com sucesso.',
      event: updatedEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o evento.' });
  }
});

/**
 * DELETE /event/delete/:id
 * Deleta um evento, sua solicitação de confirmação e as associações.
 */
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem deletar eventos.' });
    }

    const eventId = parseInt(id);

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!existingEvent || existingEvent.teamId !== teamId) {
      return res
        .status(404)
        .json({ message: 'Evento não encontrado ou não pertence ao seu time.' });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.confirmationUser.deleteMany({
        where: {
          confirmation: {
            eventId: eventId,
          },
        },
      });

      await prisma.confirmation.deleteMany({
        where: {
          eventId: eventId,
        },
      });

      await prisma.event.delete({
        where: {
          id: eventId,
        },
      });
    });

    res.status(200).json({
      message: 'Evento e todas as confirmações associadas excluídos com sucesso.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar o evento.' });
  }
});

/**
 * PATCH /event/toggle-confirmation/:confirmationId
 * Alterna a presença do atleta em um evento (Confirma/Desconfirma).
 */
router.patch('/toggle-confirmation/:confirmationId', authenticateToken, async (req, res) => {
  try {
    const { confirmationId } = req.params;
    const { userId } = req.user;

    const parsedConfirmationId = parseInt(confirmationId);

    const existingConfirmation = await prisma.confirmationUser.findUnique({
      where: {
        confirmationId_userId: {
          confirmationId: parsedConfirmationId,
          userId: userId,
        },
      },
    });

    if (!existingConfirmation) {
      return res
        .status(404)
        .json({ message: 'Confirmação não encontrada ou não pertence a este usuário.' });
    }

    const newStatus = !existingConfirmation.status;
    const newConfirmedAt = newStatus ? new Date() : null;

    const updatedConfirmation = await prisma.confirmationUser.update({
      where: {
        confirmationId_userId: {
          confirmationId: parsedConfirmationId,
          userId: userId,
        },
      },
      data: {
        status: newStatus,
        confirmedAt: newConfirmedAt,
      },
    });

    const message = newStatus
      ? 'Presença confirmada com sucesso.'
      : 'Presença desconfirmada com sucesso.';

    res.status(200).json({
      message: message,
      confirmation: updatedConfirmation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao alternar a presença.' });
  }
});

export default router;
