import express from 'express';
import { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import keepAlive from './utils/keepAlive.js';
import { app, server } from './socketio/socketio.js';
// const app = express();
dotenv.config();
// MIDDLEWARE
app.use(express.json()); //for parse the json data, coming from frontend
app.use(cookieParser()); //for parsing cookies
app.use(urlencoded({ extended: true })); // for parse differnt types of url
// replace with your frontend urls
const corsAllowOrigin = {
    origin: ['http://localhost:5173', 'https://tchargram.vercel.app', 'https://social-media-tchar.onrender.com'],
    credentials: true
};
app.use(cors(corsAllowOrigin));
// backend url
// https://social-media-422a.onrender.com/
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Node.js!');
});
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/message", messageRoute);
server.listen(`${process.env.PORT}`, () => {
    connectDB();
    console.log(`server is running on port ${process.env.PORT}`);
    keepAlive();
});
