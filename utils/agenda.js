const HORARIOS = ['09:00', '09:30', '10:00', '11:00', '11:30', '12:00', '12:30'];

const DEPARTAMENTOS = [
  'ALMACÉN', 'AUDITORÍA', 'CHB', 'COMERCIO EXTERIOR', 'COMPRAS',
  'CONTABILIDAD', 'CONTACT CENTER CHB', 'CRÉDITO Y COBRANZA', 'CRM',
  'DISTRIBUCIÓN', 'GERENCIA ADMINISTRATIVA', 'INMUEBLES',
  'INNOVACIÓN Y DESARROLLO DE PRODUCTO', 'INTELIGENCIA DE NEGOCIOS',
  'MANTENIMIENTO', 'MANUFACTURA Y CALIDAD', 'PROCESOS', 'MERCADOTECNIA',
  'SAC', 'SERVICIOS GENERALES', 'TALENTO Y CULTURA', 'TI', 'TESORERÍA',
  'VENTAS DE CADENA', 'VENTAS DIGITALES', 'VENTAS INTERNACIONALES',
  'TIENDAS GDL', 'DF', 'OTRO'
];

const ESTADOS = ['Programada', 'Atendida', 'Cancelada'];

function fechaLocalISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function esDiaLaborable(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || '')) return false;
  const [year, month, day] = fecha.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return false;
  const weekDay = parsed.getDay();
  return weekDay >= 1 && weekDay <= 5;
}

function esFechaPermitida(fecha, hoy = fechaLocalISO()) {
  return esDiaLaborable(fecha) && fecha >= hoy;
}

function esHorarioPermitido(hora) {
  return HORARIOS.includes(hora);
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  const [year, month, day] = fecha.split('-').map(Number);
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date(year, month - 1, day));
}

function fechaCalendar(fecha, hora, minutos = 30) {
  const compactDate = fecha.replaceAll('-', '');
  const [hours, minutes] = hora.split(':').map(Number);
  const start = `${compactDate}T${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}00`;
  const total = hours * 60 + minutes + minutos;
  const end = `${compactDate}T${String(Math.floor(total / 60)).padStart(2, '0')}${String(total % 60).padStart(2, '0')}00`;
  return `${start}/${end}`;
}

function googleCalendarUrl(cita) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Cita médica programada - CHENSON',
    dates: fechaCalendar(cita.fecha, cita.hora),
    details: `Consulta médica programada o de seguimiento. Folio: ${cita.folio}.`,
    location: 'Servicio Médico CHENSON',
    ctz: 'America/Mexico_City'
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

module.exports = {
  HORARIOS, DEPARTAMENTOS, ESTADOS, fechaLocalISO, esDiaLaborable,
  esFechaPermitida, esHorarioPermitido, formatearFecha, googleCalendarUrl
};

