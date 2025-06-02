
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
