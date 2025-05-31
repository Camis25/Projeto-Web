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
                    <button class="btn-card" onclick="abrirArtigo(${index})">Leia mais</button>
                    <button class="btn-edit" onclick="editarArtigo(${index})">Editar</button>
                    <button  class="btn-excluir" onclick="excluirArtigo(${index})">Excluir</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function editarArtigo(index) {
    localStorage.setItem("artigoParaEditar", index);
    window.location.href = "editarArtigo.html";
}


function carregarArtigoParaEdicao() {
    const index = localStorage.getItem("artigoParaEditar");
    

    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];
    const artigo = artigos[index];

  

    document.getElementById("tituloArtigo").value = artigo.titulo || "";
    document.getElementById("artigo").value = artigo.conteudo || "";
    document.getElementById("tema").value = artigo.tema || "";

    if (artigo.imagem) {
        const preview = document.getElementById("previewImagem");
        if (preview) {
            preview.src = artigo.imagem;
            preview.style.display = "block"; 
        }
    }
}

function salvarEdicaoArtigo(event) {
    event.preventDefault();

    const index = localStorage.getItem("artigoParaEditar");
    const artigos = JSON.parse(localStorage.getItem("artigos")) || [];

    if (index === null || !artigos[index]) {
        alert("Artigo não encontrado.");
        return;
    }

    const titulo = document.getElementById("tituloArtigo").value.trim();
    const conteudo = document.getElementById("artigo").value.trim();
    const tema = document.getElementById("tema").value;
    const inputImagem = document.getElementById("imagemArtigoFile");
    const file = inputImagem.files[0];

    const atualizarDados = (novaImagem = null) => {
        artigos[index].titulo = titulo;
        artigos[index].conteudo = conteudo;
        artigos[index].tema = tema;
        if (novaImagem !== null) {
            artigos[index].imagem = novaImagem;
        }

        localStorage.setItem("artigos", JSON.stringify(artigos));
        alert("Artigo editado com sucesso!");
        window.location.href = "artigosMedica.html";
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imagemBase64 = event.target.result;
            atualizarDados(imagemBase64);
        };
        reader.readAsDataURL(file);
    } else {
        atualizarDados();
    }
}


window.addEventListener("DOMContentLoaded", function() {
    carregarArtigoParaEdicao();

    const form = document.getElementById("formEditarArtigo");
    if (form) {
        form.addEventListener("submit", salvarEdicaoArtigo);
    }

    document.getElementById("imagemArtigoFile").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const preview = document.getElementById("previewImagem");
            preview.src = event.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

});



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
    document.getElementById("temaArtigo").textContent = artigo.tema;
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

    comentarios.forEach((comentario, idx) => {
        const div = document.createElement("div");
        div.classList.add("comentario-item");

        div.innerHTML = `
            <div class="comentario-header">
                <img src="${comentario.foto}" alt="Foto do usuário" class="foto-usuario" />
                <span class="nome-usuario">${comentario.usuario}</span>
                <small class="data-comentario">${comentario.data}</small>
            </div>
            <p>${comentario.texto}</p>
            ${localStorage.getItem("medicoLogado") ? `<button onclick="favoritarComentario(${idx})">❤️ Favoritar</button>` : ""}
            ${(localStorage.getItem("usuarioLogado") || localStorage.getItem("medicoLogado")) ? `
                <div class="resposta-container">
                    <textarea id="resposta-${idx}" placeholder="Responder..."></textarea>
                    <button id="adicionarResposta" onclick="adicionarResposta(${idx})">Responder</button>
                </div>
            ` : ""}
            <div id="respostas-${idx}" class="respostas-lista"></div>
        `;

        listaComentarios.appendChild(div);
        carregarRespostas(idx);
    });
}
function adicionarResposta(comentarioIndex) {
    const artigoIndex = localStorage.getItem("artigoSelecionado");

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
        fotoUsuario = dados?.foto || "./Assets/img/user.png";
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
    const artigoIndex = localStorage.getItem("artigoSelecionado");
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

function favoritarComentario(comentarioIndex) {
    const artigoIndex = localStorage.getItem("artigoSelecionado");
    const comentariosKey = `comentarios_artigo_${artigoIndex}`;
    const favoritosKey = "comentariosFavoritos";

    const comentarios = JSON.parse(localStorage.getItem(comentariosKey)) || [];
    const favoritos = JSON.parse(localStorage.getItem(favoritosKey)) || [];

    const comentario = comentarios[comentarioIndex];

    const jaExiste = favoritos.some(c =>
        c.texto === comentario.texto &&
        c.usuario === comentario.usuario &&
        c.data === comentario.data
    );

    if (!jaExiste) {
        favoritos.push({
            ...comentario,
            artigoTitulo: JSON.parse(localStorage.getItem("artigos"))[artigoIndex].titulo
        });
        localStorage.setItem(favoritosKey, JSON.stringify(favoritos));
        alert("Comentário favoritado com sucesso!");
    } else {
        alert("Este comentário já foi favoritado.");
    }
}

function carregarFavoritos() {
            const container = document.getElementById("comunidadeFavoritos");
            const favoritos = JSON.parse(localStorage.getItem("comentariosFavoritos")) || [];

            if (favoritos.length === 0) {
                container.innerHTML = "<p>Nenhum comentário favoritado ainda.</p>";
                return;
            }

           favoritos.forEach((comentario, index) => {
    const div = document.createElement("div");
    div.classList.add("comentario-favorito");

    if (index === 2) {
        div.classList.add("reposicionar");
    }

    div.innerHTML = `
        <p class="user-name"><strong>${comentario.usuario}</strong> comentou em <em>${comentario.artigoTitulo}</em></p>
        <p  class="comentario">${comentario.texto}</p>
        <small class="data">${comentario.data}</small>
    `;

    container.appendChild(div);
});

        }

        window.addEventListener("DOMContentLoaded", carregarFavoritos);
async function adicionarComentario() {
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