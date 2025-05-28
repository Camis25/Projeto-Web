function cadastroUsuario(){
    const userName = document.getElementById("txtUserName").value.trim();
    const nasc = document.getElementById("dtNasc").value;
    const email = document.getElementById("txtEmail").value.trim();
    const senha = document.getElementById("txtSenha").value;
    const chave = document.getElementById("txtChave").value;

    if(!userName || !nasc || !email || !senha || !chave){
        alert("Preencha todos os campos");
        return;
    }

    if(senha.length !== 8){
        alert("Senha deve conter 8 dígitos");
        return;
    }
    

    if(!verificarIdade(nasc)){
        alert("Você deve ter no minímo 10 anos para se cadastrar");
        return;
    }
    const usuario = {userName, nasc, email, senha, chave};
    localStorage.setItem(email, JSON.stringify(usuario));

    alert("Usuário cadastrado com sucesso");
    document.getElementById("formCadastro").reset();
    document.getElementById("txtUserName").focus();
}

function loginUsuario(){
    const email = document.getElementById("email").value.trim();
    const senhaInput = document.getElementById("senha").value;

    if(!email || !senhaInput){
        alert("Preencha todos os campos");
        return;
    }

    const infoUser = localStorage.getItem(email);
    if(!infoUser){
        alert("Usuário não encontrado");
        return;
    } 

    const usuarioBase = JSON.parse(infoUser);
    if(usuarioBase.senha === senhaInput){
        alert("Seja bem-vindo");
        localStorage.setItem("usuarioLogado", email);

        window.location.href = "areaUsuario.html";
        return;
    }else{
        alert("Senha incorreta");
    }

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

function criarUsuarioFixo() {
    const emailFixo = "anaClara@bemestar.com";
    const usuaria = {
        userName: "Dra. Ana Clara",
        nasc: "1980-05-10",
        email: emailFixo,
        senha: "admin@123",
        chave: "pr0fi$$i0n@l",
        crm: "CRM/SP 123456"
    };

    if (!localStorage.getItem(emailFixo)) {
        localStorage.setItem(emailFixo, JSON.stringify(usuaria));
    }
}

window.addEventListener("DOMContentLoaded", () => {
    criarUsuarioFixo();
});

function loginMedica() {
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
        localStorage.setItem("medicoLogado", email);
        window.location.href = "perfilMedica.html";
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

function carregarDadosMedica() {
    const emailLogado = localStorage.getItem("medicoLogado");

    if (!emailLogado) {
        alert("Usuário não logado");
        window.location.href = "loginMedica.html";
        return;
    }

    const dados = localStorage.getItem(emailLogado);
    if (!dados) {
        alert("Usuário não encontrado");
        return;
    }

    const medica = JSON.parse(dados);

   
    document.getElementById("nomeMedica").textContent = medica.userName;
    document.getElementById("emailMedica").textContent = medica.email;
    document.getElementById("nascMedica").textContent = medica.nasc;
    document.getElementById("CRM").textContent = medica.crm;

}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formArtigo");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        salvarArtigo();
    });
});


function salvarArtigo() {
    const titulo = document.getElementById("tituloArtigo").value.trim();
    const conteudo = document.getElementById("artigo").value.trim();
    const tema = document.getElementById("tema").value;
    const inputImagem = document.getElementById("imagemArtigoFile");

    if (!titulo || !conteudo || !tema || !inputImagem) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const file = inputImagem.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Img = event.target.result;
            salvarNoStorage(titulo, conteudo, base64Img, tema);
        };
        reader.readAsDataURL(file);
    } else {
        salvarNoStorage(titulo, conteudo, inputImagem, tema);
    }
}

function salvarNoStorage(titulo, conteudo, imagemBase64, tema) {
    const artigo = {
        id: Date.now(),
        titulo,
        conteudo,
        imagem: imagemBase64,
        tema,
        data: new Date().toLocaleString()
    };

    const artigosSalvos = JSON.parse(localStorage.getItem("artigos")) || [];
    artigosSalvos.push(artigo);
    localStorage.setItem("artigos", JSON.stringify(artigosSalvos));

    alert("Artigo salvo com sucesso!");
    document.getElementById("formArtigo").reset();
    listarArtigos();
}


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
                    <button class="btn-edit" onclick="editarArtigo(${index})">Editar</button>
                    <button  class="btn-excluir" onclick="excluirArtigo(${index})">Excluir</button>
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
    window.location.href = "leituraArtigo.html";
}


function carregarArtigo() {
    const index = localStorage.getItem("artigoSelecionado");
    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

    if (index === null || !artigos[index]) {
        alert("Artigo não encontrado.");
        window.location.href = "index.html";
        return;
    }

    const artigo = artigos[index];
    document.getElementById("tituloArtigo").textContent = artigo.titulo;
    document.getElementById("dataArtigo").textContent = artigo.data;
    document.getElementById("imagemArtigo").src = artigo.imagem || './Assets/img/placeholder.jpg';
    document.getElementById("imagemArtigo").alt = `Imagem do artigo ${artigo.titulo}`;
    document.getElementById("conteudoArtigo").textContent = artigo.conteudo;
}

