import express from 'express';
import {createPost, getPosts} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';


// Use memory storage instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/', protect, getPosts); 

export default router;