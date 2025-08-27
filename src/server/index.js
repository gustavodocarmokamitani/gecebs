import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import express from 'express';
import { errors } from 'celebrate';
import http from 'http';
import routes from './routes/v1/index.js';
import { securityMiddleware, requestLogger } from './middleware/security.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// Middlewares
app.use(securityMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use(errors());

// Rotas da API
app.use('/api/v1', routes);

// Servir frontend buildado (Vite gera em src/client/dist)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Qualquer rota que não for API cai no React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start server
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
