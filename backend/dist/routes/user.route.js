import express from 'express';
// import rateLimit from "express-rate-limit"; will add later in prod
import { register, login, logout } from '../controllers/user.controller.js';
const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
// router.route('/:id/profile').get(isTokenValid, getProfile);
// router.route('/profile/edit').post(isTokenValid, upload.single('profilePhoto'), editProfile);
// router.route('/suggested').get(isTokenValid, getSuggestedUsers);
// router.route('/followorunfollow/:id').post(isTokenValid, followOrUnfollow);
export default router;
