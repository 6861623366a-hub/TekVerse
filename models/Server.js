import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'https://via.placeholder.com/100' },
  banner: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: {
      type: String,
      enum: ['founder', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  roles: [{
    name: String,
    color: String,
    permissions: [String]
  }],
  inviteCode: { type: String, unique: true, sparse: true },
  public: { type: Boolean, default: true },
  nsfw: { type: Boolean, default: false },
  verificationLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high'],
    default: 'none'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Server', serverSchema);