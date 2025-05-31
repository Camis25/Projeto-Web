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
    document.getElementById("temaArtigo").textContent = artigo.tema;
    document.getElementById("dataArtigo").textContent = artigo.data;
    document.getElementById("imagemArtigo").src = artigo.imagem || './Assets/img/placeholder.jpg';
    document.getElementById("imagemArtigo").alt = `Imagem do artigo ${artigo.titulo}`;
    document.getElementById("conteudoArtigo").textContent = artigo.conteudo;
}

function excluirArtigo(index) {
    if (confirm("Tem certeza que deseja excluir este artigo?")) {
        let artigos = JSON.parse(localStorage.getItem("artigos")) || [];
        artigos.splice(index, 2);
        localStorage.setItem("artigos", JSON.stringify(artigos));
        listarArtigos();
    }
}

window.addEventListener("DOMContentLoaded", listarArtigos);

function carregarComentarios() {
    const index = localStorage.getItem("artigoSelecionado");
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
        const div = document.createElement("div");
        div.classList.add("comentario-item");

        const estaFavorito = favoritos.some(c =>
            c.texto === comentario.texto &&
            c.usuario === comentario.usuario &&
            c.data === comentario.data
        );

        div.innerHTML = `
            <div class="comentario-header">
                <img src="${comentario.foto}" alt="Foto do usuário" class="foto-usuario" />
                <span class="nome-usuario">${comentario.usuario}</span>
                <small class="data-comentario">${comentario.data}</small>
            </div>
            <p>${comentario.texto}</p>
            ${localStorage.getItem("medicoLogado") ? `<button onclick="comentarioFavorito(${idx})">${estaFavorito ? "Desfavoritar" : "Favoritar"}</button>` : ""}
        `;

        listaComentarios.appendChild(div);
    });
}

function comentarioFavorito(comentarioIndex) {
    const artigoIndex = localStorage.getItem("artigoSelecionado");
    const comentariosKey = `comentarios_artigo_${artigoIndex}`;
    const favoritosKey = "comentariosFavoritos";

    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
    let favoritos = JSON.parse(localStorage.getItem(favoritosKey)) || [];

    const comentario = comentarios[comentarioIndex];

    // Verifica se já está favoritado
    const pos = favoritos.findIndex(c =>
        c.texto === comentario.texto &&
        c.usuario === comentario.usuario &&
        c.data === comentario.data
    );

    if (pos === -1) {
        // Adiciona aos favoritos
        favoritos.push({
            ...comentario,
            artigoTitulo: JSON.parse(localStorage.getItem("artigos"))[artigoIndex].titulo
        });
        localStorage.setItem(favoritosKey, JSON.stringify(favoritos));
        alert("Comentário favoritado com sucesso!");
    } else {
        // Remove dos favoritos (desfavoritar)
        favoritos.splice(pos, 1);
        localStorage.setItem(favoritosKey, JSON.stringify(favoritos));
        alert("Comentário desfavoritado com sucesso!");
    }

    // Atualiza a lista para refletir o novo estado do botão
    carregarComentarios();
}

function carregarFavoritos() {
    const container = document.getElementById("comunidadeFavoritos");
    const favoritos = JSON.parse(localStorage.getItem("comentariosFavoritos")) || [];

    container.innerHTML = "";

    if (favoritos.length === 0) {
        container.innerHTML = "<p>Nenhum comentário favoritado ainda.</p>";
        return;
    }

    favoritos.forEach(comentario => {
        const div = document.createElement("div");
        div.classList.add("comentario-favorito");

        div.innerHTML = `
            <p><strong>${comentario.usuario}</strong> comentou em <em>${comentario.artigoTitulo}</em></p>
            <p>${comentario.texto}</p>
            <small>${comentario.data}</small>
            <hr>
        `;

        container.appendChild(div);
    });
}

window.addEventListener("DOMContentLoaded", carregarFavoritos);

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
