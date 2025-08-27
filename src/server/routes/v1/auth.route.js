import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Rota de cadastro de um novo time e seu manager principal
 */
router.post('/register-team', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Validação simples
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const username = email.split('@')[0];

    // 2. Limpar o número de telefone
    const cleanedPhone = phone.replace(/\D/g, ''); // Remove tudo que não for dígito

    // 3. Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Usa uma transação para garantir que ambos os registros sejam criados
    const [newTeam, newUser] = await prisma.$transaction([
      // Primeira operação: Cria o Time
      prisma.team.create({
        data: {
          name,
          email,
          phone: cleanedPhone, // Usa o número de telefone limpo
          password: hashedPassword,
        },
      }),
      // Segunda operação: Cria o Usuário associado ao Time
      prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
          role: 'TEAM',
          team: {
            connect: { email: email },
          },
        },
      }),
    ]);

    // 5. Responde ao cliente com sucesso
    res.status(201).json({
      message: 'Time e usuário registrados com sucesso!',
      teamId: newTeam.id,
      userId: newUser.id,
    });
  } catch (error) {
    // Trata erros específicos do Prisma
    if (error.code === 'P2002') {
      // Erro de campo único (email ou phone já existe)
      return res.status(409).json({ message: 'Este e-mail ou telefone já está em uso.' });
    }
    // Erros gerais
    console.error('Erro ao registrar o time:', error);
    res.status(500).json({ message: 'Erro interno ao registrar. Tente novamente mais tarde.' });
  }
});

/**
 * Rota de login
 */
router.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      console.log('Dados de login ausentes.');
      return res
        .status(400)
        .json({ message: 'E-mail ou nome de usuário e senha são obrigatórios.' });
    }

    let user;
    let authSource = null; // Para saber de onde veio o usuário (team ou user)

    // Tenta encontrar o usuário pelo email do time
    const team = await prisma.team.findUnique({
      where: { email: loginId },
    });
    if (team) {
      const isPasswordValid = await bcrypt.compare(password, team.password);
      if (isPasswordValid) {
        user = team;
        authSource = 'team';
      } else {
        console.log('Tentativa de login por e-mail: senha incorreta.');
      }
    }

    // Se o login por e-mail falhou, tenta com o username
    if (!user) {
      const dbUser = await prisma.user.findUnique({
        where: { username: loginId },
        include: {
          team: true,
        },
      });
      if (dbUser) {
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (isPasswordValid) {
          user = dbUser;
          authSource = 'user';
        } else {
          console.log('Tentativa de login por username: senha incorreta.');
        }
      } else {
        console.log('Usuário/Time não encontrado para o loginId:', loginId);
      }
    }

    if (!user) {
      console.log('Falha no login: credenciais inválidas.');
      return res.status(401).json({ message: 'E-mail, nome de usuário ou senha inválidos' });
    }

    // Se o login foi bem-sucedido
    const tokenPayload =
      authSource === 'team'
        ? { id: user.id, role: 'TEAM', teamId: user.id }
        : { id: user.id, role: user.role, teamId: user.teamId };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...userData } = user;
    console.log(`Login bem-sucedido para o usuário: ${user.name}`);
    res.status(200).json({ message: 'Login realizado com sucesso!', token, user: userData });
  } catch (err) {
    console.error('Erro detalhado no servidor:', err);
    res.status(500).json({ message: 'Erro ao realizar login. Tente novamente.' });
  }
});

/**
 * Rota para verificar se um email já existe na base de dados
 */
router.get('/email-exists', async (req, res) => {
  try {
    const { email } = req.query; // Pega o email dos parâmetros da URL

    // Procura por um time com o email fornecido
    const team = await prisma.team.findUnique({
      where: { email },
    });

    if (team) {
      return res.status(200).json({ exists: true, message: 'Este email já está cadastrado.' });
    }

    return res.status(200).json({ exists: false, message: 'Email disponível.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao verificar o email.' });
  }
});

/**
 * Rota para verificar se um telefone já existe na base de dados
 */
router.get(
  '/phone-exists',
  (req, res, next) => {
    // Desabilita o cache para esta requisição GET
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next(); // Continua para a próxima função na rota
  },
  async (req, res) => {
    try {
      const { phone } = req.query;
      console.log('DATABASE_URL lida pelo código:', process.env.DATABASE_URL);
      if (!phone) {
        return res.status(400).json({ message: 'O número de telefone é obrigatório.' });
      }

      const team = await prisma.team.findUnique({ where: { phone } });
      const manager = await prisma.manager.findUnique({ where: { phone } });
      const athlete = await prisma.athlete.findUnique({ where: { phone } });

      if (team || manager || athlete) {
        return res.status(200).json({ exists: true, message: 'Este telefone já está cadastrado.' });
      }

      return res.status(200).json({ exists: false, message: 'Telefone disponível.' });
    } catch (err) {
      console.error('Erro ao verificar o telefone:', err);
      res.status(500).json({ message: 'Erro ao verificar o telefone.' });
    }
  }
);

export default router;
