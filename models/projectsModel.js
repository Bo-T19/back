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

const costosTotalesSchema = new mongoose.Schema({
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
    numero: { type: Number, required: true },
    descripción: String, 
    fecha: Date,
    aprobada: {type: Boolean, required: true},
    costos: { type: costosTotalesSchema, required: true }
});

const facturaSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    mes: { type: Date, required: true },
    monto: { type: Number, required: true },
});

const gastoMensualEsquema = new mongoose.Schema({
    mes: { type: Date, required: true, unique: true },
    costos: {costosTotalesSchema}
})

const proyectoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    cliente: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    volumen_total: Number,
    pep_soc01: { type: String, required: true },
    pep_soc77: { type: String, required: true },
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

//Pre save para calcular costos, facturas y volumen
proyectoSchema.pre('save', function (next) {
    // Dinero facturado
    this.dinero_facturado = this.facturas.reduce((sum, f) => sum + f.monto, 0);

    // Gasto real
    const total = {
        arquitectura: 0,
        estructuras: 0,
        redes: 0,
        bim: 0,
        geotecnia: 0,
        integracion: 0,
        confort: 0
    };
    this.gastos.forEach(gasto => {
        for (const key in total) {
            total[key] += gasto[key] || 0;
        }
    });
    this.gasto_real = total;

    // Volumen total
    const sumarCostos = (c) => Object.values(c).reduce((sum, especialidad) => {
        return sum + Object.values(especialidad || {}).reduce((a, b) => a + (b || 0), 0);
    }, 0);

    const costosContractuales = this.costos_contractuales ? sumarCostos(this.costos_contractuales) : 0;
    const costosOrdenes = this.ordenes_cambio.reduce((sum, orden) => {
        return sum + (orden.costos ? sumarCostos(orden.costos) : 0);
    }, 0);

    this.volumen_total = costosContractuales + costosOrdenes;

    next();
});


// Modelo
const Proyecto = mongoose.model('Proyecto', proyectoSchema);
module.exports = Proyecto;