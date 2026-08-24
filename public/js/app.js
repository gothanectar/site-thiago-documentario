// 0. Sistema de Autenticação e Gestão de Usuários (Integração com Banco de Dados)
let isLoginMode = true;
let currentUser = null;

// Inicialização: verificar se há usuário logado e carregar posts do banco
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('cuvida_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        hideAuthScreen();
    }
    loadMembersFromDB();
    loadAllPostsFromDB(); // Carregar posts do banco de dados
});

// Alternar entre modo Login e Cadastro
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-btn');
    const toggleText = document.getElementById('auth-toggle-text');
    const toggleLink = document.getElementById('auth-toggle-link');
    const nameInput = document.getElementById('auth-name');

    if (isLoginMode) {
        title.textContent = 'Bem-vindo à Cuvida';
        btn.textContent = 'Entrar';
        toggleText.textContent = 'Não tem conta?';
        toggleLink.textContent = 'Cadastre-se';
        nameInput.style.display = 'none';
    } else {
        title.textContent = 'Crie sua conta';
        btn.textContent = 'Cadastrar';
        toggleText.textContent = 'Já tem conta?';
        toggleLink.textContent = 'Fazer login';
        nameInput.style.display = 'block';
    }
}

// Processar Login ou Cadastro (Integração com Banco de Dados)
async function handleAuth() {
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    if (!email || !password) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    if (!isLoginMode && !name) {
        alert('Por favor, informe seu nome completo!');
        return;
    }

    if (isLoginMode) {
        // Login - buscar usuário no banco
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentUser = data;
                localStorage.setItem('cuvida_current_user', JSON.stringify(data));
                hideAuthScreen();
                alert(`Bem-vindo de volta, ${data.name}!`);
            } else {
                alert('E-mail não encontrado. Cadastre-se primeiro!');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        }
    } else {
        // Cadastro - criar usuário no banco
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role: 'Membro Autodidata' })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentUser = data;
                localStorage.setItem('cuvida_current_user', JSON.stringify(data));
                hideAuthScreen();
                loadMembersFromDB();
                alert(`Conta criada com sucesso! Bem-vindo, ${name}!`);
            } else {
                alert(data.error || 'Erro ao criar conta. E-mail já cadastrado?');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        }
    }
}

// Esconder tela de autenticação e mostrar o app
function hideAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    const appContainer = document.querySelector('.app-container');
    
    authScreen.classList.add('hidden');
    appContainer.classList.add('active');
}

// Carregar e exibir lista de membros do banco de dados
async function loadMembersFromDB() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const membersList = document.getElementById('members-list');
        const usersListContainer = document.getElementById('users-list-container');
        
        if (membersList) {
            membersList.innerHTML = '';
            users.forEach(user => {
                const memberCard = document.createElement('div');
                memberCard.className = 'member-card';
                
                const initial = user.name.charAt(0).toUpperCase();
                const joinedDate = new Date(user.created_at).toLocaleDateString('pt-BR');
                
                memberCard.innerHTML = `
                    <div class="member-avatar">${initial}</div>
                    <div class="member-name">${user.name}</div>
                    <div class="member-email">${user.email}</div>
                    <div class="member-status">${user.role}</div>
                    <div class="member-joined">Membro desde ${joinedDate}</div>
                `;
                
                membersList.appendChild(memberCard);
            });
        }
        
        if (usersListContainer) {
            usersListContainer.innerHTML = '';
            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-directory-card';
                userCard.innerHTML = `
                    <div class="u-avatar"><i class="fa-solid fa-circle-user"></i></div>
                    <div class="u-info">
                        <h4>${user.name}</h4>
                        <p>${user.role}</p>
                        <span class="badge-status">Membro Conectado</span>
                    </div>
                `;
                usersListContainer.appendChild(userCard);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar membros:', error);
    }
}

