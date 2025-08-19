import { Router } from 'express';
import errorHandler from 'strong-error-handler';
import authRoutes from './auth.route.js';
import categoryRoutes from './category.route.js';
import userRoutes from './user.route.js';

const router = Router();

// Adicione a rota de autenticação
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/user', userRoutes);

/**
 * GET /health
 * Health check endpoint.
 */
router.get('/health', (req, res) => {
  res.send('Ok');
});

// Error handling middleware
router.use(
  errorHandler({
    debug: process.env.ENV !== 'prod',
    log: true,
  })
);

export default router;
