import express from 'express';
import {createPost, getPosts, likeUnlikePost} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';


// Use memory storage instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);// to upload a post
router.get('/', protect, getPosts); // to fetch posts
router.put('/:id/like', protect, likeUnlikePost);

export default router;