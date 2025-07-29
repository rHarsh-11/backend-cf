import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'Untitled Session' },
    jsxCode: { type: String, default: '' },
    cssCode: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
