function loginUsuario(){
    var textoEmail = document.getElementById('txtEmail').value;
    var textoSenha = document.getElementById('txtSenha').value;

    if(textoEmail == "Camile" && textoSenha == "1234"){
        window.location.href = 'teste.html';
    }else{
        alert("Usuário ou senha incorretos");
    }

}