function excluirArtigo(index) {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
        let artigos = JSON.parse(localStorage.getItem("artigos")) || [];
        artigos.splice(index, 1);
        localStorage.setItem("artigos", JSON.stringify(artigos));
        listarArtigos(); 
    }
}

window.addEventListener("DOMContentLoaded", listarArtigos);

function carregarComentarios() {
    const index = localStorage.getItem("artigoSelecionado");
    if (index === null) return;

    const comentariosKey = `comentarios_artigo_${index}`;
    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];

    const listaComentarios = document.getElementById("listaComentarios");
    listaComentarios.innerHTML = "";

    if (comentarios.length === 0) {
        listaComentarios.innerHTML = "<p>Seja o primeiro a comentar!</p>";
        return;
    }

    comentarios.forEach(comentario => {
        const div = document.createElement("div");
        div.classList.add("comentario-item");

        div.innerHTML = `
            <div class="comentario-header">
                <img src="${comentario.foto}" alt="Foto do usuário" class="foto-usuario" />
                <span class="nome-usuario">${comentario.usuario}</span>
                <small class="data-comentario">${comentario.data}</small>
            </div>
            <p>${comentario.texto}</p>
        `;

        listaComentarios.appendChild(div);
    });
}

function adicionarComentario() {
    const index = localStorage.getItem("artigoSelecionado");
    if (index === null) {
        alert("Artigo não selecionado.");
        return;
    }

    let nomeUsuario = null;
    let fotoUsuario = null;

    const emailUsuario = localStorage.getItem("usuarioLogado");
    const emailMedica = localStorage.getItem("medicoLogado");

    if (emailUsuario) {
        const dados = JSON.parse(localStorage.getItem(emailUsuario));
        nomeUsuario = dados?.userName;
        fotoUsuario = dados?.foto || "./Assets/img/user.png"; 
    } else if (emailMedica) {
        const dados = JSON.parse(localStorage.getItem(emailMedica));
        nomeUsuario = dados?.userName || "Médica";
        fotoUsuario = "./Assets/img/medica.png";
    }

    if (!nomeUsuario || !fotoUsuario) {
        alert("Você precisa estar logado para comentar.");
        return;
    }

    const textoComentario = document.getElementById("novoComentario").value.trim();
    if (!textoComentario) {
        alert("Escreva algo antes de enviar.");
        return;
    }

    const comentariosKey = `comentarios_artigo_${index}`;
    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];

    const novoComentario = {
        usuario: nomeUsuario,
        foto: fotoUsuario,
        texto: textoComentario,
        data: new Date().toLocaleString()
    };

    comentarios.push(novoComentario);
    localStorage.setItem(comentariosKey, JSON.stringify(comentarios));

    document.getElementById("novoComentario").value = "";
    carregarComentarios();
}


function verificarLoginComentario() {
    const usuario = localStorage.getItem("usuarioNome");
    const medica = localStorage.getItem("medicoLogado");
    const areaComentario = document.getElementById("areaComentario");

    if (!usuario && !medica) {
        if (areaComentario) {
            areaComentario.style.display = "none";
        }
    } else {
        if (areaComentario) {
            areaComentario.style.display = "block";
        }
    }
}



window.addEventListener("DOMContentLoaded", () => {
    const isLeitura = document.getElementById("tituloArtigo");
    const isLista = document.querySelector(".section2-cards");

    if (isLeitura) {
        carregarArtigo();
        carregarComentarios();
        verificarLoginComentario();
    }

    if (isLista) {
        listarArtigos();
    }
});


 function listarTodosComentarios() {
        const container = document.getElementById("comunidadeComentarios");
        container.innerHTML = "";

        const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

        if (artigos.length === 0) {
            container.innerHTML = "<p>Nenhum artigo encontrado.</p>";
            return;
        }

        let comentariosEncontrados = false;

        artigos.forEach((artigo, index) => {
            const comentariosKey = `comentarios_artigo_${index}`;
            const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];

            comentarios.forEach(comentario => {
                comentariosEncontrados = true;
                const div = document.createElement("div");
                div.classList.add("comunidade-cards");

                div.innerHTML = `
                    <p class="user-name">${comentario.usuario}</p>
                    <p><strong>Comentou no artigo:</strong> "${artigo.titulo}"</p>
                    <p>${comentario.texto}</p>
                    <p class="data-comentario"><small>${comentario.data}</small></p>
                `;

                container.appendChild(div);
            });
        });

        if (!comentariosEncontrados) {
            container.innerHTML = "<p>Nenhum comentário feito ainda.</p>";
        }
    }

    window.addEventListener("DOMContentLoaded", listarTodosComentarios);