const API_BASE_URL = 'http://localhost:5000/api';

async function login(email, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, message: data.message || 'Login falhou' };
        }
    } catch (error) {
        return { success: false, message: 'Erro de conexão.' };
    }
}

async function register(nome, email, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/cadastro`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, message: data.message || 'Cadastro falhou' };
        }
    } catch (error) {
        return { success: false, message: 'Erro de conexão.' };
    }
}

function saveToken(token, role) {
    localStorage.setItem('meu_token', token);
    localStorage.setItem('user_role', role);
}

function getToken() { return localStorage.getItem('meu_token'); }
function getRole() { return localStorage.getItem('user_role'); }

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

function logout() {
    localStorage.removeItem('meu_token');
    localStorage.removeItem('user_role');
    window.location.href = 'login.html';
}

function authGuard() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

function checkAdmin() {
    const role = getRole(); 
    
    if (role?.trim().toLowerCase() !== 'admin') { 
        alert('Acesso negado');
        window.location.href = 'agendamentos.html';
    }
}

async function requestPasswordReset(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await response.json();
      
        return { success: true, message: data.message };

    } catch (error) {
        return { success: false, message: 'Erro de conexão.' };
    }
}

async function resetPassword(token, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, senha: senha })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data: data };
        } else {
            return { success: false, message: data.message || 'Falha ao redefinir.' };
        }
    } catch (error) {
        return { success: false, message: 'Erro de conexão.' };
    }
}