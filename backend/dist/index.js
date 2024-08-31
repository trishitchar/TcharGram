import express from 'express';
import { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
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
// multer er jhamela suru
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Routes
app.get('/', (req, res) => {
    return res.render("homepage");
});
app.post("/upload", upload.single("profileImage"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
});
app.post("/upload", upload.single("profileImage"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/");
});
// multer er jhamela ses
app.get('/hi', (req, res) => {
    res.send('Hello, TypeScript with Node.js!');
});
app.use("/api/user", userRoute);
app.listen(`${process.env.PORT}`, () => {
    connectDB();
    console.log(`server is running on port ${process.env.PORT}`);
});
