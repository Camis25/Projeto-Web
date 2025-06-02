# 🌸 Blog Saúde Feminina

Este projeto é um sistema web simulado de um blog voltado ao bem-estar da mulher em todas as fases da vida, com foco em conteúdos sobre saúde menstrual, menopausa, nutrição, bem-estar emocional, entre outros. Também possui uma área de comunidade para interação entre usuárias e com a médica Dra. Ana.
Ele foi desenvolvido como parte de um trabalho acadêmico para o curso de Análise e Desenvolvimento de Sistema do Centro Universitário Senac, no ano de 2025.


## 🧩 Funcionalidades

### 👩‍⚕️ Visitantes (não logados)
- Visualizam artigos e posts da comunidade.

### 👩 Usuários logados
- Acessam perfil.
- Criam novos posts na comunidade.
- Comentam e respondem em artigos.
- Cadastro proibido para menores de 10 anos.

### 🩺 Médicos logados
- Acessam área de perfil.
- Visualizam e gerenciam artigos próprios.
- Editam e excluem artigos escritos.
- Publicam posts na comunidade.
- Favoritam ou desfavoritam comentários nos artigos.

---

## 🖥️ Páginas e Estrutura

### 🏠 Home
- Navegação com logo, artigos, comunidade, campo de pesquisa, entrar e cadastrar.
- Se logado, "entrar" e "cadastrar" viram ícone de perfil.
- Banner com imagem e frase impactante.
- Destaque para 3 artigos com navegação por setas.
- Destaque para 2 posts da comunidade com navegação por setas.
- Footer com navegação, logo e política de privacidade.

### 📄 Página de Artigos
- Cabeçalho igual à home.
- Imagem de fundo com título “Artigos”.
- Filtro por tema.
- Layout: 3 artigos por linha.

### 💬 Página da Comunidade
- Cabeçalho igual à home.
- Imagem de fundo com título “Comunidade”.
- Layout: 2 posts por linha.
- Paginação.
- Se logado: “Entrar” vira “Calculadora” e botão “Cadastrar” desaparece.

### 🔐 Página de Login (Usuário)
- Campos obrigatórios: email e senha.
- Link para recuperar senha (com chave secreta).
- Link para cadastro.
- Link para login como médica.

### 🔐 Login como Médica
- Email: `DrAnaSilva@gmail.com`
- Senha: `admin@123`

### 🔁 Recuperar Senha
#### Para usuários:
- Campos: email, chave cadastrada, nova senha.
#### Para médicas:
- Chave obrigatória: `pr0fi$$i0n@l`

### 📝 Cadastro
- Campos: nome de usuário, data de nascimento, email, senha, confirmar senha.
- Cadastro bloqueado para menores de 10 anos.

### 👤 Tela Principal
- **Usuário**: perfil, artigos, comunidade, calculadora.
- **Médica**: perfil, *meus artigos*, comunidade.

### ⚙️ Editar Perfil
- Campos: nome, email, senha, data de nascimento.
- Apenas o nome de usuário pode ser editado.
- Botão para salvar.

### 🧵 Fazer Post
- Área de comentário ao final de cada artigo.

### ✍️ Escrever Artigo
- Campos: título, tema, imagem, conteúdo.

### 📚 Meus Artigos (Médica)
- Lista de artigos escritos.
- Botões: editar e excluir.
- Botão para voltar à página principal.

---

## 🗃️ Armazenamento

### 🔒 LocalStorage
- Posts criados.
- Logins de usuários.

---

## 🔌 Integrações

- API de frases motivacionais e curiosidades.

---

## 🚧 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage
- API pública (motivacional/curiosidades)


---

## 💡 Observações

- Interface adaptável para diferentes tipos de usuários.
- Foco em acessibilidade e navegação intuitiva.
- Componentes reutilizáveis para comentários, posts e artigos.

---

## 👩‍💻 Autoria

Projeto desenvolvido por Camile Vitória Rosa para a disciplina de Programação Web, com apoio da colega Jaine Costa.
Centro Universitário Senac – 2025
