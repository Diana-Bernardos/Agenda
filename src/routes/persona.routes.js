// routes/persona.routes.js
const express = require('express');
const PersonaController = require('../controllers/persona.controller');
const router = express.Router();

router.post('/', PersonaController.crear);
router.get('/', PersonaController.obtenerTodos);
router.get('/:id', PersonaController.obtenerPorId);
router.put('/:id', PersonaController.actualizar);
router.delete('/:id', PersonaController.eliminar);

module.exports = router;