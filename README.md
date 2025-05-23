
**Construindo uma SPA Simples JavaScript**  
    **Objetivo:** Demonstrar os conceitos de roteamento e renderização dinâmica na prática, sem a complexidade de um framework.  

   **Estrutura de Arquivos:**  

        ```
        meu-projeto-spa/
        ├── index.html
        ├── app.js
        ├── style.css
        └── views/
            ├── home.html
            ├── about.html
            └── contact.html
        ```


**Detalhamento do código `app.js` passo a passo. Este arquivo é o coração da nossa SPA, responsável por gerenciar o roteamento e a renderização dinâmica do conteúdo.**

```javascript
// app.js

// 1. Seleção dos Elementos DOM Principais
const appContent = document.getElementById('app-content');
const navLinks = document.querySelectorAll('nav a');

// 2. Definição das Rotas
const routes = {
    '/': 'views/home.html',        // Rota raiz (home)
    '/about': 'views/about.html',  // Rota para a página "Sobre"
    '/contact': 'views/contact.html' // Rota para a página "Contato"
};

// 3. Função para Carregar o Conteúdo da View (Assíncrona)
async function loadContent(viewPath) {
    try {
        // Faz uma requisição HTTP GET para o arquivo HTML da view especificada
        const response = await fetch(viewPath);

        // Verifica se a requisição foi bem-sucedida (status 2xx)
        if (!response.ok) {
            // Se não foi, lança um erro para ser capturado pelo catch
            throw new Error(`HTTP error! status: ${response.status}, ao tentar carregar ${viewPath}`);
        }

        // Converte a resposta (o conteúdo do arquivo HTML) para texto
        const html = await response.text();

        // Insere o HTML obtido dentro do elemento <main id="app-content">
        appContent.innerHTML = html;

    } catch (error) {
        // Se ocorrer qualquer erro durante o fetch ou processamento
        console.error('Erro ao carregar conteúdo:', error);
        // Exibe uma mensagem de erro genérica ou uma view de erro 404
        appContent.innerHTML = '<h1>Erro 404 - Página não encontrada</h1><p>Não foi possível carregar o conteúdo solicitado. Verifique o caminho do arquivo em `app.js` e se o arquivo HTML existe em `views/`.</p>';
    }
}

// 4. Função para tratar a Mudança de Rota
function handleRouteChange() {
    // Pega a parte da URL após o '#' (o hash)
    // Ex: se a URL é localhost:xxxx/#/about, window.location.hash será '#/about'
    // .substring(1) remove o '#' inicial, resultando em '/about'
    // Se não houver hash (ex: localhost:xxxx/), define como '/' (rota raiz)
    const hash = window.location.hash.substring(1) || '/';

    // Procura o caminho do arquivo HTML correspondente ao hash atual nas nossas 'routes'
    const viewPath = routes[hash];

    if (viewPath) {
        // Se a rota existe em nosso objeto 'routes', carrega o conteúdo
        loadContent(viewPath);
        updateActiveLink(hash); // Atualiza o link ativo na navegação
    } else {
        // Se a rota não for encontrada em 'routes', carrega uma view de "Não Encontrado"
        // Idealmente, teríamos um 'views/404.html' e o adicionaríamos a 'routes' ou o chamaríamos diretamente
        console.warn(`Rota não encontrada para o hash: ${hash}`);
        appContent.innerHTML = '<h1>Erro 404 - Página não encontrada</h1><p>A rota que você tentou acessar não existe.</p>';
        updateActiveLink(''); // Nenhum link deve ficar ativo
    }
}

// 5. Função para Atualizar o Link Ativo na Navegação
function updateActiveLink(currentHash) {
    navLinks.forEach(link => {
        // Obtém o atributo href do link (ex: '#/', '#/about')
        const linkHash = link.getAttribute('href').substring(1); // Remove o '#'

        if (linkHash === currentHash) {
            // Se o hash do link corresponde ao hash atual da URL, adiciona a classe 'active'
            link.classList.add('active');
        } else {
            // Caso contrário, remove a classe 'active'
            link.classList.remove('active');
        }
    });
}

// 6. Adição de Event Listeners (Ouvintes de Eventos)

// Ouve o evento 'hashchange', que é disparado sempre que a parte hash da URL muda
// Isso acontece quando o usuário clica em um link <a href="#/..."> ou usa os botões de voltar/avançar do navegador
window.addEventListener('hashchange', handleRouteChange);

// Ouve o evento 'load', que é disparado quando a página HTML inicial (index.html) é completamente carregada
window.addEventListener('load', () => {
    // Este bloco garante que, ao carregar a página pela primeira vez:
    // 1. Se não houver nenhum hash na URL (ex: o usuário acessou 'index.html' diretamente),
    //    define o hash como '#/' para carregar a página inicial.
    if (!window.location.hash) {
        window.location.hash = '#/'; // Isso também disparará o evento 'hashchange'
    } else {
        // 2. Se já houver um hash na URL (ex: o usuário acessou 'index.html#/about' diretamente
        //    ou atualizou a página), chama handleRouteChange para carregar o conteúdo correto.
        handleRouteChange();
    }
});
```

