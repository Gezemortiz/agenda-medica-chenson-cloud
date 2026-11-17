require('dotenv').config();
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const connectDatabase = require('./config/database');
const citasController = require('./controllers/citasController');
const citasRoutes = require('./routes/citas');
const { formatearFecha } = require('./utils/agenda');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.formatearFecha = formatearFecha;
app.locals.mapsUrl = process.env.MAPS_URL || 'https://www.google.com/maps/search/?api=1&query=CHENSON+Guadalajara+Jalisco';
app.locals.currentYear = new Date().getFullYear();

app.get('/', citasController.inicio);
app.use('/citas', citasRoutes);

app.use((req, res) => res.status(404).render('404', { titulo: 'Página no encontrada' }));
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', {
    titulo: 'Error del sistema',
    mensaje: process.env.NODE_ENV === 'production' ? 'No fue posible completar la operación.' : error.message
  });
});

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, '0.0.0.0', () => console.log(`Agenda disponible en http://localhost:${PORT}`));
  } catch (error) {
    console.error(`No se pudo iniciar la aplicación: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
