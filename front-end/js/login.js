document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageElement = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessageElement.textContent = '';
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        const result = await login(email, senha);

        if (result.success) {
            saveToken(result.data.token, result.data.nivel); 
            window.location.href = 'agendamentos.html';
        } else {
            
            errorMessageElement.textContent = result.message;
        }
    });
});