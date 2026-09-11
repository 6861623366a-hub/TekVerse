import express from 'express';
import DirectMessage from '../models/DirectMessage.js';
import Message from '../models/Message.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', verifyToken, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    let dm = await DirectMessage.findOne({
      participants: { $all: [req.user.id, otherUserId] }
    });
    
    if (!dm) {
      dm = new DirectMessage({ participants: [req.user.id, otherUserId] });
      await dm.save();
    }
    
    res.status(201).json({ message: 'DM created', dm });
  } catch (error) {
    res.status(500).json({ message: 'Error creating DM', error: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const dms = await DirectMessage.find({ participants: req.user.id })
      .populate('participants')
      .populate('messages');
    res.json(dms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching DMs', error: error.message });
  }
});

router.post('/:id/send', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const message = new Message({
      content,
      author: req.user.id,
      channel: req.params.id
    });
    await message.save();
    
    const dm = await DirectMessage.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: message._id }, updatedAt: new Date() },
      { new: true }
    ).populate('messages');
    
    res.status(201).json({ message: 'Message sent', data: dm });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

export default router;