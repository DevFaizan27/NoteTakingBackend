// backend/src/server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import noteRoutes from './routes/note.js';
import connectToMongo from './database/db.js';
import { setupNoteSocket } from './sockets/noteSocket.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://note-taking-frontend-khaki.vercel.app" || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


// Middleware
app.use(helmet());
app.use(cors({
  origin:process.env.FRONTEND_URL|| "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/notes', noteRoutes);


// Socket setup
setupNoteSocket(io);




const PORT = 4000;

const startServer = async () => {
  try {
    await connectToMongo();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();