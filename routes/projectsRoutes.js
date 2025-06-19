// routes/projectsRoutes.js
const express = require('express');
const projectsController = require('./../controllers/projectsControllers');
const authController = require('./../controllers/authController');

const router = express.Router();

// Aplicar autenticación a todas las rutas de proyectos
router.use(authController.verifyToken);

// ===== RUTAS PRINCIPALES PARA PROYECTOS =====
router.route('/')
    .get(projectsController.getAllProjects)    // GET /api/v1/proyectos
    .post(projectsController.createProject);   // POST /api/v1/proyectos

router.route('/:id')
    .get(projectsController.getProject)        // GET /api/v1/proyectos/:id
    .patch(projectsController.updateProject)   // PATCH /api/v1/proyectos/:id
    .delete(projectsController.deleteProject); // DELETE /api/v1/proyectos/:id

// ===== BÚSQUEDA POR NOMBRE =====
router.route('/nombre/:nombre')
    .get(projectsController.getProjectByName); // GET /api/v1/proyectos/nombre/:nombre

// ===== COSTOS CONTRACTUALES =====
// Por ID
router.route('/:id/costos-contractuales')
    .post(projectsController.createCostosContractuales)   // POST /api/v1/proyectos/:id/costos-contractuales
    .patch(projectsController.createCostosContractuales); // PATCH /api/v1/proyectos/:id/costos-contractuales

// Por nombre
router.route('/nombre/:nombre/costos-contractuales')
    .post(projectsController.createCostosContractualesByName)   // POST /api/v1/proyectos/nombre/:nombre/costos-contractuales
    .patch(projectsController.createCostosContractualesByName); // PATCH /api/v1/proyectos/nombre/:nombre/costos-contractuales

// ===== GASTOS MENSUALES =====
// Por ID
router.route('/:id/gastos')
    .post(projectsController.addGasto);        // POST /api/v1/proyectos/:id/gastos

// Por nombre
router.route('/nombre/:nombre/gastos')
    .post(projectsController.addGastoByName);  // POST /api/v1/proyectos/nombre/:nombre/gastos

router.route('/nombre/:nombre/gastos/:mes')
    .patch(projectsController.updateGastoByMes); // PATCH /api/v1/proyectos/nombre/:nombre/gastos/:mes

// ===== ÓRDENES DE CAMBIO =====
// Por ID
router.route('/:id/ordenes-cambio')
    .post(projectsController.addOrdenCambio);  // POST /api/v1/proyectos/:id/ordenes-cambio

// Por nombre
router.route('/nombre/:nombre/ordenes-cambio')
    .post(projectsController.addOrdenCambioByName); // POST /api/v1/proyectos/nombre/:nombre/ordenes-cambio

router.route('/nombre/:nombre/ordenes-cambio/:numero')
    .patch(projectsController.updateOrdenCambioByNumero); // PATCH /api/v1/proyectos/nombre/:nombre/ordenes-cambio/:numero

// ===== FACTURAS =====
// Por ID
router.route('/:id/facturas')
    .post(projectsController.addFactura);      // POST /api/v1/proyectos/:id/facturas

// Por nombre
router.route('/nombre/:nombre/facturas')
    .post(projectsController.addFacturaByName); // POST /api/v1/proyectos/nombre/:nombre/facturas

router.route('/nombre/:nombre/facturas/:numero')
    .patch(projectsController.updateFacturaByNumero); // PATCH /api/v1/proyectos/nombre/:nombre/facturas/:numero

module.exports = router;