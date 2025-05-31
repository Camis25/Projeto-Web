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

        const comentariosDoUsuario = comentarios.filter(comentario => comentario.usuario === nomeUsuarioLogado);

        comentariosDoUsuario.forEach(comentario => {
            encontrouComentarios = true;

            const div = document.createElement("div");
            div.classList.add("comentario-usuario");

            div.innerHTML = `
                <p><strong>Comentário no artigo:</strong> "${artigo.titulo}"</p>
                <p>${comentario.texto}</p>
                <p class="data-comentario"><small>${comentario.data}</small></p>
                <hr/>
            `;

            container.appendChild(div);
        });
    });

    if (!encontrouComentarios) {
        container.innerHTML = "<p>Você ainda não fez comentários.</p>";
    }
}
window.addEventListener("DOMContentLoaded", () => {
    listarComentariosUsuarioLogado();
});