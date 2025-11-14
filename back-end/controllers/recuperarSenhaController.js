const db = require('../db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

exports.solicitarRecuperacao = (req, res) => {
  const { email } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000); 

    db.query(
      'UPDATE usuarios SET reset_token=?, reset_token_expiry=? WHERE email=?',
      [token, expiry, email],
      (err) => {
        if (err) return res.status(500).json({ error: err });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Recuperação de senha',
          text: `Você solicitou a recuperação de senha. Use este link para redefinir: 
http://localhost:3000/reset-senha/${token} \nLink válido por 1 hora.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ message: 'E-mail de recuperação enviado!' });
        });
      }
    );
  });
};

exports.resetarSenha = (req, res) => {
  const { token, novaSenha } = req.body;

  db.query('SELECT * FROM usuarios WHERE reset_token=?', [token], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(400).json({ error: 'Token inválido' });

    const usuario = results[0];
    const now = new Date();
    if (now > usuario.reset_token_expiry) return res.status(400).json({ error: 'Token expirado' });

    const senhaHash = bcrypt.hashSync(novaSenha, 8);

    db.query(
      'UPDATE usuarios SET senha=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?',
      [senhaHash, usuario.id],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Senha redefinida com sucesso!' });
      }
    );
  });
};
