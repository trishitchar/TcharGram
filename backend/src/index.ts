import express, { Request, Response, NextFunction } from 'express';
import { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
// import keepAlive from './utils/keepAlive.js';
import { app, server } from './socketio/socketio.js';

// const app = express();
dotenv.config();

// MIDDLEWARE
app.use(express.json()); //for parsing JSON data coming from frontend
app.use(cookieParser()); //for parsing cookies
app.use(urlencoded({extended:true})); // for parsing different types of url

// replace with your frontend urls
// const corsAllowOrigin = {
//   origin: ['http://localhost:5173', 'https://tchargram.vercel.app', 'https://social-media-tchar.onrender.com'],
//   credentials: true
// };
// app.use(cors(corsAllowOrigin));

// CORS configuration allowing all origins
const corsAllowOrigin = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsAllowOrigin));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/message", messageRoute);

// Port configuration
const PORT = process.env.PORT || 8080;

// Start the server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  // keepAlive();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export { app, server };