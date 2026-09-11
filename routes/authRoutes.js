import express from 'express';
import rateLimit from 'express-rate-limit';
import { validationResult, body } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rate limit más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login. Intenta más tarde.'
});

router.post('/register',
  authLimiter,
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Usuario debe tener 3-20 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Contraseña debe tener mínimo 8 caracteres'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Verificar si existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(409).json({ message: 'Email o usuario ya existe' });
      }

      let newUser = new User({ username, email, password });

      // Primer usuario es founder
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        newUser.role = 'founder';
        newUser.tiers.current = 'supreme';
        newUser.tiers.perks = ['unlimited_uploads', 'hd_streaming', 'custom_status', 'early_access', 'priority_support'];
        console.log('👑 Primer usuario registrado como Founder');
      }

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          tiers: newUser.tiers
        }
      });
    } catch (error) {
      console.error('Error registering:', error);
      res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
  }
);

router.post('/login',
  authLimiter,
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      // Actualizar último login
      user.status = 'online';
      await user.save();

      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          tiers: user.tiers,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  }
);

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('servers')
      .populate('friends')
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

router.post('/refresh-token', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al refrescar token', error: error.message });
  }
});

export default router;