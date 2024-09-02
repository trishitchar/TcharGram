import express, { Router } from 'express'
import isTokenValid from '../middlewares/isTokenValid.js'
import upload from '../middlewares/multer.js'
import { addComment, addNewPost, currentUserPost, dislikePost, getAllPost, likePost } from '../controllers/post.controller.js';

const router: Router = express.Router();

router.route('/addpost').post(isTokenValid,upload.single('image'), addNewPost)
router.route('/allpost').get(isTokenValid,getAllPost);
router.route('/allposttest').get(getAllPost);
router.route('/currentUserPost').get(isTokenValid,currentUserPost);
router.route('/likePost/:id').post(isTokenValid,likePost);
router.route('/dislikePost/:id').post(isTokenValid,dislikePost);
router.route('/addComment/:id').post(isTokenValid,addComment)

export default router;