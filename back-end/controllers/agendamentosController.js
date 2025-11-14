const db = require('../db');

exports.getAgendamentos = (req, res) => {

    const usuarioId = req.user.id; 

    db.query(
        'SELECT * FROM agendamentos WHERE usuario_id = ?', 
        [usuarioId],
        (err, results) => {
            if (err) {
                console.error("ERRO AO BUSCAR AGENDAMENTOS:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
};

exports.criarAgendamento = (req, res) => {
    const usuarioId = req.user.id; 
    
    const { titulo, descricao, data_inicio, data_fim } = req.body; 

    db.query(
        'INSERT INTO agendamentos (titulo, descricao, data_inicio, data_fim, usuario_id) VALUES (?, ?, ?, ?, ?)',
        [titulo, descricao, data_inicio, data_fim, usuarioId],
        (err, result) => {
            if (err) {
                console.error("ERRO AO CRIAR AGENDAMENTO:", err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                id: result.insertId, 
                titulo, 
                descricao, 
                data_inicio, 
                data_fim, 
                usuario_id: usuarioId 
            });
        }
    );
};

exports.excluirAgendamento = (req, res) => {
    const usuarioId = req.user.id; 
    const agendamentoId = req.params.id; 

    db.query(
        'DELETE FROM agendamentos WHERE id = ? AND usuario_id = ?',
        [agendamentoId, usuarioId],
        (err, result) => {
            if (err) {
                console.error("ERRO AO DELETAR AGENDAMENTO:", err);
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Agendamento não encontrado ou não autorizado.' });
            }
            res.status(204).send(); // Sucesso
        }
    );
};

exports.atualizarAgendamento = (req, res) => {
    const usuarioId = req.user.id; 
    const agendamentoId = req.params.id; 
    const { titulo, descricao, data_inicio, data_fim } = req.body;

    db.query(

        'UPDATE agendamentos SET titulo = ?, descricao = ?, data_inicio = ?, data_fim = ? WHERE id = ? AND usuario_id = ?',
        [titulo, descricao, data_inicio, data_fim, agendamentoId, usuarioId],
        (err, result) => {
            if (err) {
                console.error("ERRO AO ATUALIZAR AGENDAMENTO:", err);
                return res.status(500).json({ error: err.message });
            }
             if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Agendamento não encontrado ou não autorizado.' });
            }
            res.json({ message: 'Agendamento atualizado!' });
        }
    );
};