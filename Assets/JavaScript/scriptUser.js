function limitarTexto(texto, limite) {
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
}

function verificarIdade(dataNasc){
    const hoje = new Date();
    const aniversario = new Date(dataNasc);

    let idade = hoje.getFullYear() - aniversario.getFullYear();
    const mes = hoje.getMonth() - aniversario.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < aniversario.getDate())) {
        idade--;
    }

    return idade >= 10;
}

//Cadastro

function cadastroUsuario() {
    const aceite = document.getElementById("aceiteTermos").checked;
    if (!aceite) {
        alert("Você deve aceitar os Termos de Uso e a Política de Privacidade.");
        return;
    }

    const userName = document.getElementById("txtUserName").value.trim();
    const nasc = document.getElementById("dtNasc").value;
    const email = document.getElementById("txtEmail").value.trim();
    const senha = document.getElementById("txtSenha").value;
    const chave = document.getElementById("txtChave").value;

    if (!userName || !nasc || !email || !senha || !chave) {
        alert("Preencha todos os campos");
        return;
    }

    if (senha.length !== 8) {
        alert("Senha deve conter 8 dígitos");
        return;
    }

    if (!verificarIdade(nasc)) {
        alert("Você deve ter no mínimo 10 anos para se cadastrar");
        return;
    }

    if (localStorage.getItem(email)) {
        alert("Este e-mail já está cadastrado.");
        return;
    }

     if (localStorage.getItem(userName)) {
        alert("Este user já existe.");
        return;
    }

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === "usuarioLogado" || key.startsWith("comentarios_artigo_") || key === "medicoLogado" || key === "artigos" || key === "artigoSelecionado") continue;
        
        const usuario = JSON.parse(localStorage.getItem(key));
        if (usuario.userName === userName) {
            alert("Este nome de usuário já está em uso.");
            return;
        }
    }

    const usuario = { userName, nasc, email, senha, chave };
    localStorage.setItem(email, JSON.stringify(usuario));

    alert("Usuário cadastrado com sucesso");
    document.getElementById("formCadastro").reset();
    document.getElementById("txtUserName").focus();
    window.location.href = "login.html";
}

//Login
function loginUsuario() {
    const email = document.getElementById("email").value.trim();
    const senhaInput = document.getElementById("senha").value;

    if (email.toLowerCase() === "anaclara@bemestar.com") {
        alert("Este e-mail está bloqueado e não pode acessar o sistema.");
        return;
    }

    if (!email || !senhaInput) {
        alert("Preencha todos os campos");
        return;
    }

    const dados = localStorage.getItem(email);
    if (!dados) {
        alert("Usuário não encontrado");
        return;
    }

    const usuario = JSON.parse(dados);

    if (usuario.senha === senhaInput) {
        alert("Login realizado com sucesso!");
        localStorage.setItem("usuarioLogado", email);
        window.location.replace("areaUsuario.html");
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

function logoutUsuario() {
    localStorage.removeItem("usuarioLogado");
    alert("Logout realizado com sucesso!");
    window.location.href = "login.html";
}

function verificarLogin() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html";
    }
}




//Perfil

function carregarDadosUsuario() {
    const emailLogado = localStorage.getItem("usuarioLogado");
    if (!emailLogado) {
        alert("Usuário não logado");
        window.location.href = "login.html";
        return;
    }

    const dados = localStorage.getItem(emailLogado);
    if (!dados) {
        alert("Usuário não encontrado");
        return;
    }

    const usuario = JSON.parse(dados);
    const divDados = document.querySelectorAll(".dados");

    if (divDados.length >= 2) {
        divDados[0].innerHTML = `<p>Username</p><p>${usuario.userName}</p>`;
        divDados[1].innerHTML = `<p>E-mail</p><p>${usuario.email}</p>`;
        divDados[2].innerHTML = `<p>Data de Nascimento</p><p>${usuario.nasc}</p>`;
    }

    const nomeUsuario = document.querySelector(".user p");
    if (nomeUsuario) {
        nomeUsuario.textContent = usuario.userName;
    }
}

function carregarUsuarioParaEdicao() {
    const emailLogado = localStorage.getItem("usuarioLogado");

    if (!emailLogado) {
        alert("Usuário não logado.");
        window.location.href = "login.html";
        return;
    }

    const usuarioJSON = localStorage.getItem(emailLogado);
    if (!usuarioJSON) {
        alert("Usuário não encontrado.");
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    document.getElementById("userName").value = usuario.userName || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("nascimento").value = usuario.nasc || "";
}
function salvarEdicao() {
    const emailOriginal = localStorage.getItem("usuarioLogado");
    const dadosAntigos = JSON.parse(localStorage.getItem(emailOriginal));

    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("email").value.trim();
    const nascimento = document.getElementById("nascimento").value;

    if (!userName || !email || !nascimento) {
        alert("Preencha todos os campos.");
        return;
    }

    if (!verificarIdade(nascimento)) {
        alert("Você deve ter no mínimo 10 anos.");
        return;
    }

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (
            key === "usuarioLogado" ||
            key.startsWith("comentarios_artigo_") ||
            key === "medicoLogado" ||
            key === "artigos" ||
            key === "artigoSelecionado"
        ) continue;

        const usuario = JSON.parse(localStorage.getItem(key));

        if (usuario.userName === userName && key !== emailOriginal) {
            alert("Este nome de usuário já está em uso.");
            return;
        }
    }

    if (email !== emailOriginal && localStorage.getItem(email)) {
        alert("Este e-mail já está cadastrado por outro usuário.");
        return;
    }

    const novoUsuario = {
        userName,
        email,
        nasc: nascimento,
        senha: dadosAntigos.senha,
        chave: dadosAntigos.chave
    };

    if (email !== emailOriginal) {
        localStorage.removeItem(emailOriginal);
        localStorage.setItem("usuarioLogado", email);
    }

    localStorage.setItem(email, JSON.stringify(novoUsuario));
    alert("Alterações salvas com sucesso!");
    window.location.href = "areaUsuario.html";
}

