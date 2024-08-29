import express, {Router} from 'express'
import isTokenValid from '../middlewares/isTokenValid.js'
// import rateLimit from "express-rate-limit"; will add later in prod
import {register} from '../controllers/user.controller.js'

const router: Router = express.Router();

router.route('/register').post(register);
// router.route('/login').post(login);
// router.route('/logout').get(logout);
// router.route('/:id/profile').get(isAuthenticated, getProfile);
// router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
// router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
// router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;


