import { Router } from 'express';
import errorHandler from 'strong-error-handler';
import authRoutes from './auth.route.js';
import categoryRoutes from './category.route.js';
import athleteRoutes from './athlete.route.js';
import userRoutes from './user.route.js';
import eventRoutes from './event.route.js';
import paymentRoutes from './payment.route.js';
import managerRoutes from './manager.route.js';
import teamRoutes from './team.route.js';

const router = Router();

// Adicione a rota de autenticação
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/athlete', athleteRoutes);
router.use('/user', userRoutes);
router.use('/event', eventRoutes);
router.use('/payment', paymentRoutes);
router.use('/manager', managerRoutes);
router.use('/team', teamRoutes);

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
