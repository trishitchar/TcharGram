import express, {Router} from 'express'
import isTokenValid from '../middlewares/isTokenValid.js'
// import rateLimit from "express-rate-limit"; will add later in prod
import {register,login, logout, getProfile, editProfile, followOrUnfollow, getSuggestedUsers} from '../controllers/user.controller.js'
import upload from "../middlewares/multer.js";

const router: Router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/:id').get(isTokenValid, getProfile);
router.post('/profile/edit', isTokenValid, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isTokenValid, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isTokenValid, followOrUnfollow);

// test route without authentication
// router.route('/test').post(isTokenValid,login);
// router.route('/testprofile/:id').get(getProfile);
// router.route('/testsuggested').get(getSuggestedUsers);
// router.route('/testfolloworunfollow/:id').post(followOrUnfollow);
export default router;


