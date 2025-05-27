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


 window.addEventListener("DOMContentLoaded", () => {
        listarArtigos();
    });

    