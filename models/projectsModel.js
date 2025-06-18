const mongoose = require('mongoose');

//Esquemas
const costosPorEspecialidadSchema = new mongoose.Schema({
    costos_horas_hombre: Number,
    costos_oficina_central: Number,
    subcontratos: Number,
    indirectos: Number,
    contingencia: Number,
    utilidad: Number
});

const costosProyectadosEsquema = new mongoose.Schema({
    inicio: costosPorEspecialidadSchema,
    arquitectura: costosPorEspecialidadSchema,
    estructuras: costosPorEspecialidadSchema,
    redes: costosPorEspecialidadSchema,
    bim: costosPorEspecialidadSchema,
    geotecnia: costosPorEspecialidadSchema,
    integracion: costosPorEspecialidadSchema,
    confort: costosPorEspecialidadSchema
});


const ordenCambioSchema = new mongoose.Schema({
    numero: {type: Number, required: true},
    fecha: Date,
    aprobada: Boolean,
    costos: { type: costosProyectadosEsquema, required: true }
});

const facturaSchema = new mongoose.Schema({
    numero: {type: Number, required: true},
    mes: { type: Date, required: true },
    monto: { type: Number, required: true },
});

const gastoMensualEsquema = new mongoose.Schema({
    mes: { type: Date, required: true, unique: true},
    arquitectura: Number,
    estructuras: Number,
    redes: Number,
    bim: Number,
    geotecnia: Number,
    integracion: Number,
    confort: Number
})

const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true},
    tipo: { type: String, required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    volumen_total: { type: Number, required: true },
    centro_costos: { type: String, required: true },
    costos_contractuales: costosProyectadosEsquema,
    dinero_facturado: Number,
    gasto_real: {
        arquitectura: Number,
        estructuras: Number,
        redes: Number,
        bim: Number,
        geotecnia: Number,
        integracion: Number,
        confort: Number
    },
    ordenes_cambio: [ordenCambioSchema],
    facturas: [facturaSchema],
    gastos: [gastoMensualEsquema]
});

// Modelo
const Proyecto = mongoose.model('Proyecto', proyectoSchema);
module.exports = Proyecto;