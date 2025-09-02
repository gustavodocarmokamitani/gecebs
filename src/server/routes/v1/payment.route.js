import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Funções Auxiliares
// ---
/**
 * Funcao auxiliar para recalcular e atualizar o valor total de um pagamento.
 */
const updatePaymentTotal = async (paymentId) => {
  const items = await prisma.paymentItem.findMany({
    where: { paymentId: paymentId },
  });

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  await prisma.payment.update({
    where: { id: paymentId },
    data: { value: totalValue },
  });
};

// Rotas
// ---
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
 * GET /payment/:id/confirmations
 * Busca todos os atletas de um pagamento, com seus status de pagamento.
 */
router.get('/:id/confirmations', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId } = req.user; // Removida a role, pois não é utilizada
    const paymentId = parseInt(id);

    // 1. Busca o pagamento para pegar a categoria e verificar o time
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { categoryId: true, teamId: true },
    });

    if (!payment || payment.teamId !== teamId) {
      return res.status(404).json({ message: 'Pagamento não encontrado ou acesso negado.' });
    }

    // 2. Busca todos os atletas da categoria do pagamento
    const categoryAthletes = await prisma.categoryAthlete.findMany({
      where: { categoryId: payment.categoryId },
      include: {
        athlete: {
          select: {
            firstName: true,
            lastName: true,
            user: { select: { id: true } },
          },
        },
      },
    });

    // 3. Busca os pagamentos confirmados para este pagamento
    const paidBy = await prisma.paymentUser.findMany({
      where: { paymentId: paymentId },
      select: {
        userId: true,
        paidAt: true,
      },
    });

    // 4. Mapeia e cruza os dados
    const athletesWithStatus = categoryAthletes.map((catAthlete) => {
      const paymentStatus = paidBy.find((p) => p.userId === catAthlete.athlete.user.id);
      return {
        userId: catAthlete.athlete.user.id,
        firstName: catAthlete.athlete.firstName,
        lastName: catAthlete.athlete.lastName,
        status: !!paymentStatus?.paidAt, // true = pago, false = não pago
      };
    });

    res.status(200).json(athletesWithStatus);
  } catch (err) {
    console.error('Erro ao buscar status de pagamento:', err);
    res.status(500).json({ message: 'Erro ao buscar status de pagamento.' });
  }
});

/**
 * GET /payment/get-by-id/:id
 * Busca um pagamento específico por ID, incluindo seus itens.
 * RENOMEADA A ROTA PARA EVITAR CONFLITOS.
 */
router.get('/get-by-id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId } = req.user; // Removida a role, pois não é utilizada

    const paymentId = parseInt(id);

    // Verificação de ID inválido
    if (isNaN(paymentId)) {
      return res.status(400).json({ message: 'ID de pagamento inválido.' });
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        items: true,
        event: true,
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
 * PATCH /payment/item/:id
 * Atualiza um item de pagamento e recalcula o valor total do pagamento.
 */
router.patch('/item/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, quantityEnabled } = req.body;
    const { teamId } = req.user;

    const itemId = parseInt(id);
    const itemValue = parseFloat(value);

    // 1. Verifique se o item de pagamento pertence ao time do usuário
    const item = await prisma.paymentItem.findUnique({
      where: { id: itemId },
      include: { payment: true },
    });

    if (!item || item.payment.teamId !== teamId) {
      return res.status(404).json({ message: 'Item não encontrado ou acesso negado.' });
    }

    // 2. Atualize o item
    const updatedItem = await prisma.paymentItem.update({
      where: { id: itemId },
      data: {
        name,
        value: itemValue,
        quantityEnabled,
      },
    });

    // 3. Recalcule e atualize o valor total do pagamento.
    await updatePaymentTotal(item.payment.id);

    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o item do pagamento.' });
  }
});

/**
 * GET /payment/list-all-team-payments
 * **DUPLICADA:** A rota `list-all-team-payments` já existe no topo do arquivo. Remova esta rota duplicada.
 */
// router.get('/list-all-team-payments', authenticateToken, async (req, res) => {
//   ... (Remova este bloco)
// });

