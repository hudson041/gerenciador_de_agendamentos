document.addEventListener('DOMContentLoaded', () => {
    
    const listaContainer = document.getElementById('lista-agendamentos');
    const form = document.getElementById('form-novo-agendamento');
    const formError = document.getElementById('form-error');
    const logoutButton = document.getElementById('logout-button');

    async function fetchAgendamentos() {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (response.status === 401) logout();
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    }

    async function postAgendamento(dados) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos`, {
                method: 'POST',
                headers: getAuthHeaders(), 
                body: JSON.stringify(dados)
            });
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
        }
    }

    async function deleteAgendamento(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders() 
            });
            return response.status === 204;
        } catch (error) {
            console.error('Erro ao excluir agendamento:', error);
        }
    }

    async function carregarAgendamentos() {
        listaContainer.innerHTML = '<p>Carregando...</p>';
        const agendamentos = await fetchAgendamentos();
        listaContainer.innerHTML = ''; 

        if (agendamentos && agendamentos.length > 0) {
            agendamentos.forEach(ag => {
                const item = document.createElement('div');
                item.className = 'agendamento-item';
                
            const dataInicio = new Date(ag.data_inicio).toLocaleString('pt-BR');
            const dataFim = new Date(ag.data_fim).toLocaleString('pt-BR');

            item.innerHTML = `
                <h3>${ag.titulo}</h3>
                <p>${ag.descricao || 'Sem descrição'}</p>
                
                <p><strong>Início:</strong> ${dataInicio}</p>
                <p><strong>Fim:</strong> ${dataFim}</p>

                <button class="delete-btn">Excluir</button>
            `;
                item.querySelector('.delete-btn').addEventListener('click', async () => {
                    if (confirm('Tem certeza?')) {
                        await deleteAgendamento(ag.id);
                        carregarAgendamentos(); 
                    }
                });
                listaContainer.appendChild(item);
            });
        } else {
            listaContainer.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const dados = {
            titulo: document.getElementById('titulo').value,
            data_inicio: document.getElementById('data_inicio').value,
            data_fim: document.getElementById('data_fim').value,
            descricao: document.getElementById('descricao').value,
        };
        
        const result = await postAgendamento(dados);
        if (result && result.id) {
            form.reset();
            carregarAgendamentos();
        } else {
            formError.textContent = result.message || 'Erro ao criar.';
        }
    });

    logoutButton.addEventListener('click', () => {
        logout(); 
    });

    carregarAgendamentos();
});