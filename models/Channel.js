import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  type: {
    type: String,
    enum: ['text', 'voice', 'stage'],
    default: 'text'
  },
  category: String,
  position: Number,
  topic: String,
  nsfw: { type: Boolean, default: false },
  private: { type: Boolean, default: false },
  permissionOverwrites: [
    {
      type: { type: String, enum: ['user', 'role'] },
      id: mongoose.Schema.Types.ObjectId,
      allow: [String],
      deny: [String]
    }
  ],
  rateLimit: { type: Number, default: 0 },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Channel', channelSchema);