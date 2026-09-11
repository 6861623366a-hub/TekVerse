import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  attachments: [
    {
      url: String,
      filename: String,
      size: Number,
      type: String
    }
  ],
  embeds: [Object],
  reactions: [
    {
      emoji: String,
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
  ],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  edited: { type: Boolean, default: false },
  editedAt: Date,
  pinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);