//Comentários

function listarComentariosUsuarioLogado() {
    const container = document.getElementById("comentariosUsuarioLogado");
    container.innerHTML = "";

    const emailUsuario = localStorage.getItem("usuarioLogado");
    const emailMedica = localStorage.getItem("medicoLogado");

    let nomeUsuarioLogado = null;

    if (emailUsuario) {
        const dadosUsuario = JSON.parse(localStorage.getItem(emailUsuario));
        nomeUsuarioLogado = dadosUsuario?.userName;
    } else if (emailMedica) {
        const dadosMedica = JSON.parse(localStorage.getItem(emailMedica));
        nomeUsuarioLogado = dadosMedica?.userName;
    }

    if (!nomeUsuarioLogado) {
        container.innerHTML = "<p>Usuário não logado.</p>";
        return;
    }

    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];
    let encontrouComentarios = false;

    artigos.forEach((artigo, index) => {
        const comentariosKey = `comentarios_artigo_${index}`;
        const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
        const comentariosDoUsuario = comentarios.filter(c => c.usuario === nomeUsuarioLogado);

        comentariosDoUsuario.forEach(comentario => {
            encontrouComentarios = true;
            const textoLimitado = limitarTexto(comentario.texto, 200);

            const div = document.createElement("div");
            div.classList.add("comentario-usuario");
            div.innerHTML = `
                <p><strong>Comentário no artigo:</strong> "${artigo.titulo}"</p>
                <p>${textoLimitado}</p>
                <p class="data-comentario"><small>${comentario.data}</small></p>
            `;
            container.appendChild(div);
        });
    });

    if (!encontrouComentarios) {
        container.innerHTML = "<p>Você ainda não fez comentários.</p>";
    }
}


//Artigos

function listarArtigos(filtroTema = "") {
    const container = document.querySelector(".section2-cards");
    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

    const artigosFiltrados = filtroTema
        ? artigos.filter(artigo => artigo.tema === filtroTema)
        : artigos;

    if (artigosFiltrados.length === 0) {
        container.innerHTML = "<p>Nenhum artigo disponível.</p>";
        return;
    }

    container.innerHTML = "";

    artigosFiltrados.forEach((artigo, index) => {
        const card = document.createElement("div");
        card.classList.add("card-1");

        card.innerHTML = `
            <img class="img-cards" src="${artigo.imagem || './Assets/img/placeholder.jpg'}" alt="Imagem do artigo" />
            <div class="info-cards">
                <h2>${artigo.titulo}</h2>
                <p class="data-artigo">${artigo.data}</p>
                <div class="botoes">
                    <button class="btn-card" onclick="abrirArtigo(${artigo.id})">Leia mais</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function abrirArtigo(id) {
    localStorage.setItem("artigoSelecionadoId", id);

    const path = window.location.pathname;
    if (path.includes("/Pages/")) {
        window.location.href = "leituraArtigo.html";
    } else {
        window.location.href = "Pages/leituraArtigo.html";
    }
}

function filtrarPorTema() {
    const temaSelecionado = document.getElementById("tema").value;
    listarArtigos(temaSelecionado);
}


function editar(index) {
    localStorage.setItem("artigoSelecionado", index);
    window.location.href = "editarPerfilUser.html";
}

window.addEventListener("DOMContentLoaded", listarComentariosUsuarioLogado);

window.addEventListener("load", () => {
    const url = window.location.href;

    if (url.includes("artigosUser.html") || url.includes("comunidadeUser.html") || url.includes("areaUsuario.html") || url.includes("editarPerfilUser.html") || url.includes("cicloMenstrual.html")  ) {
        verificarLogin();
    }

    if (url.includes("areaUsuario.html")) {
        carregarDadosUsuario();
    }

    if (url.includes("editarPerfilUser.html")) {
        carregarUsuarioParaEdicao();
    }

    if (url.includes("artigos.html") || url.includes("index.html") || url.includes("artigosUser.html")) {
        listarArtigos();
    }
});

//Imagem

const accessKey = '_SZZkpYuOy85daQyx7TZ8QHkSNaTLJCJvMEuCnypCKo';

fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`)
  .then(response => response.json())
  .then(data => {
    const img = document.getElementById('random-photo');
    img.src = data.urls.regular;
    img.alt = data.alt_description || "Imagem do Unsplash";
  })
  .catch(error => console.error('Erro ao buscar imagem do Unsplash:', error));
