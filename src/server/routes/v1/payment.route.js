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

    // Apenas managers podem ver todos os pagamentos do time
    if (role !== 'MANAGER') {
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

// Rota para criar um pagamento
router.post('/create-payment', authenticateToken, async (req, res) => {
  try {
    const { name, value, dueDate, pixKey, categoryId } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem criar pagamentos
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem criar pagamentos.' });
    }

    // Passo 1: Criar o pagamento na tabela Payment
    const newPayment = await prisma.payment.create({
      data: {
        name,
        value: parseFloat(value),
        dueDate: new Date(dueDate),
        pixKey,
        teamId,
        categoryId: parseInt(categoryId),
      },
    });

    // Passo 2: Encontrar todos os atletas do time
    const athletes = await prisma.user.findMany({
      where: {
        teamId: teamId,
        role: 'ATHLETE',
      },
    });

    // Passo 3: Criar uma associação na tabela PaymentUser para cada atleta
    const paymentUsersData = athletes.map((athlete) => ({
      paymentId: newPayment.id,
      userId: athlete.id,
    }));

    await prisma.paymentUser.createMany({
      data: paymentUsersData,
    });

    res.status(201).json({
      message: 'Pagamento criado e associado a todos os atletas do time com sucesso.',
      payment: newPayment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar o pagamento.' });
  }
});

/**
 * PATCH /payment/update/:id
 * Atualiza os dados de um pagamento existente.
 */
router.patch('/payment/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, dueDate, pixKey, categoryId } = req.body;
    const { teamId, role } = req.user;

    // Apenas managers podem atualizar pagamentos
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem atualizar pagamentos.' });
    }

    // Converte o ID do parâmetro para um número
    const paymentId = parseInt(id);

    // Encontra o pagamento e garante que ele pertence ao time do manager
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

    // Atualiza apenas os campos que foram enviados na requisição
    const updatedPayment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        name,
        value: value !== undefined ? parseFloat(value) : undefined,
        dueDate: dueDate !== undefined ? new Date(dueDate) : undefined,
        pixKey,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : undefined,
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
 * Deleta um pagamento e suas associações com os atletas.
 */
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    // Apenas managers podem deletar pagamentos
    if (role !== 'MANAGER') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers podem deletar pagamentos.' });
    }

    const paymentId = parseInt(id);

    // 1. Verifica se o pagamento existe e pertence ao time do manager
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

    // 2. Deleta as associações na tabela PaymentUser para evitar erros de restrição
    await prisma.paymentUser.deleteMany({
      where: {
        paymentId: paymentId,
      },
    });

    // 3. Deleta o pagamento da tabela Payment
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
router.post('/payment/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.body;
    const { userId } = req.user;

    // Procura a entrada na tabela de junção PaymentUser
    // Garante que o pagamento existe e pertence ao usuário
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

    // Se já foi pago, retorna uma mensagem
    if (existingPaymentUser.paidAt) {
      return res.status(400).json({ message: 'Este pagamento já foi confirmado.' });
    }

    // Atualiza a data de pagamento para a data atual
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

export default router;
