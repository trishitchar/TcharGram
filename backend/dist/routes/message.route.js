import express from "express";
import isTokenValid from "../middlewares/isTokenValid.js";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
const router = express.Router();
router.route('/sendmsg/:id').post(isTokenValid, sendMessage);
router.route('/allmsg/:id').get(isTokenValid, getMessage);
export default router;
