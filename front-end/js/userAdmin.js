document.addEventListener('DOMContentLoaded', () => {
    
    const tbody = document.getElementById('user-list-tbody');
    const logoutButton = document.getElementById('logout-button');

    async function fetchUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, { 
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (response.status === 401 || response.status === 403) logout();
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    }
    
    async function updateUserStatus(id, novoStatus) {
        try {
            await fetch(`${API_BASE_URL}/users/status/${id}`, {
            method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: novoStatus })
            });
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    }

   async function loadUsers() {
        tbody.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
        
        const users = await fetchUsers();
        
        tbody.innerHTML = ''; 

        if (users && users.length > 0) {
            users.forEach(user => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.status}</td>
                    <td>${user.nivel}</td>
                `;
                
                const tdAcao = document.createElement('td');
                const btnBloqueio = document.createElement('button');
                
                const novoStatus = user.status === 'ativo' ? 'bloqueado' : 'ativo';
                btnBloqueio.textContent = user.status === 'ativo' ? 'Bloquear' : 'Desbloquear';
                
                btnBloqueio.addEventListener('click', async () => {
                    await updateUserStatus(user.id, novoStatus);
                    loadUsers(); 
                });
                
                tdAcao.appendChild(btnBloqueio);
                tr.appendChild(tdAcao); 
                
                tbody.appendChild(tr); 
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>';
        }
    }
    
    logoutButton.addEventListener('click', () => {
        logout(); 
    });
    loadUsers();
});