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

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const username = email.split('@')[0];

    const cleanedPhone = phone.replace(/\D/g, '');

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newTeam, newUser] = await prisma.$transaction([
      prisma.team.create({
        data: {
          name,
          email,
          phone: cleanedPhone,
          password: hashedPassword,
        },
      }),
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

    res.status(201).json({
      message: 'Time e usuário registrados com sucesso!',
      teamId: newTeam.id,
      userId: newUser.id,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Este e-mail ou telefone já está em uso.' });
    }
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
      return res
        .status(400)
        .json({ message: 'E-mail ou nome de usuário e senha são obrigatórios.' });
    }

    let user;
    let authSource = null;

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
    const { email } = req.query;

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
router.get('/phone-exists', async (req, res) => {
  try {
    const { phone } = req.query;
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
});

export default router;
