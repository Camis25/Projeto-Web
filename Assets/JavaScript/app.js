const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

const mensagens = [
        "A força de uma mulher reside na capacidade de enfrentar desafios com coragem e determinação.",
        "Mulher forte é aquela que encontra força na dor e coragem nas adversidades.",
        "Empodere-se e não permita que ninguém defina seus limites, você é capaz de tudo!",
        "Acredite no seu potencial, pois você possui dentro de si todas as ferramentas para vencer.",
        "Seja a protagonista da sua própria história e escreva um enredo de sucesso e superação.",
        "Você é mais forte do que imagina.",
        "A autoconfiança é a armadura que toda mulher forte carrega consigo.",
        "Não tema o fracasso, ele é apenas uma oportunidade de aprender e crescer.",
        "A verdadeira beleza de uma mulher está na sua determinação em ser autêntica."
];

app.get('/mensagens', (req, res) => {
    const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    res.json({mensagem:mensagemAleatoria})
});

app.listen(3000, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);

});