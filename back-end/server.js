const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const agendamentoRoutes = require('./routes/agendamentos');

const usuariosRoutes = require('./routes/usuarios'); 

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5500', 
        'http://127.0.0.1:5500' 
    ] 
};
app.use(cors(corsOptions)); 
app.use(bodyParser.json()); 
app.use('/api/auth', authRoutes);
app.use('/api/agendamentos', agendamentoRoutes);
app.use('/api/users', usuariosRoutes); 

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));