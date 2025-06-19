// controllers/authController.js
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Función para verificar token
exports.verifyToken = catchAsync(async (req, res, next) => {
    // 1) Obtener el token del header Authorization
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2) También revisar si viene en el header 'x-api-token' (más simple para Excel)
    if (!token && req.headers['x-api-token']) {
        token = req.headers['x-api-token'];
    }

    // 3) Verificar si existe el token
    if (!token) {
        return next(new AppError('No se proporcionó token de acceso. Acceso denegado.', 401));
    }

    // 4) Verificar si el token es válido (comparar con el token configurado)
    const validToken = process.env.API_TOKEN;
    
    if (!validToken) {
        return next(new AppError('Token de API no configurado en el servidor', 500));
    }

    if (token !== validToken) {
        return next(new AppError('Token inválido. Acceso denegado.', 401));
    }

    // 5) Si todo está bien, continuar al siguiente middleware
    next();
});

// Middleware opcional para rutas públicas (como la ruta principal)
exports.optionalAuth = (req, res, next) => {
    // Si hay token, verificarlo, si no hay token, continuar
    if (req.headers.authorization || req.headers['x-api-token']) {
        return exports.verifyToken(req, res, next);
    }
    next();
};