/**
 * GET /payment/list-all-payments-athletics
 * Lista todos os pagamentos de um atleta, filtrados por sua categoria.
 */
router.get('/list-all-payments-athletics', authenticateToken, async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    if (role !== 'ATHLETE') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas atletas podem listar seus pagamentos.' });
    }

    // 1. Buscar o ID do atleta associado ao userId
    const athlete = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        athlete: {
          select: {
            id: true,
          },
        },
      },
    });

    // Se não for encontrado, retorne uma lista vazia
    if (!athlete || !athlete.athlete) {
      return res.status(200).json([]);
    }

    const athleteId = athlete.athlete.id;

    // 2. Buscar todas as categorias do atleta usando a tabela de junção
    const athleteCategories = await prisma.categoryAthlete.findMany({
      where: { athleteId: athleteId },
      select: {
        categoryId: true,
      },
    });

    const athleteCategoryIds = athleteCategories.map((cat) => cat.categoryId);

    // Se não houver categorias, retorne uma lista vazia
    if (athleteCategoryIds.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Listar os pagamentos do atleta, filtrando pelos pagamentos que têm uma de suas categorias
    const myPayments = await prisma.paymentUser.findMany({
      where: {
        userId: userId,
        // Filtra pelo evento associado ao pagamento, que por sua vez deve pertencer a uma das categorias do atleta
        OR: [
          { payment: { isFinalized: false, event: { categoryId: { in: athleteCategoryIds } } } },
          { payment: { event: null } }, // inclui payments sem evento
        ],
      },
      include: {
        payment: {
          select: {
            id: true,
            name: true,
            value: true,
            dueDate: true,
            pixKey: true,
            items: true,
          },
        },
      },
      orderBy: [
        { paidAt: 'desc' }, // pagos primeiro, não pagos depois
        { payment: { dueDate: 'desc' } }, // dentro de cada grupo, mais recentes primeiro
      ],
    });

    res.status(200).json(myPayments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar os pagamentos do atleta.' });
  }
});

/**
 * GET /payment/list-all-payments-athletics
 * Lista todos os pagamentos de um atleta, filtrados por sua categoria. Para atletas
 */
