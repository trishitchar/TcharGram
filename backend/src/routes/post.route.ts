import express, { Router } from 'express'
import isTokenValid from '../middlewares/isTokenValid.js'
import upload from '../middlewares/multer.js'
import { addComment, addNewPost, currentUserPost, deleteComment, deletePost, dislikePost, getAllPost, getCommentsOfPost, likePost } from '../controllers/post.controller.js';

const router: Router = express.Router();

router.route('/addpost').post(isTokenValid,upload.single('image'), addNewPost)
router.route('/deletepost/:id').post(isTokenValid,deletePost)
router.route('/allpost').get(isTokenValid,getAllPost);
router.route('/allposttest').get(getAllPost);
router.route('/currentuserpost').get(isTokenValid,currentUserPost);
router.route('/likepost/:id').post(isTokenValid,likePost);
router.route('/dislikepost/:id').post(isTokenValid,dislikePost);
router.route('/addcomment/:id').post(isTokenValid,addComment)
router.route('/getcommentsOfpost/:id').post(isTokenValid,getCommentsOfPost)
router.route('/deletecomment/:id').post(isTokenValid,deleteComment)

export default router;