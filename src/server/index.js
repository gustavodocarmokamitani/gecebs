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

// Trust the proxy to get the client's real IP, required for express-rate-limit to work correctly in production
app.set('trust proxy', 1);

// Middlewares
app.use(cors());
app.use(securityMiddleware);
app.use(requestLogger);
app.use(express.json());

// Routes for the API
app.use('/api/v1', routes);

// Serve the built front-end (Vite generates the build in the 'dist' folder at the project root)
// The path '../../dist' correctly navigates from 'src/server' to the root 'dist' folder.
const clientDistPath = path.join(__dirname, '../../dist');
app.use(express.static(clientDistPath));

// For any route that's not an API, fall back to the React Router's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Celebrate's error handling middleware, placed after API routes
app.use(errors());

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start the server
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080; // Changed default port to 8080 to match your Dockerfile
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
