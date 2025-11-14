const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, agendamentosController.getAgendamentos);
router.post('/', verifyToken, agendamentosController.criarAgendamento);
router.put('/:id', verifyToken, agendamentosController.atualizarAgendamento);
router.delete('/:id', verifyToken, agendamentosController.excluirAgendamento);

module.exports = router;
