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
        carregarFavoritos(); 
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
