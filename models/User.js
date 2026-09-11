import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://via.placeholder.com/150' },
  banner: { type: String },
  bio: { type: String, default: '' },
  status: { type: String, enum: ['online', 'away', 'offline', 'dnd'], default: 'offline' },
  role: {
    type: String,
    enum: ['founder', 'user'],
    default: 'user'
  },
  servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: [
    {
      type: { type: String },
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  linkedGames: [{
    gameId: String,
    gameName: String,
    accountId: String,
    linkedAt: { type: Date, default: Date.now }
  }],
  tiers: {
    current: { type: String, enum: ['free', 'pro', 'elite', 'supreme'], default: 'free' },
    expiresAt: Date,
    perks: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);