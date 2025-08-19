import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Rota de cadastro de um novo time e seu manager principal
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; // <-- AQUI: Mudei de teamName para name

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Passo 1: Criar o time
    const newTeam = await prisma.team.create({
      data: {
        name: name, // <-- AQUI: Agora a variável 'name' tem o valor correto
        email: email,
        password: hashedPassword,
        phone: phone,
      },
    });

    // Responder com o time e o usuário criados
    res.status(201).json({
      message: 'Time cadastrado com sucesso!',
      team: newTeam,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao cadastrar o time' });
  }
});

/**
 * Rota de login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // AVISO: Seu endpoint de login está procurando por um 'user', mas o de registro
    // está criando um 'team'. Você precisará ajustar isso. O login precisa
    // procurar por um time ou criar um usuário durante o registro.
    const user = await prisma.user.findUnique({
      where: { username },
      include: { team: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Nome de usuário ou senha inválidos' });
    }

    // Comparar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nome de usuário ou senha inválidos' });
    }

    // Gerar o JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role, teamId: user.teamId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login realizado com sucesso', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
});

export default router;
