import express from 'express';
import Message from '../models/Message.js';
import Channel from '../models/Channel.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, channel, server, attachments } = req.body;
    
    let newMessage = new Message({
      content,
      author: req.user.id,
      channel,
      server,
      attachments
    });
    
    await newMessage.save();
    await Channel.findByIdAndUpdate(channel, { $push: { messages: newMessage._id } });
    
    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);
    
    if (message.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Can only edit your own messages' });
    }
    
    message.content = content;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();
    
    res.json({ message: 'Message edited', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error editing message', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (message.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Can only delete your own messages' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
});

router.post('/:id/react', verifyToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);
    
    let reaction = message.reactions.find(r => r.emoji === emoji);
    if (!reaction) {
      message.reactions.push({ emoji, users: [req.user.id] });
    } else {
      if (!reaction.users.includes(req.user.id)) {
        reaction.users.push(req.user.id);
      }
    }
    
    await message.save();
    res.json({ message: 'Reaction added', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reaction', error: error.message });
  }
});

router.get('/channel/:channelId', async (req, res) => {
  try {
    const messages = await Message.find({ channel: req.params.channelId })
      .populate('author')
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

export default router;