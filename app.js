const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// Import routes
const AppError = require('./utils/appError');
const projectsRouter = require('./routes/projectsRoutes');
const globalErrorHandler = require('./controllers/errorControllers');
const authController = require('./controllers/authController');

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
    <h1>Hola, esto es DCD</h1>
    <p>Bienvenido a la aplicación de nuestro taller</p>
  `);
});

// Ruta de prueba para verificar token
app.get('/api/v1/test-auth', authController.verifyToken, (req, res) => {
  res.json({
    status: 'success',
    message: '¡Token válido! Acceso autorizado.',
    timestamp: new Date().toISOString()
  });
});

app.use(globalErrorHandler);

module.exports = app

