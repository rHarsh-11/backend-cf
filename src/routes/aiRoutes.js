import express from 'express';
import { generateComponent } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateComponent);

export default router;
