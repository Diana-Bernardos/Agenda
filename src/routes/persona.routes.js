// routes/persona.routes.js
const { Router } = require('express');
const PersonaController = require('../controllers/persona.controller');

const router = Router();

router.post('/', PersonaController.crear);
router.get('/', PersonaController.obtenerTodos);

module.exports = router;

