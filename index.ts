import setupRoutes from './Router';
import express from 'express';
import cors from 'cors';

// index.js
const app = express();
const port = process.env.PORT;
require('dotenv').config();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());

// Route de test
setupRoutes(app)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
