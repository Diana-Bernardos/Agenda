const { Router } = require('express');  // Cambiado para usar destructuring
const PersonaController = require('../controllers/persona.controller');

const router = Router();  // Usar Router en lugar de express.Router()

router.post('/', PersonaController.crear);
router.get('/', PersonaController.obtenerTodos);

module.exports = router;

