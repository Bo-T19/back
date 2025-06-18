const Proyecto = require('./../models/projectsModel')
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.createProject = factory.createOne(Proyecto);