
function salvarArtigo() {
    const titulo = document.getElementById("tituloArtigo").value.trim();
    const conteudo = document.getElementById("artigo").value.trim();
    const tema = document.getElementById("tema").value;
    const inputImagem = document.getElementById("imagemArtigoFile");

    if (!titulo || !conteudo || !tema || !inputImagem.files.length) {
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
        salvarNoStorage(titulo, conteudo, "", tema);

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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formArtigo");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); 
      salvarArtigo();     
    });
  }
});
