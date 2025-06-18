const express = require('express');
const projectsController = require('./../controllers/projectsControllers');

const router = express.Router();

// Rutas principales para proyectos
router.route('/')
    .get(projectsController.getAllProjects)    // GET /api/v1/proyectos
    .post(projectsController.createProject);   // POST /api/v1/proyectos

router.route('/:id')
    .get(projectsController.getProject)        // GET /api/v1/proyectos/:id
    .patch(projectsController.updateProject)   // PATCH /api/v1/proyectos/:id
    .delete(projectsController.deleteProject); // DELETE /api/v1/proyectos/:id

// Rutas específicas para operaciones de proyectos
router.route('/:id/costos-contractuales')
    .post(projectsController.createCostosContractuales)   // POST /api/v1/proyectos/:id/costos-contractuales
    .patch(projectsController.createCostosContractuales); // PATCH /api/v1/proyectos/:id/costos-contractuales

router.route('/:id/ordenes-cambio')
    .post(projectsController.addOrdenCambio);  // POST /api/v1/proyectos/:id/ordenes-cambio

router.route('/:id/cobros')
    .post(projectsController.addCobro);        // POST /api/v1/proyectos/:id/cobros

router.route('/:id/gastos')
    .post(projectsController.addGasto);        // POST /api/v1/proyectos/:id/gastos

module.exports = router;