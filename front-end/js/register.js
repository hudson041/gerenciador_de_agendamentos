document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageElement = document.getElementById('message'); 

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageElement.textContent = '';
        messageElement.className = 'error-message'; 

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if (senha !== confirmarSenha) {
            messageElement.textContent = 'As senhas não conferem.';
            return;
        }

        const result = await register(nome, email, senha);

        if (result.success) {
            
            messageElement.className = 'success-message'; 
            messageElement.textContent = result.data.message || 'Cadastro realizado! Redirecionando...';
            
            
            registerForm.querySelector('button').disabled = true;

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            
        } else {
            
            messageElement.textContent = result.message;
        }
    });
});