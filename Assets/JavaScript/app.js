const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

const mensagens = [
        "Hidrate-se bem durante o dia para manter a pele saudável.",
        "Reserve 10 minutos do seu dia para meditar e relaxar.",
        "Faça caminhadas leves durante a manhã para um bom início de dia.",
        "Beba pelo menos 2 litros de água por dia.",
        "Durante a TPM, pratique atividades leves como caminhada ou yoga.",
        "Você é mais forte do que imagina."
];

app.get('/mensagens', (req, res) => {
    const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    res.json({mensagem:mensagemAleatoria})
});

app.listen(3000, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);

});