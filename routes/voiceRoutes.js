import express from 'express';
import VoiceCall from '../models/VoiceCall.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', verifyToken, async (req, res) => {
  try {
    const { channelId, serverId } = req.body;
    const call = new VoiceCall({
      participants: [{ user: req.user.id }],
      channel: channelId,
      server: serverId,
      status: 'active'
    });
    await call.save();
    res.status(201).json({ message: 'Call started', call });
  } catch (error) {
    res.status(500).json({ message: 'Error starting call', error: error.message });
  }
});

router.post('/:id/end', verifyToken, async (req, res) => {
  try {
    const call = await VoiceCall.findByIdAndUpdate(
      req.params.id,
      { status: 'ended', endedAt: new Date() },
      { new: true }
    );
    res.json({ message: 'Call ended', call });
  } catch (error) {
    res.status(500).json({ message: 'Error ending call', error: error.message });
  }
});

router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const call = await VoiceCall.findById(req.params.id);
    call.participants.push({ user: req.user.id });
    await call.save();
    res.json({ message: 'Joined call', call });
  } catch (error) {
    res.status(500).json({ message: 'Error joining call', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const call = await VoiceCall.findById(req.params.id).populate('participants.user');
    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call', error: error.message });
  }
});

export default router;