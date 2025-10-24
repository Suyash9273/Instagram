import express from 'express';
import { registerUser, loginUser, getUserProfile, followToggle } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile/:username', protect, getUserProfile); // Day -> 15
router.put('/follow/:id', protect, followToggle); // Day -> 16
export default router;