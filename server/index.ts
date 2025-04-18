import express, { application } from 'express';
import { config } from 'dotenv';
import http from 'http';
import { Queue } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import queryRoutes from './src/routes/queries';
import path from 'path';

const prisma = new PrismaClient()

// load environment variables
config();

const app = express();

const server = http.createServer(app);
const port = parseInt(process.env.PORT || '3000');

app.use(express.json());

// API routes
app.use('/api/queries', queryRoutes);

// Serve static files from the built React app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
