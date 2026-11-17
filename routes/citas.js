const express = require('express');
const controller = require('../controllers/citasController');

const router = express.Router();
router.get('/', controller.listar);
router.get('/nueva', controller.nueva);
router.post('/', controller.crear);
router.get('/:id', controller.detalle);
router.get('/:id/editar', controller.editar);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;

