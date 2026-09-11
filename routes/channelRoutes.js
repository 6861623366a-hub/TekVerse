import express from 'express';
import Channel from '../models/Channel.js';
import Server from '../models/Server.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, server, type, category, topic, nsfw } = req.body;
    
    const srv = await Server.findById(server);
    if (srv.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only server owner can create channels' });
    }
    
    let newChannel = new Channel({
      name,
      description,
      server,
      type,
      category,
      topic,
      nsfw,
      position: srv.channels.length
    });
    
    await newChannel.save();
    srv.channels.push(newChannel._id);
    await srv.save();
    
    res.status(201).json({ message: 'Channel created', channel: newChannel });
  } catch (error) {
    res.status(500).json({ message: 'Error creating channel', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('messages')
      .populate('server');
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channel', error: error.message });
  }
});

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, topic, nsfw } = req.body;
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      { name, description, topic, nsfw },
      { new: true }
    );
    
    res.json({ message: 'Channel updated', channel: updatedChannel });
  } catch (error) {
    res.status(500).json({ message: 'Error updating channel', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Channel deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting channel', error: error.message });
  }
});

export default router;