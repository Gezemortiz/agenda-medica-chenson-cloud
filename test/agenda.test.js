const test = require('node:test');
const assert = require('node:assert/strict');
const { esDiaLaborable, esFechaPermitida, esHorarioPermitido, googleCalendarUrl } = require('../utils/agenda');

test('acepta días laborables y rechaza fines de semana', () => {
  assert.equal(esDiaLaborable('2026-11-17'), true);
  assert.equal(esDiaLaborable('2026-11-21'), false);
});

test('rechaza fechas anteriores', () => {
  assert.equal(esFechaPermitida('2026-11-16', '2026-11-17'), false);
  assert.equal(esFechaPermitida('2026-11-18', '2026-11-17'), true);
});

test('bloquea el descanso y horarios no definidos', () => {
  assert.equal(esHorarioPermitido('10:30'), false);
  assert.equal(esHorarioPermitido('11:00'), true);
});

test('genera un enlace funcional de Google Calendar', () => {
  const url = googleCalendarUrl({ fecha: '2026-11-18', hora: '09:00', folio: 'TEST-001' });
  assert.match(url, /^https:\/\/calendar\.google\.com\/calendar\/render\?/);
  assert.match(url, /TEST-001/);
});

