const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, usuariosController.getUsuarios);
router.patch('/status/:id', verifyToken, isAdmin, usuariosController.alterarStatus);
router.patch('/nivel/:id', verifyToken, isAdmin, usuariosController.alterarNivel);

module.exports = router;
