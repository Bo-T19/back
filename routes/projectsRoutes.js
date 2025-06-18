const express = require('express');
const projectsController = require('./../controllers/projectsControllers');

const router = express.Router();

router.route('/')
    .post(projectsController.createProject)

module.exports = router;