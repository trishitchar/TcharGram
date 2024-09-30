import express, { Router } from 'express'
import isTokenValid from '../middlewares/isTokenValid.js'
import upload from '../middlewares/multer.js'
import { addComment, addNewPost, bookmarkPost, currentUserPost, deleteComment, deletePost, dislikePost, getAllPost, getCommentsOfPost, likePost } from '../controllers/post.controller.js';

const router: Router = express.Router();

// original with token but how do I trigger the isTokenValid middleware from the client side? it's just a function for backend to check if token is valid.
router.route('/addpost').post(isTokenValid,upload.single('image'), addNewPost)
router.route('/deletepost/:id').post(isTokenValid,deletePost)
router.route('/allpost').get(isTokenValid,getAllPost);
router.route('/currentuserpost').get(isTokenValid,currentUserPost);
router.route('/likepost/:id').post(isTokenValid,likePost);
router.route('/dislikepost/:id').post(isTokenValid,dislikePost);
router.route('/addcomment/:id').post(isTokenValid,addComment)
router.route('/getcommentsOfpost/:id').post(isTokenValid,getCommentsOfPost)
router.route('/deletecomment/:id').post(isTokenValid,deleteComment)
router.route('/bookmarkpost/:id').post(isTokenValid,bookmarkPost)

// test route w/o token
// router.route('/addpost').post(upload.single('image'), addNewPost)
// router.route('/deletepost/:id').post(deletePost)
// router.route('/allpost').get(getAllPost);
// router.route('/currentuserpost').get(currentUserPost);
// router.route('/likepost/:id').post(likePost);
// router.route('/dislikepost/:id').post(dislikePost);
// router.route('/addcomment/:id').post(addComment)
// router.route('/getcommentsOfpost/:id').post(getCommentsOfPost)
// router.route('/deletecomment/:id').post(deleteComment)
// router.route('/bookmarkpost/:id').post(bookmarkPost)

export default router;