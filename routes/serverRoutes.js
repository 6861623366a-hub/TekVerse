import express from 'express';
import Server from '../models/Server.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const inviteCode = crypto.randomBytes(8).toString('hex');
    
    let newServer = new Server({
      name,
      description,
      icon,
      owner: req.user.id,
      inviteCode,
      members: [{
        user: req.user.id,
        role: 'founder'
      }]
    });
    
    await newServer.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { servers: newServer._id } });
    
    res.status(201).json({ message: 'Server created', server: newServer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating server', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const server = await Server.findById(req.params.id)
      .populate('owner')
      .populate('members.user')
      .populate('channels');
    if (!server) return res.status(404).json({ message: 'Server not found' });
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching server', error: error.message });
  }
});

router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const server = await Server.findOne({ _id: req.params.id, inviteCode });
    
    if (!server) return res.status(404).json({ message: 'Invalid invite code' });
    
    server.members.push({ user: req.user.id, role: 'member' });
    await server.save();
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { servers: server._id } });
    
    res.json({ message: 'Joined server', server });
  } catch (error) {
    res.status(500).json({ message: 'Error joining server', error: error.message });
  }
});

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (server.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can edit server' });
    }
    
    const { name, description, icon, banner, nsfw, verificationLevel } = req.body;
    const updatedServer = await Server.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, banner, nsfw, verificationLevel },
      { new: true }
    );
    
    res.json({ message: 'Server updated', server: updatedServer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating server', error: error.message });
  }
});

router.post('/:id/roles', verifyToken, async (req, res) => {
  try {
    const { name, color, permissions } = req.body;
    const server = await Server.findById(req.params.id);
    
    if (server.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can create roles' });
    }
    
    server.roles.push({ name, color, permissions });
    await server.save();
    
    res.json({ message: 'Role created', server });
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error: error.message });
  }
});

router.post('/:id/leave', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    server.members = server.members.filter(m => m.user.toString() !== req.user.id);
    await server.save();
    
    await User.findByIdAndUpdate(req.user.id, { $pull: { servers: req.params.id } });
    
    res.json({ message: 'Left server' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving server', error: error.message });
  }
});

export default router;