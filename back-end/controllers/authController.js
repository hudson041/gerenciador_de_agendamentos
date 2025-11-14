const db = require('../db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.register = (req, res) => {
    const { nome, email, senha, nivel } = req.body;
    const senhaHash = bcrypt.hashSync(senha, 8);

    db.query(
        'INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)',
        [nome, email, senhaHash, nivel || 'usuario'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Usuário cadastrado com sucesso!' });
        }
    );
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
  
        if (results.length === 0) {
            return res.json({ message: 'Se o e-mail existir em nosso sistema, um link será enviado.' });
        }

        const user = results[0];

        const token = crypto.randomBytes(20).toString('hex');

        const expiry = new Date(Date.now() + 3600000); 

        db.query(
            'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [token, expiry, user.id],
            (errUpdate, resultUpdate) => {
                if (errUpdate) return res.status(500).json({ error: errUpdate.message });

                console.log('--- LINK DE RECUPERAÇÃO GERADO (SIMULAÇÃO) ---');
                console.log(`Usuário: ${user.email}`);
                console.log(`Link: http://127.0.0.1:5500/resetPassword.html?token=${token}`);
                console.log('-------------------------------------------------');

                res.json({ message: 'Se o e-mail existir em nosso sistema, um link será enviado.' });
            }
        );
    });
};

exports.resetPassword = (req, res) => {
    const { token, senha } = req.body;

    if (!token || !senha) {
        return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
    }

    db.query(
        'SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()',
        [token],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (results.length === 0) {
                return res.status(400).json({ message: 'Token inválido ou expirado.' });
            }

            const user = results[0];

            const senhaHash = bcrypt.hashSync(senha, 8);

            db.query(
                'UPDATE usuarios SET senha = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
                [senhaHash, user.id],
                (errUpdate, resultUpdate) => {
                    if (errUpdate) return res.status(500).json({ error: errUpdate.message });
                    res.json({ message: 'Senha redefinida com sucesso!' });
                }
            );
        }
    );
};

exports.login = (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        
        if (err) {
            console.error("ERRO DE BANCO:", err);
            return res.status(500).json({ error: err.message });
        }
        
        try {
            if (results.length === 0) {
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }

            const user = results[0];

            if (user.status === 'bloqueado') {
                return res.status(403).json({ message: 'Usuário bloqueado' });
            }

            const senhaValida = bcrypt.compareSync(senha, user.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            const token = jwt.sign({ id: user.id, nivel: user.nivel }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.json({ message: 'Login realizado', token, nivel: user.nivel });

        } catch (error) {
            console.error("ERRO NA LÓGICA DE LOGIN:", error);
            res.status(500).json({ message: 'Erro interno no servidor.', details: error.message });
        }
    });
};
