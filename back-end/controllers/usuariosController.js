const db = require('../db');

exports.getUsuarios = (req, res) => {
    db.query('SELECT id, nome, email, nivel, status FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.alterarStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    db.query('UPDATE usuarios SET status=? WHERE id=?', [status, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Status atualizado com sucesso' });
    });
};

exports.alterarNivel = (req, res) => {
    const { id } = req.params;
    const { nivel } = req.body; 
    db.query('UPDATE usuarios SET nivel=? WHERE id=?', [nivel, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Nível atualizado com sucesso' });
    });
};
