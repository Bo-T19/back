const Proyecto = require('./../models/projectsModel')
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// Operaciones básicas CRUD usando factory functions
exports.getAllProjects = factory.getAll(Proyecto);
exports.getProject = factory.getOne(Proyecto);
exports.createProject = factory.createOne(Proyecto);
exports.updateProject = factory.updateOne(Proyecto);
exports.deleteProject = factory.deleteOne(Proyecto);

// Crear o actualizar costos contractuales
exports.createCostosContractuales = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const costosContractuales = req.body;

    const proyecto = await Proyecto.findByIdAndUpdate(
        id,
        { costos_contractuales: costosContractuales },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Costos contractuales actualizados exitosamente',
        data: {
            proyecto: proyecto
        }
    });
});

// Añadir orden de cambio
exports.addOrdenCambio = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ordenCambio = req.body;

    // Validar campos requeridos
    if (!ordenCambio.fecha || typeof ordenCambio.aprobada !== 'boolean' || !ordenCambio.costos) {
        return next(new AppError('Debe proporcionar fecha, estado de aprobación y costos para la orden de cambio', 400));
    }

    const proyecto = await Proyecto.findByIdAndUpdate(
        id,
        { $push: { ordenes_cambio: ordenCambio } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese ID', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Orden de cambio añadida exitosamente',
        data: {
            proyecto: proyecto,
            nuevaOrdenCambio: proyecto.ordenes_cambio[proyecto.ordenes_cambio.length - 1]
        }
    });
});

// Añadir cobro
exports.addCobro = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const cobro = req.body;

    // Validar campos requeridos
    if (!cobro.mes || !cobro.monto) {
        return next(new AppError('Debe proporcionar mes y monto para el cobro', 400));
    }

    // Verificar que el monto sea positivo
    if (cobro.monto <= 0) {
        return next(new AppError('El monto del cobro debe ser mayor a 0', 400));
    }

    const proyecto = await Proyecto.findByIdAndUpdate(
        id,
        { $push: { cobros: cobro } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese ID', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Cobro añadido exitosamente',
        data: {
            proyecto: proyecto,
            nuevoCobro: proyecto.cobros[proyecto.cobros.length - 1]
        }
    });
});

// Añadir gasto mensual
exports.addGasto = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const gasto = req.body;

    // Validar campo requerido
    if (!gasto.mes) {
        return next(new AppError('Debe proporcionar el mes para el gasto', 400));
    }

    // Verificar que al menos una especialidad tenga un valor
    const especialidades = ['arquitectura', 'estructuras', 'redes', 'bim', 'geotecnia', 'integracion', 'confort'];
    const tieneGastos = especialidades.some(esp => gasto[esp] && gasto[esp] > 0);

    if (!tieneGastos) {
        return next(new AppError('Debe proporcionar al menos un gasto válido para alguna especialidad', 400));
    }

    const proyecto = await Proyecto.findByIdAndUpdate(
        id,
        { $push: { gastos: gasto } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese ID', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Gasto añadido exitosamente',
        data: {
            proyecto: proyecto,
            nuevoGasto: proyecto.gastos[proyecto.gastos.length - 1]
        }
    });
});