### Explicação Detalhada das Seções:

1.  **Seleção dos Elementos DOM Principais:**
    *   `const appContent = document.getElementById('app-content');`
        *   `document.getElementById('app-content')`: Procura no `index.html` um elemento HTML que tenha o `id` igual a `app-content`. No nosso caso, é a tag `<main id="app-content"></main>`.
        *   Esta variável `appContent` guardará a referência a esse elemento `<main>`. É aqui que o conteúdo das diferentes "páginas" (views) será injetado dinamicamente.
    *   `const navLinks = document.querySelectorAll('nav a');`
        *   `document.querySelectorAll('nav a')`: Procura no `index.html` todos os elementos `<a>` (links) que estão dentro de um elemento `<nav>`.
        *   Isso retorna uma `NodeList` (similar a um array) contendo todos os links da navegação (`<a href="#/">Home</a>`, `<a href="#/about">Sobre</a>`, etc.).
        *   Usaremos `navLinks` para destacar visualmente qual link corresponde à "página" atual.

2.  **Definição das Rotas (`routes`):**
    *   Este é um objeto JavaScript que funciona como um mapa de roteamento.
    *   **Chaves**: São os fragmentos de hash da URL que queremos reconhecer (ex: `/`, `/about`, `/contact`). Note que o `#` não faz parte da chave aqui, pois `window.location.hash.substring(1)` já o remove.
    *   **Valores**: São os caminhos para os arquivos HTML (`.html`) que contêm o conteúdo de cada "página" ou "view". Estes arquivos estão na pasta `views/`.
    *   Quando o usuário navegar para `seusite.com/#/about`, nosso código usará a chave `'/about'` para encontrar o valor `'views/about.html'` e carregar esse arquivo.

3.  **Função `loadContent(viewPath)`:**
    *   `async function`: Declara uma função assíncrona, o que nos permite usar `await` dentro dela. Isso é útil para lidar com operações que levam tempo, como requisições de rede (`fetch`), sem bloquear a thread principal do JavaScript.
    *   `try...catch`: Estrutura para tratamento de erros. Se algo der errado dentro do bloco `try` (ex: arquivo não encontrado, problema de rede), o código dentro do bloco `catch` será executado.
    *   `await fetch(viewPath)`:
        *   `fetch(viewPath)`: Faz uma requisição HTTP (por padrão, um GET) para o `viewPath` fornecido (ex: `'views/home.html'`). Esta é a essência do AJAX (Asynchronous JavaScript and XML), embora aqui estejamos buscando HTML.
        *   `await`: Pausa a execução da função `loadContent` até que a promessa retornada por `fetch` seja resolvida (ou seja, até que o servidor responda).
    *   `if (!response.ok)`: A propriedade `ok` do objeto `response` é `true` se a requisição HTTP foi bem-sucedida (status na faixa 200-299). Se não foi (ex: erro 404 - Não Encontrado, erro 500 - Erro Interno do Servidor), lançamos um erro.
    *   `const html = await response.text();`: Se a resposta foi `ok`, `response.text()` lê o corpo da resposta e o converte para uma string de texto (que, no nosso caso, será o conteúdo HTML do arquivo da view). `await` novamente pausa até que essa conversão esteja completa.
    *   `appContent.innerHTML = html;`: **Esta é a linha mágica da renderização dinâmica!** Ela pega a string HTML (`html`) obtida do arquivo da view e a define como o conteúdo interno do elemento `<main id="app-content">`. Isso substitui qualquer conteúdo anterior que estava em `appContent`. O navegador então interpreta essa string HTML e renderiza os elementos correspondentes.
    *   Bloco `catch (error)`: Se qualquer erro ocorreu no `try`, ele é capturado aqui.
        *   `console.error(...)`: Registra o erro no console do navegador para depuração.
        *   `appContent.innerHTML = '<h1>...</h1>'`: Mostra uma mensagem de erro amigável para o usuário diretamente na área de conteúdo.

4.  **Função `handleRouteChange()`:**
    *   Esta função é o "controlador de rotas" da nossa SPA. Ela decide qual conteúdo mostrar com base na URL atual.
    *   `const hash = window.location.hash.substring(1) || '/';`:
        *   `window.location.hash`: Retorna a parte da URL que começa com `#` (o "fragmento identificador" ou "hash"). Por exemplo, se a URL for `http://localhost:8000/#/contact`, `window.location.hash` será `"#contact"`.
        *   `.substring(1)`: Remove o primeiro caractere da string, que é o `#`. Então, `"#contact"` se torna `"contact"`.
        *   `|| '/'`: É um operador "OU" lógico. Se `window.location.hash.substring(1)` resultar em uma string vazia (o que acontece se a URL for apenas `http://localhost:8000/` ou `http://localhost:8000/#`), então `hash` receberá o valor `'/'`. Isso define `'/'` como a rota padrão (home).
    *   `const viewPath = routes[hash];`: Tenta encontrar uma entrada no nosso objeto `routes` usando o `hash` atual como chave.
        *   Se `hash` for `'/about'`, `viewPath` receberá `'views/about.html'`.
        *   Se `hash` for `'/nonexistent'`, e `'/nonexistent'` não for uma chave em `routes`, `viewPath` será `undefined`.
    *   `if (viewPath)`: Verifica se a rota foi encontrada no objeto `routes`.
        *   `loadContent(viewPath)`: Se encontrada, chama `loadContent` para carregar e exibir o HTML da view correspondente.
        *   `updateActiveLink(hash)`: Chama a função para atualizar qual link na navegação está visualmente "ativo".
    *   `else`: Se `viewPath` for `undefined` (rota não encontrada).
        *   `console.warn(...)`: Emite um aviso no console.
        *   `appContent.innerHTML = '<h1>Erro 404...</h1>'`: Exibe uma mensagem de página não encontrada no `appContent`.
        *   `updateActiveLink('')`: Garante que nenhum link na navegação fique marcado como ativo, já que a rota atual não é válida.

