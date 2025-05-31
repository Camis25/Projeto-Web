function criarUsuarioFixo() {
    const emailFixo = "anaClara@bemestar.com";

    const usuaria = {
        userName: "Dra. Ana Clara",
        nasc: "1980-05-10",
        email: emailFixo,
        senha: "admin@123",
        chave: "pr0fi$$i0n@l",
        crm: "CRM/SP 123456",
        imagem: "https://anclivepa-sp.org.br/wp-content/uploads/2023/12/importancia-do-bem-estar-animal.webp"
    };

    if (!localStorage.getItem(emailFixo)) {
        localStorage.setItem(emailFixo, JSON.stringify(usuaria));
    }
}

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

    if (medica.imagem) {
        document.getElementById("fotoPerfil").src = medica.imagem;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    criarUsuarioFixo();

    const form = document.getElementById("formArtigo");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            salvarArtigo();
        });
    }

    const paginaPerfil = document.getElementById("nomeMedica");
    if (paginaPerfil) {
        carregarDadosMedica();
    }
});
