import express from 'express';
import { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
const app = express();
dotenv.config();
// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsAllowOrigin = {
    origin: ['http://localhost:5173', 'https://ai-flix.onrender.com', 'https://aiflix-tc.vercel.app'],
    credentials: true
};
app.use(cors(corsAllowOrigin));
// backend url
// https://social-media-422a.onrender.com/
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Node.js!');
});
app.use("/api/user", userRoute);
app.listen(`${process.env.PORT}`, () => {
    connectDB();
    console.log(`server is running on port ${process.env.PORT}`);
});
