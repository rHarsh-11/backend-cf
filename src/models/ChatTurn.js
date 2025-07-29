import mongoose from 'mongoose';

const chatTurnSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    message: { type: String, required: true },
    codeSnippet: { type: String }, // JSX or CSS if applicable
    type: { type: String, enum: ['prompt', 'response'], required: true }
  },
  { timestamps: true }
);

export const ChatTurn = mongoose.model('ChatTurn', chatTurnSchema);
