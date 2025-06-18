const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// Import routes
const projectsRouter = require('./routes/projectsRoutes');

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

app.use('/api/v1/proyectos', projectsRouter);

// Main route
app.get('/', (req, res) => {
  res.send(`
    <h1>Autodesk Platform Services Auth</h1>
    <p>Bienvenido a la aplicación de autenticación</p>
    <ul>
      <li><a href="/auth">Iniciar autenticación con Autodesk (3-legged)</a></li>
      <li><a href="/auth/2legged">Obtener token 2-legged</a></li>
    </ul>
  `);
});

module.exports = app

