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

function addPost(type) {
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

    // Montar o conteúdo do post
    let htmlMarkup = `
        <div class="post-user"><strong>Usuário Criativo</strong> <span>(Agora mesmo)</span></div>
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