router.get('/list-all-payments-athletics-all', authenticateToken, async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    if (role !== 'ATHLETE') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas atletas podem listar seus pagamentos.' });
    }

    // 1. Buscar o ID do atleta associado ao userId
    const athlete = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        athlete: {
          select: {
            id: true,
          },
        },
      },
    });

    // Se não for encontrado, retorne uma lista vazia
    if (!athlete || !athlete.athlete) {
      return res.status(200).json([]);
    }

    const athleteId = athlete.athlete.id;

    // 2. Buscar todas as categorias do atleta usando a tabela de junção
    const athleteCategories = await prisma.categoryAthlete.findMany({
      where: { athleteId: athleteId },
      select: {
        categoryId: true,
      },
    });

    const athleteCategoryIds = athleteCategories.map((cat) => cat.categoryId);

    // Se não houver categorias, retorne uma lista vazia
    if (athleteCategoryIds.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Listar os pagamentos do atleta, filtrando pelos pagamentos que têm uma de suas categorias
    const myPayments = await prisma.paymentUser.findMany({
      where: {
        userId: userId,
        // Filtra pelo evento associado ao pagamento, que por sua vez deve pertencer a uma das categorias do atleta
        OR: [
          { payment: { event: { categoryId: { in: athleteCategoryIds } } } },
          { payment: { event: null } }, // inclui payments sem evento
        ],
      },
      include: {
        payment: {
          select: {
            id: true,
            name: true,
            value: true,
            dueDate: true,
            pixKey: true,
            items: true,
            isFinalized: true,
          },
        },
      },
      orderBy: [
        { paidAt: 'desc' }, // pagos primeiro, não pagos depois
        { payment: { dueDate: 'desc' } }, // dentro de cada grupo, mais recentes primeiro
      ],
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
 * PATCH /payment/finalize/:id
 * Finaliza um pagamento, tornando-o não-editável.
 */
router.patch('/finalize/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, role } = req.user;

    // Verificação de permissão: Apenas managers ou equipes podem finalizar pagamentos.
    if (role !== 'MANAGER' && role !== 'TEAM') {
      return res
        .status(403)
        .json({ message: 'Acesso negado. Apenas managers ou equipes podem finalizar pagamentos.' });
    }

    const paymentId = parseInt(id);

    // 1. Busca o pagamento para verificar se ele pertence ao time do usuário
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

    // 2. Verifica se o pagamento já foi finalizado
    if (existingPayment.isFinalized) {
      return res.status(400).json({ message: 'Este pagamento já está finalizado.' });
    }

    // 3. Atualiza o pagamento, definindo isFinalized para true
    const finalizedPayment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        isFinalized: true,
      },
    });

    res.status(200).json({
      message: 'Pagamento finalizado com sucesso.',
      payment: finalizedPayment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao finalizar o pagamento.' });
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
    // Extrai o 'id' do objeto req.user, que foi anexado pelo middleware
    const { id } = req.user;

    // Use o 'id' do usuário para a query
    const existingPaymentUser = await prisma.paymentUser.findUnique({
      where: {
        paymentId_userId: {
          paymentId: parseInt(paymentId),
          userId: id, // <--- Agora usa a variável 'id'
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
          userId: id, // <--- Aqui também
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

    // Cria o novo item
    const newItem = await prisma.paymentItem.create({
      data: {
        name,
        value: itemValue,
        quantityEnabled,
        paymentId: paymentId,
      },
    });

    // Recalcula e atualiza o valor total do pagamento
    await updatePaymentTotal(paymentId);

    res.status(201).json({
      message: 'Item adicionado e pagamento atualizado com sucesso.',
      item: newItem,
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

    // Primeiro, encontra o item para obter o paymentId
    const itemToDelete = await prisma.paymentItem.findUnique({
      where: { id: paymentItemId },
    });

    if (!itemToDelete) {
      return res.status(404).json({ message: 'Item não encontrado.' });
    }

    // Deleta o item
    const deletedItem = await prisma.paymentItem.delete({
      where: { id: paymentItemId },
    });

    // Recalcula e atualiza o valor total do pagamento
    await updatePaymentTotal(itemToDelete.paymentId);

    res.status(200).json({
      message: 'Item deletado e pagamento atualizado com sucesso.',
      item: deletedItem,
    });
  } catch (err) {
    console.error('Erro na rota DELETE /payment/item/:itemId:', err);
    res.status(500).json({ message: 'Erro ao deletar o item.' });
  }
});

/**
 * GET /payment/details/:id
 * Busca os detalhes de um pagamento, incluindo a lista de itens.
 * Esta rota deve ser acessível por atletas.
 */
router.get('/details/:id', authenticateToken, async (req, res) => {
  try {
    const { id: paymentId } = req.params; // Using alias to avoid conflict
    const { id: userId } = req.user; // ✅ CORRIGIDO: Destruturação para 'id'

    // 1. Encontra o registro PaymentUser para o usuário logado e o pagamento
    const paymentUser = await prisma.paymentUser.findUnique({
      where: {
        paymentId_userId: {
          paymentId: parseInt(paymentId),
          userId: userId, // ✅ Usando a variável corrigida
        },
      },
    });

    if (!paymentUser) {
      return res.status(404).json({ message: 'Pagamento não encontrado para este usuário.' });
    }

    // 2. Busca os detalhes do pagamento e seus itens
    const paymentDetails = await prisma.payment.findUnique({
      where: {
        id: parseInt(paymentId),
      },
      include: {
        items: true, // Corrigido para 'items' conforme a sua rota 'get-by-id'
      },
    });

    if (!paymentDetails) {
      return res.status(404).json({ message: 'Pagamento não encontrado.' });
    }

    res.status(200).json(paymentDetails);
  } catch (err) {
    console.error('Erro ao buscar detalhes do pagamento:', err);
    res.status(500).json({ message: 'Erro ao buscar detalhes do pagamento.' });
  }
});

/**
 * POST /payment/process-with-items
 * Processa o pagamento de um usuário, marcando-o como 'pago' e
 * registrando os itens selecionados nas tabelas Confirmation e ConfirmationItem.
 */
router.post('/process-with-items', authenticateToken, async (req, res) => {
  try {
    const { paymentId, selectedItems } = req.body;
    const { id: userId } = req.user;

    const parsedPaymentId = parseInt(paymentId);

    // Use uma transação para garantir que todas as operações sejam atômicas.
    const result = await prisma.$transaction(async (tx) => {
      // 1. Encontra o pagamento para verificar o ID do evento, se existir
      const payment = await tx.payment.findUnique({
        where: { id: parsedPaymentId },
        select: { eventId: true },
      });
      if (!payment) {
        throw new Error('Pagamento não encontrado.');
      }

      // 2. Cria um novo registro na tabela Confirmation, vinculado ao evento.
      //    Se o pagamento não estiver vinculado a um evento, você pode ajustar
      //    o schema para permitir o eventId nulo ou criar um Confirmation sem
      //    essa relação. Vamos assumir que há um evento.
      if (!payment.eventId) {
        throw new Error(
          'Pagamento não está vinculado a um evento, não é possível criar uma confirmação.'
        );
      }

      const newConfirmation = await tx.confirmation.create({
        data: {
          eventId: payment.eventId,
        },
      });

      // 3. Atualiza o registro PaymentUser para marcar como pago
      //    Ainda é útil para rastrear quem pagou.
      const confirmedPaymentUser = await tx.paymentUser.update({
        where: {
          paymentId_userId: {
            paymentId: parsedPaymentId,
            userId: userId,
          },
        },
        data: {
          paidAt: new Date(),
        },
      });

      // 4. Conecta o usuário à nova confirmação
      const confirmedUserInConfirmation = await tx.confirmationUser.create({
        data: {
          confirmationId: newConfirmation.id,
          userId: userId,
          status: true,
          confirmedAt: new Date(),
        },
      });

      // 5. Cria os registros em ConfirmationItem usando o ID da nova confirmação
      const confirmationItemsData = Object.entries(selectedItems).map(([itemId, quantity]) => ({
        paymentItemId: parseInt(itemId),
        quantity: quantity,
        confirmationId: newConfirmation.id,
        userId: userId,
      }));

      // Cria múltiplos registros de uma vez
      await tx.confirmationItem.createMany({
        data: confirmationItemsData,
      });

      return { confirmedPaymentUser, newConfirmation };
    });

    res.status(200).json({
      message: 'Pagamento confirmado e itens registrados com sucesso.',
      confirmation: result.newConfirmation,
    });
  } catch (err) {
    console.error('Erro ao processar o pagamento:', err.message);
    res.status(500).json({ message: err.message || 'Erro ao processar o pagamento.' });
  }
});

/**
 * GET /api/v1/payment/:paymentId/summary
 * Retorna a soma do valor total e a contagem de itens de todos os pagamentos confirmados
 * para um pagamento específico.
 */
router.get('/:paymentId/summary', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const parsedPaymentId = parseInt(paymentId);

    // Encontrar os ConfirmationItem relacionados aos pagamentos confirmados
    const confirmationItems = await prisma.confirmationItem.findMany({
      where: {
        paymentItem: {
          paymentId: parsedPaymentId,
        },
      },
      include: {
        paymentItem: true, // Inclui os detalhes do item para obter o valor
      },
    });

    // Calcular o valor total e a quantidade total de itens
    let totalValueReceived = 0;
    let totalItemsPaid = 0;

    confirmationItems.forEach((item) => {
      totalValueReceived += item.paymentItem.value * item.quantity;
      totalItemsPaid += item.quantity;
    });

    res.status(200).json({
      totalValueReceived,
      totalItemsPaid,
    });
  } catch (err) {
    console.error('Erro ao obter o resumo do pagamento:', err);
    res.status(500).json({ message: 'Erro ao obter o resumo do pagamento.' });
  }
});

export default router;
