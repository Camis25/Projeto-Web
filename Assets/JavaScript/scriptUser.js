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

    const usuario = { userName, nasc, email, senha, chave };
    localStorage.setItem(email, JSON.stringify(usuario));

    alert("Usuário cadastrado com sucesso");
    document.getElementById("formCadastro").reset();
    document.getElementById("txtUserName").focus();
}


function loginUsuario() {
    const email = document.getElementById("email").value.trim();
    const senhaInput = document.getElementById("senha").value;

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
        window.location.href = "areaUsuario.html";
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

function logoutUsuario() {
    localStorage.removeItem("usuarioLogado");
    alert("Logout realizado com sucesso!");
    window.location.href = "login.html";
}



function verificarIdade(dataNasc){
    const hoje = new Date();
    const aniversario = new Date(dataNasc);

    let idade = hoje.getFullYear() - aniversario.getFullYear();
    const mes = hoje.getMonth() - aniversario.getMonth();

    if(mes < 0 || (mes === 0 && hoje.getDate() < aniversario.getDate())){
        idade--;
    }

    return idade >= 10;
}

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
            divDados[0].innerHTML = `
                <p>Username</p>
                <p>${usuario.userName}</p>
            `;
            divDados[1].innerHTML = `
                <p>E-mail</p>
                <p>${usuario.email}</p>
            `;
            divDados[2].innerHTML = `
                <p>Data de Nascimento</p>
                <p>${usuario.nasc}</p>
            `;
        }

        const nomeUsuario = document.querySelector(".user p");
        if (nomeUsuario) {
            nomeUsuario.textContent = usuario.userName;
        }

    }

    
            if (window.location.pathname.includes("areaUsuario.html")) {
            window.onload = carregarDadosUsuario;
}



function editar(index) {
    localStorage.setItem("artigoSelecionado", index);
    window.location.href = "editarPerfilUser.html";
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

    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("email").value.trim();
    const nascimento = document.getElementById("nascimento").value;

    if (!userName || !email || !nascimento) {
        alert("Preencha todos os campos.");
        return;
    }

    const novoUsuario = {
        userName,
        email,
        nasc: nascimento,
        senha: "",  // Se desejar manter a senha, recupere antes.
        chave: ""   // Mesmo caso para chave.
    };

    // Recupera dados antigos
    const dadosAntigos = JSON.parse(localStorage.getItem(emailOriginal));
    novoUsuario.senha = dadosAntigos.senha;
    novoUsuario.chave = dadosAntigos.chave;

    // Se o e-mail foi alterado, apaga o antigo
    if (email !== emailOriginal) {
        localStorage.removeItem(emailOriginal);
        localStorage.setItem("usuarioLogado", email);
    }

    localStorage.setItem(email, JSON.stringify(novoUsuario));
    alert("Alterações salvas com sucesso!");
    window.location.href = "areaUsuario.html";
}

window.addEventListener("load", () => {
    if (window.location.pathname.includes("areaUsuario.html")) {
        carregarDadosUsuario();
    }

    if (window.location.pathname.includes("editarPerfilUser.html")) {
        carregarUsuarioParaEdicao();
    }

    if (window.location.pathname.includes("artigos.html")) {
        listarArtigos();
    }
});



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
                    <button class="btn-card" onclick="abrirArtigo(${index})">Leia mais</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}


function filtrarPorTema() {
    const temaSelecionado = document.getElementById("tema").value;
    listarArtigos(temaSelecionado);
}

function abrirArtigo(index) {
    localStorage.setItem("artigoSelecionado", index);

    const path = window.location.pathname;

    if (path.includes("/Pages/")) {
        window.location.href = "leituraArtigo.html";
    } else {
        window.location.href = "Pages/leituraArtigo.html";
    }
}






const accessKey = '_SZZkpYuOy85daQyx7TZ8QHkSNaTLJCJvMEuCnypCKo';

fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`)
  .then(response => response.json())
  .then(data => {
    const img = document.getElementById('random-photo');
    img.src = data.urls.regular;
    img.alt = data.alt_description || "Imagem do Unsplash";
  })
  .catch(error => console.error('Erro ao buscar imagem do Unsplash:', error));


  window.addEventListener("load", () => {
    if (window.location.pathname.includes("areaUsuario.html")) {
        carregarDadosUsuario();
    }

    if (window.location.pathname.includes("editarPerfilUser.html")) {
        carregarUsuarioParaEdicao();
    }

    if (window.location.pathname.includes("artigos.html")) {
        listarArtigos();
    }

     if (window.location.pathname.includes("artigosUser.html")) {
        listarArtigos();
    }

    if (window.location.pathname.includes("index.html")) {
        listarArtigos();
    }
});
