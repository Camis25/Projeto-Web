

function listarArtigos(filtroTema = "") {
    const container = document.querySelector(".section2-cards");
    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

    const artigosFiltrados = filtroTema
        ? artigos.filter(artigo => artigo.tema === filtroTema)
        : artigos;

    if (artigosFiltrados.length === 0) {
        container.innerHTML = `<p>Nenhum artigo disponível.</p>`;
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
                    <button class="btn-edit" onclick="editarArtigo(${index})">Editar</button>
                    <button  class="btn-excluir" onclick="excluirArtigo(${index})">Excluir</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function favoritarComentario(comentarioIndex) {
    const artigoId = localStorage.getItem("artigoSelecionadoId");
    const comentariosKey = `comentarios_artigo_${artigoId}`;
    const favoritosKey = "comentariosFavoritos";

    // Carrega os comentários e favoritos do localStorage
    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
    const favoritos = JSON.parse(localStorage.getItem(favoritosKey)) || [];

    // Verifica se o comentário existe
    const comentario = comentarios[comentarioIndex];
    if (!comentario) {
        alert("Comentário não encontrado.");
        return;
    }

    // Verifica se o comentário já está favoritado
    const favoritoIndex = favoritos.findIndex(c =>
        c.texto === comentario.texto &&
        c.usuario === comentario.usuario &&
        c.data === comentario.data &&
        c.artigoId == artigoId
    );

    if (favoritoIndex !== -1) {
        // Remove dos favoritos
        favoritos.splice(favoritoIndex, 1);
        localStorage.setItem(favoritosKey, JSON.stringify(favoritos));
        alert("Comentário removido dos favoritos.");
    } else {
        // Adiciona aos favoritos
        const artigos = JSON.parse(localStorage.getItem("artigos")) || [];
        const artigo = artigos.find(art => art.id == artigoId);
        favoritos.push({
            ...comentario,
            artigoId: artigoId,
            artigoTitulo: artigo ? artigo.titulo : "Sem título"
        });
        localStorage.setItem(favoritosKey, JSON.stringify(favoritos));
        alert("Comentário favoritado com sucesso!");
    }

    // Atualiza a lista de comentários para refletir o estado do botão
    carregarComentarios();
}


function filtrarPorTema() {
    const temaSelecionado = document.getElementById("tema").value;
    listarArtigos(temaSelecionado);
}

function abrirArtigo(id) {
    localStorage.setItem("artigoSelecionadoId", id);
    window.location.href = "leituraArtigo.html";
}

function excluirArtigo(index) {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
        let artigos = JSON.parse(localStorage.getItem("artigos")) || [];
        artigos.splice(index, 1);
        localStorage.setItem("artigos", JSON.stringify(artigos));
        listarArtigos(); 
    }
}

function carregarArtigo() {
    const id = parseInt(localStorage.getItem("artigoSelecionadoId"), 10);
    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

    const artigo = artigos.find(a => a.id === id);

    if (!artigo) {
        alert("Artigo não encontrado.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("tituloArtigo").textContent = artigo.titulo;
    document.getElementById("temaArtigo").textContent = artigo.tema;
    document.getElementById("dataArtigo").textContent = artigo.data;
    document.getElementById("imagemArtigo").src = artigo.imagem || './Assets/img/placeholder.jpg';
    document.getElementById("imagemArtigo").alt = `Imagem do artigo ${artigo.titulo}`;
    document.getElementById("conteudoArtigo").textContent = artigo.conteudo;
}



window.addEventListener("DOMContentLoaded", listarArtigos);
function carregarComentarios() {
    const index = localStorage.getItem("artigoSelecionadoId");
    if (index === null) return;

    const comentariosKey = `comentarios_artigo_${index}`;
    const favoritosKey = "comentariosFavoritos";

    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
    const favoritos = JSON.parse(localStorage.getItem(favoritosKey)) || [];

    const listaComentarios = document.getElementById("listaComentarios");
    listaComentarios.innerHTML = "";

    if (comentarios.length === 0) {
        listaComentarios.innerHTML = "<p>Seja o primeiro a comentar!</p>";
        return;
    }

    comentarios.forEach((comentario, idx) => {
        // Verifica se o comentário está favoritado
        const isFavorito = favoritos.some(c =>
            c.texto === comentario.texto &&
            c.usuario === comentario.usuario &&
            c.data === comentario.data
        );

        const div = document.createElement("div");
        div.classList.add("comentario-item");

        div.innerHTML = `
            <div class="comentario-header">
                <img src="${comentario.foto}" alt="Foto do usuário" class="foto-usuario" />
                <span class="nome-usuario">${comentario.usuario}</span>
                <small class="data-comentario">${comentario.data}</small>
            </div>
            <p>${comentario.texto}</p>
            ${localStorage.getItem("medicoLogado") ? `<button onclick="favoritarComentario(${idx})">${isFavorito ? '💔 Desfavoritar' : '❤️ Favoritar'}</button>` : ""}
            ${(localStorage.getItem("usuarioLogado") || localStorage.getItem("medicoLogado")) ? `
                <div class="resposta-container">
                    <textarea id="resposta-${idx}" placeholder="Responder..."></textarea>
                    <button id="adicionarResposta-${idx}" onclick="adicionarResposta(${idx})">Responder</button>
                </div>
            ` : ""}
            <div id="respostas-${idx}" class="respostas-lista"></div>
        `;

        listaComentarios.appendChild(div);
        carregarRespostas(idx);
    });
}
async function adicionarResposta(comentarioIndex) {
    const artigoIndex = localStorage.getItem("artigoSelecionadoId");

    const emailUsuario = localStorage.getItem("usuarioLogado");
    const emailMedica = localStorage.getItem("medicoLogado");

    if (!emailUsuario && !emailMedica) {
        alert("Você precisa estar logado para responder comentários.");
        return;
    }

    const respostasKey = `respostas_comentario_${artigoIndex}_${comentarioIndex}`;
    const respostas = JSON.parse(localStorage.getItem(respostasKey)) || [];

    let nomeUsuario = null;
    let fotoUsuario = null;

    if (emailUsuario) {
        const dados = JSON.parse(localStorage.getItem(emailUsuario));
        nomeUsuario = dados?.userName;

        fotoUsuario = dados?.foto;
        if (!fotoUsuario) {
            try {
                const response = await fetch("https://api.unsplash.com/photos/random?query=profile&orientation=squarish&client_id=_SZZkpYuOy85daQyx7TZ8QHkSNaTLJCJvMEuCnypCKo");
                const data = await response.json();
                fotoUsuario = data.urls.small || "./Assets/img/user.png";
            } catch (error) {
                console.error("Erro ao buscar imagem do Unsplash:", error);
                fotoUsuario = "./Assets/img/user.png";
            }
        }
    } else if (emailMedica) {
        const dados = JSON.parse(localStorage.getItem(emailMedica));
        nomeUsuario = dados?.userName || "Médica";
        fotoUsuario = "https://anclivepa-sp.org.br/wp-content/uploads/2023/12/importancia-do-bem-estar-animal.webp";
    }

    const textarea = document.getElementById(`resposta-${comentarioIndex}`);
    const textoResposta = textarea.value.trim();
    if (!textoResposta) {
        alert("Digite uma resposta.");
        return;
    }

    const novaResposta = {
        usuario: nomeUsuario,
        foto: fotoUsuario,
        texto: textoResposta,
        data: new Date().toLocaleString()
    };

    respostas.push(novaResposta);
    localStorage.setItem(respostasKey, JSON.stringify(respostas));
    textarea.value = "";
    carregarRespostas(comentarioIndex);
}

function carregarRespostas(comentarioIndex) {
    const artigoIndex = localStorage.getItem("artigoSelecionadoId");
    const respostasKey = `respostas_comentario_${artigoIndex}_${comentarioIndex}`;
    const respostas = JSON.parse(localStorage.getItem(respostasKey)) || [];

    const container = document.getElementById(`respostas-${comentarioIndex}`);
    container.innerHTML = "";

    respostas.forEach(resposta => {
        const div = document.createElement("div");
        div.classList.add("resposta-item");

        div.innerHTML = `
            <div class="comentario-header">
                <img src="${resposta.foto}" alt="Foto do usuário" class="foto-usuario" />
                <span class="nome-usuario">${resposta.usuario}</span>
                <small class="data-comentario">${resposta.data}</small>
            </div>
            <p>${resposta.texto}</p>
        `;

        container.appendChild(div);
    });
}


function carregarFavoritos() {
    const container = document.getElementById("comunidadeFavoritos");
    const favoritos = JSON.parse(localStorage.getItem("comentariosFavoritos")) || [];

    if (favoritos.length === 0) {
        container.innerHTML = "<p>Nenhum comentário favoritado ainda.</p>";
        return;
    }

    container.innerHTML = ""; 

    favoritos.forEach((comentario, index) => {
        const div = document.createElement("div");
        div.classList.add("comentario-favorito");

        if (index === 2) {
            div.classList.add("reposicionar");
        }

        const textoLimitado = limitarTexto(comentario.texto, 200);

        div.innerHTML = `
            <p class="user-name"><strong>${comentario.usuario}</strong> comentou em <em>${comentario.artigoTitulo}</em></p>
            <p class="comentario">${textoLimitado}</p>
            <small class="data">${comentario.data}</small>
        `;

        container.appendChild(div);
    });
}
function desfavoritarComentario(index) {
    let favoritos = JSON.parse(localStorage.getItem("comentariosFavoritos")) || [];

    if (index >= 0 && index < favoritos.length) {
        favoritos.splice(index, 1);
        localStorage.setItem("comentariosFavoritos", JSON.stringify(favoritos));
        carregarFavoritos(); // Atualiza a lista após remoção
        alert("Comentário removido dos favoritos.");
    }
}

        window.addEventListener("DOMContentLoaded", carregarFavoritos);

        async function adicionarComentario() {
    const index = localStorage.getItem("artigoSelecionadoId");
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

        fotoUsuario = dados?.foto;
        if (!fotoUsuario) {
            try {
                const response = await fetch("https://api.unsplash.com/photos/random?query=profile&orientation=squarish&client_id=_SZZkpYuOy85daQyx7TZ8QHkSNaTLJCJvMEuCnypCKo");
                const data = await response.json();
                fotoUsuario = data.urls.small || "./Assets/img/user.png";
            } catch (error) {
                console.error("Erro ao buscar imagem da Unsplash:", error);
                fotoUsuario = "./Assets/img/user.png";
            }
        }

    } else if (emailMedica) {
        const dados = JSON.parse(localStorage.getItem(emailMedica));
        nomeUsuario = dados?.userName || "Médica";
        fotoUsuario = "https://anclivepa-sp.org.br/wp-content/uploads/2023/12/importancia-do-bem-estar-animal.webp";
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

    const selectTema = document.getElementById("tema");
    if (selectTema) {
        selectTema.selectedIndex = 0; 
    }
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

function escapeHTML(str) {
    if (typeof str !== "string") return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function limitarTexto(texto, limite) {
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
}

function listarTodosComentarios() {
    const container = document.getElementById("comunidadeComentarios");
    container.innerHTML = "";

    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

    if (!Array.isArray(artigos) || artigos.length === 0) {
        container.innerHTML = "<p>Nenhum artigo encontrado.</p>";
        return;
    }

    let comentariosEncontrados = false;

    artigos.forEach(artigo => {
        const comentariosKey = `comentarios_artigo_${artigo.id}`; 
        const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];

        comentarios.forEach(comentario => {
            if (!comentario || !comentario.texto) return; 

            comentariosEncontrados = true;
            const div = document.createElement("div");
            div.classList.add("card-comentario");

            const usuario = escapeHTML(comentario.usuario || "Anônimo");
            const texto = limitarTexto(escapeHTML(comentario.texto), 200);
            const data = escapeHTML(comentario.data || "");
            const titulo = escapeHTML(artigo.titulo || "Sem título");

            div.innerHTML = `
                <p class="user-name"><strong>${usuario}</strong></p>
                <p><strong>Comentou no artigo:</strong> "${titulo}"</p>
                <p>${texto}</p>
                <p class="data-comentario"><small>${data}</small></p>
            `;

            container.appendChild(div);
        });
    });

    if (!comentariosEncontrados) {
        container.innerHTML = "<p>Nenhum comentário feito ainda.</p>";
    }
}

function redirecionarParaArtigos() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const medicoLogado = localStorage.getItem("medicoLogado");

    if (usuarioLogado) {
        window.location.href = "artigosUser.html";
    } else if (medicoLogado) {
        window.location.href = "artigosMedica.html";
    } else {
        window.location.href = "artigos.html";
    }
}


window.addEventListener("DOMContentLoaded", listarTodosComentarios);
function novoArtigo() {
    window.location.href = "novoArtigo.html"; 
}
