CREATE DATABASE tcc_maciel;
CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(25),
    nivel ENUM('admin','usuario') DEFAULT 'usuario',
    status ENUM('ativo','bloqueado') DEFAULT 'ativo'
);
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATETIME NOT NULL,
	data_fim DATETIME NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
ALTER TABLE usuarios 
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expiry DATETIME;

SELECT*FROM usuarios;
SELECT*FROM agendamentos;

DELETE FROM usuarios WHERE email = '';