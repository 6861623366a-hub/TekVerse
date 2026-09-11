import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import serverRoutes from './routes/serverRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import dmRoutes from './routes/dmRoutes.js';
import socketHandler from './handlers/socketHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.log('❌ MongoDB Error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/dm', dmRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'TekVerse Server is running 🚀' });
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 TekVerse Server running on port ${PORT}`);
});

export { app, io };