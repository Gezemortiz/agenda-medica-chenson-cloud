require('dotenv').config();
const connectDatabase = require('../config/database');
const Cita = require('../models/Cita');
const { fechaLocalISO, esDiaLaborable } = require('../utils/agenda');

function siguienteLaborable(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  while (!esDiaLaborable(fechaLocalISO(date))) date.setDate(date.getDate() + 1);
  return fechaLocalISO(date);
}

async function seed() {
  await connectDatabase();
  await Cita.deleteMany({ folio: /^DEMO-/ });
  await Cita.insertMany([
    { folio: 'DEMO-001', nombre: 'Laura Martínez', codigoEmpleado: 'EMP-1042', departamento: 'TALENTO Y CULTURA', telefono: '3312345678', correo: 'laura.martinez@ejemplo.com', fecha: siguienteLaborable(1), hora: '09:00', motivo: 'Consulta médica programada', estado: 'Programada' },
    { folio: 'DEMO-002', nombre: 'Carlos Ramírez', codigoEmpleado: 'EMP-2087', departamento: 'ALMACÉN', telefono: '3387654321', correo: 'carlos.ramirez@ejemplo.com', fecha: siguienteLaborable(2), hora: '11:30', motivo: 'Seguimiento de consulta', estado: 'Programada' },
    { folio: 'DEMO-003', nombre: 'Mariana López', codigoEmpleado: 'EMP-3165', departamento: 'CONTABILIDAD', telefono: '3311122233', correo: 'mariana.lopez@ejemplo.com', fecha: siguienteLaborable(3), hora: '12:00', motivo: 'Revisión programada', estado: 'Programada' }
  ]);
  console.log('Datos ficticios agregados correctamente.');
  process.exit(0);
}

seed().catch(error => { console.error(error); process.exit(1); });

