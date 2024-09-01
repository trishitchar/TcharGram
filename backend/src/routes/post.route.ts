import express, { Router } from 'express'
import isTokenValid from '../middlewares/isTokenValid.js'
import upload from '../middlewares/multer.js'
import { addNewPost, getAllPost } from '../controllers/post.controller.js';

const router: Router = express.Router();

router.route('/addpost').post(isTokenValid,upload.single('image'), addNewPost)
router.route('/allpost').get(isTokenValid,getAllPost);

export default router;