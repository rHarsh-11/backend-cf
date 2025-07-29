import express from 'express';
import {
  createSession,
  getUserSessions,
  getSessionById,
  saveChatTurn,
  updateSessionCode,
  runAiPrompt
} from '../controllers/sessionController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/new', protect, createSession);
router.get('/', protect, getUserSessions);
router.get('/user', protect, getUserSessions);
router.get('/:id', protect, getSessionById);
router.post('/:id/chat', protect, saveChatTurn);
router.put('/:id/code', protect, updateSessionCode);
router.post('/:id/prompt', protect, runAiPrompt);

export default router;
