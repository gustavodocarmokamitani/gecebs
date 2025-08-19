import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /event/list-all-team-events
 * Lista todos os eventos criados para um time.
 */
router.get('/list-all-team-events', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    // Apenas managers podem ver todos os eventos do time
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem listar todos os eventos do time.' });
    }

    const events = await prisma.event.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os eventos do time.' });
  }
});

/**
 * GET /event/list-my-events
 * Lista todos os eventos aos quais o atleta está associado.
 */
router.get('/list-all-events-athletics', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    // Apenas atletas podem listar seus próprios eventos
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

    // Extrai apenas os dados do evento para a resposta
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
 * POST /event/create
 * Cria um novo evento e uma solicitação de confirmação para todos os atletas.
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, date, location, type } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem criar eventos
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem criar eventos.' });
    }

    // Passo 1: Criar o evento na tabela Event
    const newEvent = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        type,
        teamId,
      },
    });

    // Passo 2: Criar a solicitação de confirmação para o evento
    const newConfirmation = await prisma.confirmation.create({
      data: {
        name: `Confirmação para: ${name}`,
        eventId: newEvent.id,
      },
    });

    // Passo 3: Encontrar todos os atletas do time
    const athletes = await prisma.user.findMany({
      where: {
        teamId: teamId,
        role: 'ATHLETE',
      },
    });

    // Passo 4: Criar uma associação na tabela ConfirmationUser para cada atleta
    const confirmationUsersData = athletes.map((athlete) => ({
      confirmationId: newConfirmation.id,
      userId: athlete.id,
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

    // Apenas managers podem atualizar eventos
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem atualizar eventos.' });
    }

    const eventId = parseInt(id);

    // Encontra o evento e garante que ele pertence ao time do manager
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

    // Atualiza apenas os campos que foram enviados na requisição
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

    // Apenas managers podem deletar eventos
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem deletar eventos.' });
    }

    const eventId = parseInt(id);

    // Encontra o evento e garante que ele pertence ao time do manager
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

    // Inicia uma transação para garantir que tudo seja deletado
    await prisma.$transaction(async (prisma) => {
      // 1. Deleta as associações na tabela ConfirmationUser
      await prisma.confirmationUser.deleteMany({
        where: {
          confirmation: {
            eventId: eventId,
          },
        },
      });

      // 2. Deleta a solicitação de confirmação
      await prisma.confirmation.deleteMany({
        where: {
          eventId: eventId,
        },
      });

      // 3. Deleta o evento
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
 * POST /event/confirm/:confirmationId
 * Confirma a presença do atleta em um evento.
 */
router.post('/confirm/:confirmationId', authenticateToken, async (req, res) => {
  try {
    const { confirmationId } = req.params;
    const { userId } = req.user;

    const parsedConfirmationId = parseInt(confirmationId);

    // Procura a entrada na tabela de junção ConfirmationUser
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

    // Se já foi confirmado, retorna uma mensagem
    if (existingConfirmation.confirmedAt) {
      return res.status(400).json({ message: 'A presença já foi confirmada para este evento.' });
    }

    // Atualiza a data de confirmação para a data atual
    const confirmedPresence = await prisma.confirmationUser.update({
      where: {
        confirmationId_userId: {
          confirmationId: parsedConfirmationId,
          userId: userId,
        },
      },
      data: {
        confirmedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Presença confirmada com sucesso.',
      confirmation: confirmedPresence,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao confirmar a presença.' });
  }
});

export default router;
