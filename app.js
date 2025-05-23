const appContent = document.getElementById('app-content');
const navLinks = document.querySelectorAll('nav a');

// Define as rotas e os arquivos HTML correspondentes
const routes = {
    '/': 'views/home.html',
    '/about': 'views/about.html',
    '/contact': 'views/contact.html'
};

// Função para carregar o conteúdo da view
async function loadContent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        appContent.innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        appContent.innerHTML = '<h1>Erro 404 - Página não encontrada</h1><p>Não foi possível carregar o conteúdo.</p>';
    }
}

// Função para lidar com a mudança de rota
function handleRouteChange() {
    const hash = window.location.hash.substring(1) || '/'; // Pega o hash ou define '/' como padrão
    const path = routes[hash];

    if (path) {
        loadContent(path);
        updateActiveLink(hash);
    } else {
        // Rota não encontrada - poderia carregar uma view de 404 específica
        loadContent('views/404.html'); // Supondo que você crie um views/404.html
        // Ou simplesmente:
        // appContent.innerHTML = '<h1>Erro 404 - Página não encontrada</h1>';
        // console.warn(`Rota não encontrada para: ${hash}`);
        updateActiveLink(''); // Nenhuma rota ativa
    }
}

// Função para atualizar o link ativo na navegação
function updateActiveLink(currentHash) {
    navLinks.forEach(link => {
        // Comparar o href do link (sem o '#') com o hash atual
        if (link.getAttribute('href').substring(1) === currentHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


// Adiciona listeners para eventos de mudança de hash e carregamento inicial
window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', () => {
    // Garante que a rota correta seja carregada no load inicial
    // (se o usuário acessar diretamente uma URL com hash)
    if (!window.location.hash) {
        window.location.hash = '#/'; // Redireciona para home se não houver hash
    } else {
        handleRouteChange(); // Processa o hash existente
    }
});

// (Opcional) Criar um `views/404.html` simples:
// <h1>404 - Página Não Encontrada</h1>
// <p>O recurso que você está procurando não existe.</p>