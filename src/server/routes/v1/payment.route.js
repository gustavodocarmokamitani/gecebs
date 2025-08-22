import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /payment/list-all-team-payments
 * Lista todos os pagamentos criados para um time.
 */
router.get('/list-all-team-payments', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas managers ou equipes podem listar os pagamentos do time.',
      });
    }

    const payments = await prisma.payment.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        dueDate: 'desc',
      },
      include: {
        category: true,
        paidBy: {
          include: {
            user: {
              include: {
                // Seleciona os dados do atleta, incluindo firstName e lastName
                athlete: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
                // Seleciona os dados do manager, incluindo firstName e lastName
                manager: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        items: true,
      },
    });

    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os pagamentos do time.' });
  }
});

/**
 * GET /payment/:id
 * Busca um pagamento específico por ID, incluindo seus itens.
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    const paymentId = parseInt(id);

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        items: true, // Inclui todos os PaymentItems associados
      },
    });

    if (!payment || payment.teamId !== teamId) {
      return res.status(404).json({ message: 'Pagamento não encontrado ou acesso negado.' });
    }

    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar o pagamento.' });
  }
});

/**
 * GET /payment/list-all-team-payments
 * Lista todos os pagamentos criados para um time.
 */
router.get('/list-all-team-payments', authenticateToken, async (req, res) => {
  try {
    const { teamId, role } = req.user;

    // Apenas managers podem ver todos os pagamentos do time
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({
        message: 'Acesso negado. Apenas managers podem listar todos os pagamentos do time.',
      });
    }

    const payments = await prisma.payment.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os pagamentos do time.' });
  }
});

/**
 * GET /payment/list-my-payments
 * Lista todos os pagamentos de um atleta.
 */
router.get('/list-all-payments-athletics', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    // Apenas atletas podem listar seus próprios pagamentos
    if (role !== 'ATHLETE') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas atletas podem listar seus pagamentos.' });
    }

    const myPayments = await prisma.paymentUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        payment: {
          select: {
            id: true,
            name: true,
            value: true,
            dueDate: true,
            pixKey: true,
            items: true, // Incluindo os itens para o atleta
          },
        },
      },
      orderBy: {
        payment: {
          dueDate: 'desc',
        },
      },
    });

    res.status(200).json(myPayments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os pagamentos do atleta.' });
  }
});

/**
 * POST /payment/create-payment
 * Cria um novo pagamento com valor inicial 0.
 */
router.post('/create-payment', authenticateToken, async (req, res) => {
  try {
    const { name, dueDate, pixKey, categoryId, eventId } = req.body;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem criar pagamentos.' });
    }

    // Passo 1: Criar o pagamento na tabela Payment com valor inicial 0
    const newPayment = await prisma.payment.create({
      data: {
        name,
        value: 0.0, // O valor é inicializado como 0.0
        dueDate: new Date(dueDate),
        pixKey,
        teamId,
        categoryId: parseInt(categoryId),
        eventId: eventId ? parseInt(eventId) : null,
      },
    });

    // Passo 2: Associar o pagamento aos atletas da categoria
    const categoryAthletes = await prisma.categoryAthlete.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      include: {
        athlete: {
          include: {
            user: true,
          },
        },
      },
    });

    const paymentUsersData = categoryAthletes.map((categoryAthlete) => ({
      paymentId: newPayment.id,
      userId: categoryAthlete.athlete.user.id,
    }));

    await prisma.paymentUser.createMany({
      data: paymentUsersData,
    });

    // Retorna o novo pagamento para que o frontend possa usar o ID
    res.status(201).json(newPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o pagamento.' });
  }
});

/**
 * PATCH /payment/update/:id
 * Atualiza os dados de um pagamento existente.
 */
router.patch('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dueDate, pixKey, categoryId, eventId } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem atualizar pagamentos
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem atualizar pagamentos.' });
    }

    const paymentId = parseInt(id);

    const existingPayment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!existingPayment || existingPayment.teamId !== teamId) {
      return res
        .status(404)
        .json({ message: 'Pagamento não encontrado ou não pertence ao seu time.' });
    }

    const updatedPayment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        name,
        dueDate: dueDate !== undefined ? new Date(dueDate) : undefined,
        pixKey,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : undefined,
        eventId: eventId !== undefined ? parseInt(eventId) : undefined,
      },
    });

    res.status(200).json({
      message: 'Pagamento atualizado com sucesso.',
      payment: updatedPayment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o pagamento.' });
  }
});

