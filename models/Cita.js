const mongoose = require('mongoose');
const { DEPARTAMENTOS, ESTADOS, HORARIOS } = require('../utils/agenda');

const citaSchema = new mongoose.Schema({
  folio: { type: String, required: true, unique: true, index: true },
  nombre: { type: String, required: true, trim: true, maxlength: 100 },
  codigoEmpleado: { type: String, required: true, trim: true, maxlength: 30 },
  departamento: { type: String, required: true, enum: DEPARTAMENTOS },
  telefono: { type: String, required: true, match: /^\d{10}$/ },
  correo: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  fecha: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  hora: { type: String, required: true, enum: HORARIOS },
  motivo: { type: String, required: true, trim: true, maxlength: 180 },
  estado: { type: String, required: true, enum: ESTADOS, default: 'Programada' }
}, { timestamps: true });

citaSchema.index({ fecha: 1, hora: 1 });

module.exports = mongoose.model('Cita', citaSchema);

