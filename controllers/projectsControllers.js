const Proyecto = require('./../models/projectsModel')
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// ===== OPERACIONES BÁSICAS CRUD =====
exports.getAllProjects = factory.getAll(Proyecto);
exports.getProject = factory.getOne(Proyecto);
exports.createProject = factory.createOne(Proyecto);
exports.updateProject = factory.updateOne(Proyecto);
exports.deleteProject = factory.deleteOne(Proyecto);

// ===== BÚSQUEDA POR NOMBRE =====
exports.getProjectByName = catchAsync(async (req, res, next) => {
    const { nombre } = req.params;
    
    const proyecto = await Proyecto.findOne({ nombre });
    
    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese nombre', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { proyecto }
    });
});

// ===== COSTOS CONTRACTUALES =====
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
        data: { proyecto }
    });
});

exports.createCostosContractualesByName = catchAsync(async (req, res, next) => {
    const { nombre } = req.params;
    const costosContractuales = req.body;

    const proyecto = await Proyecto.findOneAndUpdate(
        { nombre: nombre },
        { costos_contractuales: costosContractuales },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese nombre', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Costos contractuales actualizados exitosamente',
        data: { proyecto }
    });
});

// ===== GASTOS MENSUALES =====
exports.addGasto = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const gasto = req.body;

    if (!gasto.mes) {
        return next(new AppError('Debe proporcionar el mes para el gasto', 400));
    }

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
            proyecto,
            nuevoGasto: proyecto.gastos[proyecto.gastos.length - 1]
        }
    });
});

exports.addGastoByName = catchAsync(async (req, res, next) => {
    const { nombre } = req.params;
    const gasto = req.body;

    if (!gasto.mes) {
        return next(new AppError('Debe proporcionar el mes para el gasto', 400));
    }

    const especialidades = ['arquitectura', 'estructuras', 'redes', 'bim', 'geotecnia', 'integracion', 'confort'];
    const tieneGastos = especialidades.some(esp => gasto[esp] && gasto[esp] > 0);

    if (!tieneGastos) {
        return next(new AppError('Debe proporcionar al menos un gasto válido para alguna especialidad', 400));
    }

    const proyecto = await Proyecto.findOneAndUpdate(
        { nombre: nombre },
        { $push: { gastos: gasto } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese nombre', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Gasto añadido exitosamente',
        data: {
            proyecto,
            nuevoGasto: proyecto.gastos[proyecto.gastos.length - 1]
        }
    });
});

exports.updateGastoByMes = catchAsync(async (req, res, next) => {
    const { nombre, mes } = req.params;
    const updateData = req.body;

    // Convertir mes a formato Date para búsqueda
    const fechaMes = new Date(mes + '-01');

    const proyecto = await Proyecto.findOneAndUpdate(
        { 
            nombre: nombre,
            'gastos.mes': fechaMes
        },
        { 
            $set: {
                'gastos.$.arquitectura': updateData.arquitectura,
                'gastos.$.estructuras': updateData.estructuras,
                'gastos.$.redes': updateData.redes,
                'gastos.$.bim': updateData.bim,
                'gastos.$.geotecnia': updateData.geotecnia,
                'gastos.$.integracion': updateData.integracion,
                'gastos.$.confort': updateData.confort
            }
        },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto o el gasto para ese mes', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Gasto mensual actualizado exitosamente',
        data: { proyecto }
    });
});

// ===== ÓRDENES DE CAMBIO =====
exports.addOrdenCambio = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ordenCambio = req.body;

    if (!ordenCambio.numero || !ordenCambio.fecha || typeof ordenCambio.aprobada !== 'boolean' || !ordenCambio.costos) {
        return next(new AppError('Debe proporcionar número, fecha, estado de aprobación y costos para la orden de cambio', 400));
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
            proyecto,
            nuevaOrdenCambio: proyecto.ordenes_cambio[proyecto.ordenes_cambio.length - 1]
        }
    });
});

exports.addOrdenCambioByName = catchAsync(async (req, res, next) => {
    const { nombre } = req.params;
    const ordenCambio = req.body;

    if (!ordenCambio.numero || !ordenCambio.fecha || typeof ordenCambio.aprobada !== 'boolean' || !ordenCambio.costos) {
        return next(new AppError('Debe proporcionar número, fecha, estado de aprobación y costos para la orden de cambio', 400));
    }

    const proyecto = await Proyecto.findOneAndUpdate(
        { nombre: nombre },
        { $push: { ordenes_cambio: ordenCambio } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese nombre', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Orden de cambio añadida exitosamente',
        data: {
            proyecto,
            nuevaOrdenCambio: proyecto.ordenes_cambio[proyecto.ordenes_cambio.length - 1]
        }
    });
});

exports.updateOrdenCambioByNumero = catchAsync(async (req, res, next) => {
    const { nombre, numero } = req.params;
    const updateData = req.body;

    const proyecto = await Proyecto.findOneAndUpdate(
        { 
            nombre: nombre,
            'ordenes_cambio.numero': parseInt(numero)
        },
        { 
            $set: {
                'ordenes_cambio.$.fecha': updateData.fecha,
                'ordenes_cambio.$.aprobada': updateData.aprobada,
                'ordenes_cambio.$.costos': updateData.costos
            }
        },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto o la orden de cambio con ese número', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Orden de cambio actualizada exitosamente',
        data: { proyecto }
    });
});

// ===== FACTURAS =====
exports.addFactura = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const factura = req.body;

    if (!factura.numero || !factura.mes || !factura.monto) {
        return next(new AppError('Debe proporcionar número, mes y monto para la factura', 400));
    }

    if (factura.monto <= 0) {
        return next(new AppError('El monto de la factura debe ser mayor a 0', 400));
    }

    const proyecto = await Proyecto.findByIdAndUpdate(
        id,
        { $push: { facturas: factura } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese ID', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Factura añadida exitosamente',
        data: {
            proyecto,
            nuevaFactura: proyecto.facturas[proyecto.facturas.length - 1]
        }
    });
});

exports.addFacturaByName = catchAsync(async (req, res, next) => {
    const { nombre } = req.params;
    const factura = req.body;

    if (!factura.numero || !factura.mes || !factura.monto) {
        return next(new AppError('Debe proporcionar número, mes y monto para la factura', 400));
    }

    if (factura.monto <= 0) {
        return next(new AppError('El monto de la factura debe ser mayor a 0', 400));
    }

    const proyecto = await Proyecto.findOneAndUpdate(
        { nombre: nombre },
        { $push: { facturas: factura } },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto con ese nombre', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'Factura añadida exitosamente',
        data: {
            proyecto,
            nuevaFactura: proyecto.facturas[proyecto.facturas.length - 1]
        }
    });
});

exports.updateFacturaByNumero = catchAsync(async (req, res, next) => {
    const { nombre, numero } = req.params;
    const updateData = req.body;

    const proyecto = await Proyecto.findOneAndUpdate(
        { 
            nombre: nombre,
            'facturas.numero': parseInt(numero)
        },
        { 
            $set: {
                'facturas.$.mes': updateData.mes,
                'facturas.$.monto': updateData.monto
            }
        },
        { new: true, runValidators: true }
    );

    if (!proyecto) {
        return next(new AppError('No se encontró el proyecto o la factura con ese número', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Factura actualizada exitosamente',
        data: { proyecto }
    });
});