const express = require('express');
const router = express.Router();
const recuperarSenhaController = require('../controllers/recuperarSenhaController');

router.post('/solicitar', recuperarSenhaController.solicitarRecuperacao);
router.post('/resetar', recuperarSenhaController.resetarSenha);

module.exports = router;
