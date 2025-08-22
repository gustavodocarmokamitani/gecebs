import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    } // Aqui está o ajuste importante!
    // Anexamos apenas as informações necessárias diretamente ao req.user

    req.user = {
      id: userPayload.id,
      role: userPayload.role,
      teamId: userPayload.teamId,
    };
    next();
  });
};

export { authenticateToken };
