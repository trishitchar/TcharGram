import express, { Request, Response } from 'express';
import { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
dotenv.config();

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(urlencoded({extended:true}));

const corsAllowOrigin = {
    origin: ['http://localhost:5173', 'https://ai-flix.onrender.com', 'https://aiflix-tc.vercel.app'],
    credentials: true
  };
app.use(cors(corsAllowOrigin));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});

app.listen(`${process.env.PORT}`,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})