5.  **Função `updateActiveLink(currentHash)`:**
    *   Responsável por dar feedback visual ao usuário sobre qual "página" está ativa.
    *   `navLinks.forEach(link => { ... });`: Itera sobre cada link `<a>` que foi selecionado anteriormente e armazenado em `navLinks`.
    *   `const linkHash = link.getAttribute('href').substring(1);`: Para cada link, pega o valor do seu atributo `href` (ex: `#/about`) e remove o `#` inicial para comparar com `currentHash`.
    *   `link.classList.add('active');` / `link.classList.remove('active');`:
        *   `classList` é uma propriedade de elementos DOM que permite manipular suas classes CSS.
        *   Se o `href` do link (sem o `#`) corresponde ao `currentHash` da URL, a classe CSS `active` é adicionada ao link. Você precisaria definir estilos para `.active` no seu `style.css` (ex: `nav a.active { color: lightblue; text-decoration: underline; }`).
        *   Caso contrário, a classe `active` é removida (se existir).

6.  **Adição de Event Listeners:**
    *   `window.addEventListener('hashchange', handleRouteChange);`
        *   O evento `hashchange` é disparado no objeto `window` sempre que a parte hash da URL é alterada.
        *   Isso acontece quando:
            1.  O usuário clica em um link como `<a href="#/about">`. O navegador atualiza o hash na URL.
            2.  O usuário usa os botões de "Voltar" ou "Avançar" do navegador, e isso resulta em uma mudança no hash.
            3.  O código JavaScript modifica `window.location.hash` programaticamente.
        *   Quando este evento ocorre, a função `handleRouteChange` é chamada para processar a nova rota. Esta é a espinha dorsal do roteamento do lado do cliente baseado em hash.
    *   `window.addEventListener('load', () => { ... });`
        *   O evento `load` é disparado no objeto `window` quando a página HTML inteira (`index.html` e todos os seus recursos como CSS, imagens, scripts) foi completamente carregada e parseada.
        *   O código dentro deste listener serve para tratar o estado inicial da aplicação:
            *   `if (!window.location.hash)`: Se, ao carregar a página, não houver nenhum hash na URL (ex: `http://localhost:8000/`), ele define `window.location.hash = '#/';`. Isso faz com que a URL mude para `http://localhost:8000/#/`, o que por sua vez **disparará o evento `hashchange`**, e então `handleRouteChange` será chamado para carregar a página inicial.
            *   `else { handleRouteChange(); }`: Se a página já foi carregada com um hash na URL (ex: o usuário abriu um link direto como `http://localhost:8000/#/contact` ou atualizou a página), então `handleRouteChange` é chamado diretamente para carregar o conteúdo correspondente a esse hash existente.

### Resumo do Fluxo:

1.  **Carregamento Inicial (`index.html`):**
    *   O navegador carrega `index.html`.
    *   O script `app.js` é executado.
    *   O listener do evento `load` é acionado.
    *   Se não houver hash, ele é definido para `#/`. Se houver, `handleRouteChange` é chamado.
2.  **`handleRouteChange` é Chamado:**
    *   Lê o hash da URL.
    *   Consulta o objeto `routes` para encontrar o arquivo HTML correspondente.
    *   Chama `loadContent` com o caminho do arquivo.
    *   Chama `updateActiveLink` para estilizar o link de navegação correto.
3.  **`loadContent` Busca e Renderiza:**
    *   Usa `fetch` para buscar o conteúdo do arquivo HTML da view.
    *   Insere esse HTML dentro de `<main id="app-content">`.
4.  **Navegação do Usuário:**
    *   Usuário clica em um link (ex: `<a href="#/about">`).
    *   O hash da URL muda para `#/about`.
    *   O evento `hashchange` é disparado.
    *   `handleRouteChange` é chamado novamente, repetindo o processo para a nova rota.

Este `app.js` implementa uma SPA funcional e simples, demonstrando os conceitos chave de roteamento do lado do cliente e renderização dinâmica de conteúdo usando apenas JavaScript puro e a API `fetch`.

## 👤 GitHub

[![Foto de Perfil](https://github.com/floresjcd.png?size=50)](https://github.com/floresjcd) 
**[@floresjcd](https://github.com/floresjcd)**


