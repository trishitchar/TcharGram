import express from 'express';
import isTokenValid from '../middlewares/isTokenValid.js';
import upload from '../middlewares/multer.js';
import { addNewPost, currentUserPost, getAllPost } from '../controllers/post.controller.js';
const router = express.Router();
router.route('/addpost').post(isTokenValid, upload.single('image'), addNewPost);
router.route('/allpost').get(isTokenValid, getAllPost);
router.route('/currentUserPost').get(isTokenValid, currentUserPost);
export default router;
