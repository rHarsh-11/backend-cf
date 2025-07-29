import { Session } from '../models/Session.js';
import { ChatTurn } from '../models/ChatTurn.js';
import { callOpenRouter } from '../services/openRouterService.js';

export const createSession = async (req, res) => {
  try {
    const session = await Session.create({ user: req.user._id });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const chatTurns = await ChatTurn.find({ session: session._id }).sort({ createdAt: 1 });
    res.json({ session, chat: chatTurns });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveChatTurn = async (req, res) => {
  const { sender, message, type, codeSnippet } = req.body;

  try {
    const session = await Session.findById(req.params.id);
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const chat = await ChatTurn.create({
      session: session._id,
      sender,
      message,
      type,
      codeSnippet
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSessionCode = async (req, res) => {
  const { jsxCode, cssCode } = req.body;

  try {
    const session = await Session.findById(req.params.id);
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.jsxCode = jsxCode;
    session.cssCode = cssCode;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const runAiPrompt = async (req, res) => {
  const { prompt } = req.body;
  const { id: sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const aiResponse = await callOpenRouter(prompt);

    await ChatTurn.create([
      {
        session: sessionId,
        sender: 'user',
        message: prompt,
        type: 'prompt'
      },
      {
        session: sessionId,
        sender: 'ai',
        message: JSON.stringify(aiResponse),
        type: 'response',
        codeSnippet: aiResponse.jsx
      }
    ]);

    session.jsxCode = aiResponse.jsx;
    session.cssCode = aiResponse.css;
    await session.save();

    res.status(200).json({
      jsx: aiResponse.jsx,
      css: aiResponse.css
    });
  } catch (err) {
    console.error('❌ AI Prompt Error:', err.message);
    res.status(500).json({ message: 'AI model failed or session error' });
  }
};
