import mongoose from 'mongoose';

const voiceCallSchema = new mongoose.Schema({
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    leftAt: Date,
    duration: Number
  }],
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  recording: { type: Boolean, default: false },
  recordingUrl: String,
  status: {
    type: String,
    enum: ['active', 'ended', 'paused'],
    default: 'active'
  }
});

export default mongoose.model('VoiceCall', voiceCallSchema);