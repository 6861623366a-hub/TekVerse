import express from 'express';

const router = express.Router();

// Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'TekVerse API funcionando correctamente ✅' });
});

// Health check detallado
router.get('/status', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

export default router;