/**
 * DELETE /payment/delete/:id
 * Deleta um pagamento e suas associações com os atletas e itens.
 */
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem deletar pagamentos.' });
    }

    const paymentId = parseInt(id);

    const existingPayment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!existingPayment || existingPayment.teamId !== teamId) {
      return res
        .status(404)
        .json({ message: 'Pagamento não encontrado ou não pertence ao seu time.' });
    }

    await prisma.paymentUser.deleteMany({
      where: {
        paymentId: paymentId,
      },
    });

    // Novo: Deleta os itens de pagamento associados
    await prisma.paymentItem.deleteMany({
      where: {
        paymentId: paymentId,
      },
    });

    const deletedPayment = await prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });

    res.status(200).json({
      message: 'Pagamento excluído com sucesso.',
      payment: deletedPayment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao confirmar o pagamento.' });
  }
});

/**
 * POST /payment/confirm
 * Confirma o pagamento de um item para o usuário logado.
 */
router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.body;
    const { userId } = req.user;

    const existingPaymentUser = await prisma.paymentUser.findUnique({
      where: {
        paymentId_userId: {
          paymentId: parseInt(paymentId),
          userId: userId,
        },
      },
    });

    if (!existingPaymentUser) {
      return res
        .status(404)
        .json({ message: 'Pagamento não encontrado ou não pertence a este usuário.' });
    }

    if (existingPaymentUser.paidAt) {
      return res.status(400).json({ message: 'Este pagamento já foi confirmado.' });
    }

    const confirmedPayment = await prisma.paymentUser.update({
      where: {
        paymentId_userId: {
          paymentId: parseInt(paymentId),
          userId: userId,
        },
      },
      data: {
        paidAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Pagamento confirmado com sucesso.',
      confirmation: confirmedPayment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao confirmar o pagamento.' });
  }
});

/**
 * POST /payment/:id/items
 * Adiciona um item a um pagamento existente e atualiza o valor total.
 */
router.post('/:id/items', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, quantityEnabled } = req.body;
    const { role } = req.user;
    const paymentId = parseInt(id);
    const itemValue = parseFloat(value);

    // Verificação de permissão
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // A transação garante que as duas operações ocorram juntas
    const [newItem, updatedPayment] = await prisma.$transaction([
      // 1. Cria o novo item
      prisma.paymentItem.create({
        data: {
          name,
          value: itemValue,
          quantityEnabled,
          paymentId: paymentId,
        },
      }),
      // 2. Incrementa o valor do pagamento
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          value: {
            increment: itemValue,
          },
        },
      }),
    ]);

    res.status(201).json({
      message: 'Item adicionado e pagamento atualizado com sucesso.',
      item: newItem,
      payment: updatedPayment,
    });
  } catch (err) {
    console.error('Erro na rota POST /payment/:id/items:', err);
    res.status(500).json({ message: 'Erro ao adicionar o item.' });
  }
});

/**
 * DELETE /payment/item/:itemId
 * Deleta um item de pagamento e atualiza o valor total.
 */
router.delete('/item/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { role } = req.user;
    const paymentItemId = parseInt(itemId);

    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Primeiro, encontra o item para obter o valor e o paymentId
    const itemToDelete = await prisma.paymentItem.findUnique({
      where: { id: paymentItemId },
    });

    if (!itemToDelete) {
      return res.status(404).json({ message: 'Item não encontrado.' });
    }

    // A transação garante que as duas operações ocorram juntas
    const [deletedItem, updatedPayment] = await prisma.$transaction([
      // 1. Decrementa o valor do pagamento
      prisma.payment.update({
        where: { id: itemToDelete.paymentId },
        data: {
          value: {
            decrement: itemToDelete.value,
          },
        },
      }),
      // 2. Deleta o item
      prisma.paymentItem.delete({
        where: { id: paymentItemId },
      }),
    ]);

    res.status(200).json({
      message: 'Item deletado e pagamento atualizado com sucesso.',
      item: deletedItem,
      payment: updatedPayment,
    });
  } catch (err) {
    console.error('Erro na rota DELETE /payment/item/:itemId:', err);
    res.status(500).json({ message: 'Erro ao deletar o item.' });
  }
});

export default router;
