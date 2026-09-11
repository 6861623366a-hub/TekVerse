import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Cannot update other users' });
    }
    
    const { username, bio, avatar, banner, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, avatar, banner, status },
      { new: true }
    ).select('-password');
    
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

router.post('/:id/link-game', verifyToken, async (req, res) => {
  try {
    const { gameId, gameName, accountId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { linkedGames: { gameId, gameName, accountId } } },
      { new: true }
    );
    res.json({ message: 'Game linked successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error linking game', error: error.message });
  }
});

router.post('/:id/add-friend', verifyToken, async (req, res) => {
  try {
    const { friendId } = req.body;
    await User.findByIdAndUpdate(req.params.id, { $addToSet: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: req.params.id } });
    res.json({ message: 'Friend added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding friend', error: error.message });
  }
});

router.post('/:id/tier-upgrade', verifyToken, async (req, res) => {
  try {
    const { tier } = req.body;
    const tiers = {
      free: { perks: [] },
      pro: { perks: ['hd_streaming', 'custom_status', '100mb_uploads'] },
      elite: { perks: ['hd_streaming', 'custom_status', '500mb_uploads', 'priority_support'] },
      supreme: { perks: ['unlimited_uploads', 'hd_streaming', 'custom_status', 'early_access', 'priority_support'] }
    };
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        'tiers.current': tier,
        'tiers.expiresAt': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        'tiers.perks': tiers[tier].perks
      },
      { new: true }
    );
    res.json({ message: `Upgraded to ${tier}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error upgrading tier', error: error.message });
  }
});

export default router;