// 1. Função para Trocar de Abas (Sistema de Navegação)
function switchTab(tabName) {
    // Esconder todos os conteúdos de abas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Desativar a cor ativa de todos os botões do menu
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mostrar a aba clicada e ativar o botão correspondente
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Achar o botão correto pelo clique e marcar ativo
    const activeButton = document.querySelector(`button[onclick="switchTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 2. Sistema para Postar Mensagens de Verdade nos Feeds (Estilo Redes Sociais)
let imageGlobalBase64 = ""; // Guarda a imagem temporariamente se o usuário fizer upload

// Função para carregar todos os posts do banco de dados
async function loadAllPostsFromDB() {
    const feedTypes = ['origens', 'resiliencia', 'sincronicidades', 'coletiva'];
    
    for (const type of feedTypes) {
        try {
            const response = await fetch(`/api/posts?type=${type}`);
            const posts = await response.json();
            const feed = document.getElementById(`feed-${type}`);
            
            if (feed && posts.length > 0) {
                // Preservar o post original do criador
                const originalPost = feed.querySelector('.post-card');
                feed.innerHTML = '';
                if (originalPost) {
                    feed.appendChild(originalPost);
                }
                
                // Adicionar posts do banco na ordem inversa (mais recentes primeiro)
                posts.forEach(postData => {
                    const postCard = document.createElement('div');
                    postCard.className = 'post-card';
                    
                    if (postData.type === 'sincronicidades') postCard.classList.add('crystal');
                    if (postData.type === 'coletiva') postCard.classList.add('collective');
                    if (postData.type === 'resiliencia') postCard.classList.add('border-alert');
                    
                    postCard.innerHTML = postData.html;
                    feed.insertBefore(postCard, feed.firstChild);
                });
            }
        } catch (error) {
            console.error(`Erro ao carregar posts de ${type}:`, error);
        }
    }
}

async function addPost(type) {
    const textarea = document.getElementById(`txt-${type}`);
    const textContent = textarea.value.trim();

    if (textContent === "") {
        alert("Por favor, digite alguma mensagem antes de postar!");
        return;
    }

    const feed = document.getElementById(`feed-${type}`);
    
    // Criar o card do novo post dinamicamente
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    // Aplicar estilos especiais baseados na aba escolhida
    if (type === 'sincronicidades') postCard.classList.add('crystal');
    if (type === 'coletiva') postCard.classList.add('collective');
    if (type === 'resiliencia') postCard.classList.add('border-alert');

    // Montar o conteúdo do post
    let htmlMarkup = `
        <div class="post-user"><strong>${currentUser ? currentUser.name : 'Usuário Criativo'}</strong> <span>(Agora mesmo)</span></div>
        <p>${textContent}</p>
    `;

    // Se tiver imagem anexada (na aba de sincronicidades/sonhos), inclui ela no post
    if (type === 'sincronicidades' && imageGlobalBase64 !== "") {
        htmlMarkup += `<div id="preview-box"><img src="${imageGlobalBase64}" style="margin-top:10px; max-width:100%; border-radius:8px;"></div>`;
        // Limpar o preview e a variável após o envio
        document.getElementById('preview-box').innerHTML = "";
        imageGlobalBase64 = "";
    }

    postCard.innerHTML = htmlMarkup;
    
    // Inserir o novo post no topo do feed (estilo feed do Instagram)
    feed.insertBefore(postCard, feed.firstChild);

    // Salvar o post no banco de dados
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: type,
                html: htmlMarkup,
                user_name: currentUser ? currentUser.name : 'Usuário Criativo'
            })
        });
        
        if (!response.ok) {
            console.error('Erro ao salvar post no banco');
        }
    } catch (error) {
        console.error('Erro ao salvar post:', error);
    }

    // Limpar o campo de texto para a próxima postagem
    textarea.value = "";
}

// 3. Função para Ler e Mostrar a Prévia da Imagem antes de Postar
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const previewBox = document.getElementById('preview-box');
        previewBox.innerHTML = `<img src="${reader.result}">`;
        imageGlobalBase64 = reader.result; // Salva os dados da imagem para incluir no post
    }
    if(event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

// 4. Sistema de Chat em Tempo Real (Aba Conexões)
function sendChatMessage() {
    const inputField = document.getElementById('chat-msg');
    const messageText = inputField.value.trim();

    if (messageText === "") return;

    const chatWindow = document.getElementById('chat-window');

    // 1. Adiciona a sua mensagem no chat (balão verde na direita)
    const userMsg = document.createElement('div');
    userMsg.className = 'msg output';
    userMsg.innerText = messageText;
    chatWindow.appendChild(userMsg);

    // Limpar o campo de escrita
    inputField.value = "";
    
    // Rolar a tela do chat automaticamente para baixo
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // 2. Resposta automática da IA simulando outro usuário criativo após 1.5 segundos
    setTimeout(() => {
        const systemResponse = document.createElement('div');
        systemResponse.className = 'msg input';
        systemResponse.innerText = "Que sensacional sua colocação! Essa inteligência coletiva e desenvoltura do app Cuvida vai conectar muita gente boa e autodidata. Vamos espalhar essa ideia!";
        chatWindow.appendChild(systemResponse);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1500);
}

// Permitir enviar a mensagem do chat apertando a tecla ENTER do teclado
document.getElementById('chat-msg')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// ====== MOTOR DE LOGIN E REGISTRO DE MEMBROS (INTEGRAÇÃO) ======

// Inicializa a lista de usuários no sistema de forma persistente
if (!localStorage.getItem('cuvida_users')) {
    const initialUsers = [
        { name: "Thiago Augusto Hetzel Silva", email: "thiago@cuvida.com", role: "Massoterapeuta | Criador" }
    ];
    localStorage.setItem('cuvida_users', JSON.stringify(initialUsers));
}

let isSignUpMode = false;

// Alterna o formulário entre as opções de Login e Criar Conta
function toggleAuthModeNew() {
    isSignUpMode = !isSignUpMode;
    const nameInput = document.getElementById('auth-name');
    const toggleLink = document.getElementById('toggle-link');
    const toggleText = document.getElementById('toggle-text');
    const btnAuth = document.getElementById('btn-auth');

    if (isSignUpMode) {
        nameInput.classList.remove('hidden');
        btnAuth.innerText = "Criar Minha Conta";
        toggleText.innerText = "Já possui uma conta?";
        toggleLink.innerText = "Faça login aqui";
    } else {
        nameInput.classList.add('hidden');
        btnAuth.innerText = "Acessar Plataforma";
        toggleText.innerText = "Não tem uma conta?";
        toggleLink.innerText = "Cadastre-se aqui";
    }
}

// Gerencia o clique no botão de acesso ou registro (Integração com Banco de Dados)
async function handleAuthNew() {
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();

    if (!email || !pass) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (isSignUpMode) {
        if (!name) {
            alert("Por favor, digite seu nome completo para efetuar o cadastro.");
            return;
        }
        
        // Cadastra o novo usuário autodidata no banco
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role: 'Membro Autodidata' })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("Conta criada com sucesso! Troque para o modo de login para acessar.");
                toggleAuthModeNew();
            } else {
                alert(data.error || 'Erro ao criar conta. E-mail já cadastrado?');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        }
    } else {
        // Valida o acesso buscando no banco
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const userFound = await response.json();
            
            if (response.ok && userFound) {
                // Remove o bloqueio visual e libera o app
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('app-main-content').classList.remove('app-blurred');
                document.getElementById('current-logged-user').innerText = `Acessando como: ${userFound.name}`;
                currentUser = userFound;
                localStorage.setItem('cuvida_current_user', JSON.stringify(userFound));
                renderUsersList();
            } else {
                alert("E-mail não encontrado. Tente novamente ou crie uma nova conta!");
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        }
    }
}

// Carrega os membros de forma dinâmica no painel de diretório (Integração com Banco de Dados)
async function renderUsersList() {
    const container = document.getElementById('users-list-container');
    if (!container) return;
    
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        container.innerHTML = ""; 

        users.forEach(u => {
            const userCard = document.createElement('div');
            userCard.className = 'user-directory-card';
            userCard.innerHTML = `
                <div class="u-avatar"><i class="fa-solid fa-circle-user"></i></div>
                <div class="u-info">
                    <h4>${u.name}</h4>
                    <p>${u.role}</p>
                    <span class="badge-status">Membro Conectado</span>
                </div>
            `;
            container.appendChild(userCard);
        });
    } catch (error) {
        console.error('Erro ao carregar membros:', error);
    }
}
