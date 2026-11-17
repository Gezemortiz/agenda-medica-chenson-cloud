const crypto = require('crypto');
const Cita = require('../models/Cita');
const {
  HORARIOS, DEPARTAMENTOS, ESTADOS, fechaLocalISO, esFechaPermitida,
  esHorarioPermitido, googleCalendarUrl
} = require('../utils/agenda');

function datosFormulario(body = {}) {
  return {
    nombre: (body.nombre || '').trim(),
    codigoEmpleado: (body.codigoEmpleado || '').trim(),
    departamento: body.departamento || '',
    telefono: (body.telefono || '').replace(/\D/g, ''),
    correo: (body.correo || '').trim().toLowerCase(),
    fecha: body.fecha || '',
    hora: body.hora || '',
    motivo: (body.motivo || '').trim(),
    estado: body.estado || 'Programada'
  };
}

function validar(datos) {
  const errores = [];
  if (!datos.nombre || !datos.codigoEmpleado || !datos.departamento || !datos.telefono || !datos.correo || !datos.fecha || !datos.hora || !datos.motivo) errores.push('Completa todos los campos obligatorios.');
  if (!DEPARTAMENTOS.includes(datos.departamento)) errores.push('Selecciona un departamento válido.');
  if (!/^\d{10}$/.test(datos.telefono)) errores.push('El teléfono debe contener exactamente 10 dígitos.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) errores.push('Escribe un correo electrónico válido.');
  if (!esFechaPermitida(datos.fecha)) errores.push('Selecciona una fecha de lunes a viernes que no sea anterior a hoy.');
  if (!esHorarioPermitido(datos.hora)) errores.push('Selecciona un horario disponible.');
  if (datos.motivo.length > 180) errores.push('El motivo no puede superar 180 caracteres.');
  if (!ESTADOS.includes(datos.estado)) errores.push('Selecciona un estado válido.');
  return [...new Set(errores)];
}

async function horarioOcupado(fecha, hora, excluirId = null) {
  const query = { fecha, hora, estado: { $ne: 'Cancelada' } };
  if (excluirId) query._id = { $ne: excluirId };
  return Cita.exists(query);
}

exports.inicio = async (req, res, next) => {
  try {
    const hoy = fechaLocalISO();
    const [programadas, atendidas] = await Promise.all([
      Cita.countDocuments({ fecha: { $gte: hoy }, estado: 'Programada' }),
      Cita.countDocuments({ estado: 'Atendida' })
    ]);
    res.render('inicio', { titulo: 'Inicio', programadas, atendidas });
  } catch (error) { next(error); }
};

exports.listar = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.fecha) filtro.fecha = req.query.fecha;
    if (req.query.departamento && DEPARTAMENTOS.includes(req.query.departamento)) filtro.departamento = req.query.departamento;
    if (req.query.estado && ESTADOS.includes(req.query.estado)) filtro.estado = req.query.estado;
    const citas = await Cita.find(filtro).sort({ fecha: 1, hora: 1 }).lean();
    res.render('citas/index', { titulo: 'Agenda de citas', citas, filtros: req.query, DEPARTAMENTOS, ESTADOS });
  } catch (error) { next(error); }
};

exports.nueva = (req, res) => {
  res.render('citas/nueva', { titulo: 'Agendar cita', cita: {}, errores: [], HORARIOS, DEPARTAMENTOS, minFecha: fechaLocalISO() });
};

exports.crear = async (req, res, next) => {
  try {
    const datos = datosFormulario(req.body);
    const errores = validar(datos);
    if (!errores.length && await horarioOcupado(datos.fecha, datos.hora)) errores.push('Ese horario ya está reservado. Selecciona otro espacio.');
    if (errores.length) return res.status(422).render('citas/nueva', { titulo: 'Agendar cita', cita: datos, errores, HORARIOS, DEPARTAMENTOS, minFecha: fechaLocalISO() });
    const folio = `CH-${datos.fecha.replaceAll('-', '')}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const cita = await Cita.create({ ...datos, folio });
    res.redirect(`/citas/${cita._id}?mensaje=creada`);
  } catch (error) { next(error); }
};

exports.detalle = async (req, res, next) => {
  try {
    const cita = await Cita.findById(req.params.id).lean();
    if (!cita) return res.status(404).render('404', { titulo: 'Cita no encontrada' });
    res.render('citas/detalle', { titulo: 'Detalle de la cita', cita, calendarUrl: googleCalendarUrl(cita), mensaje: req.query.mensaje || '' });
  } catch (error) { next(error); }
};

exports.editar = async (req, res, next) => {
  try {
    const cita = await Cita.findById(req.params.id).lean();
    if (!cita) return res.status(404).render('404', { titulo: 'Cita no encontrada' });
    res.render('citas/editar', { titulo: 'Editar cita', cita, errores: [], HORARIOS, DEPARTAMENTOS, ESTADOS, minFecha: fechaLocalISO() });
  } catch (error) { next(error); }
};

exports.actualizar = async (req, res, next) => {
  try {
    const actual = await Cita.findById(req.params.id).lean();
    if (!actual) return res.status(404).render('404', { titulo: 'Cita no encontrada' });
    const datos = datosFormulario(req.body);
    const errores = validar(datos);
    if (!errores.length && datos.estado !== 'Cancelada' && await horarioOcupado(datos.fecha, datos.hora, req.params.id)) errores.push('Ese horario ya está reservado. Selecciona otro espacio.');
    if (errores.length) return res.status(422).render('citas/editar', { titulo: 'Editar cita', cita: { ...actual, ...datos }, errores, HORARIOS, DEPARTAMENTOS, ESTADOS, minFecha: fechaLocalISO() });
    await Cita.findByIdAndUpdate(req.params.id, datos, { runValidators: true });
    res.redirect(`/citas/${req.params.id}?mensaje=actualizada`);
  } catch (error) { next(error); }
};

exports.eliminar = async (req, res, next) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);
    if (!cita) return res.status(404).render('404', { titulo: 'Cita no encontrada' });
    res.redirect('/citas?mensaje=eliminada');
  } catch (error) { next(error); }
};

