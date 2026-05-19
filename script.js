document.addEventListener("DOMContentLoaded", () => {
  protegerRota();
  carregarUsuario();
  configurarMenuPerfil();
  configurarFiltroJogos(); // Inicializa o filtro de jogos se estiver na página de jogos
});

/* ================= PROTEÇÃO DE ROTA ================= */
function protegerRota() {
  const usuario = localStorage.getItem("usuarioLogado");

  if (!usuario) {
    window.location.replace("login.html");
  }
}

/* ================= CARREGAR USUÁRIO ================= */
function carregarUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  const nome = document.getElementById("nomeUsuario");
  const funcao = document.getElementById("funcaoUsuario");
  const foto = document.getElementById("fotoPerfil");

  if (nome) nome.textContent = usuario.nome;
  if (funcao) funcao.textContent = usuario.funcao_social;

  if (foto && usuario.foto_perfil) {
    foto.src = "http://localhost:3000/uploads/" + usuario.foto_perfil;
  }
}

/* ================= MENU ANIMADO ================= */
function configurarMenuPerfil() {
  const perfil = document.getElementById("perfilContainer");
  const menu = document.getElementById("perfilMenu");

  if (!perfil || !menu) return;

  perfil.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    menu.classList.remove("active");
  });
}

/* ================= FILTRO E BUSCA DE JOGOS ================= */
function configurarFiltroJogos() {
  const botoesFiltro = document.querySelectorAll(".tag-btn");
  const barraPesquisa = document.getElementById("searchGame");
  const cardsJogos = document.querySelectorAll(".cards-grid .card");

  // Se os elementos não existirem na página atual (ex: no index), para a execução silenciosamente
  if (cardsJogos.length === 0) return;

  function filtrarJogos() {
    const termoPesquisa = barraPesquisa ? barraPesquisa.value.toLowerCase() : "";
    
    // Pega o botão ativo atual
    const botaoAtivo = document.querySelector(".tag-btn.active");
    if (!botaoAtivo) return;

    // Extrai o nome da categoria do atributo onclick (ex: 'matematica' de filtrarCategoria('matematica'))
    const match = botaoAtivo.getAttribute("onclick").match(/'([^']+)'/);
    const categoriaAtiva = match ? match[1] : "todos";

    cardsJogos.forEach(card => {
      const tituloJogo = card.querySelector("h3").textContent.toLowerCase();
      const rawCategorias = card.getAttribute("data-categoria");
      const categoriasDoCard = rawCategorias ? rawCategorias.split(" ") : [];

      const bateComPesquisa = tituloJogo.includes(termoPesquisa);
      const bateComCategoria = (categoriaAtiva === "todos" || categoriasDoCard.includes(categoriaAtiva));

      if (bateComPesquisa && bateComCategoria) {
        card.style.display = "flex";
        card.style.animation = "fadeIn 0.4s ease forwards";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Configura o evento de clique para os botões de categoria
  botoesFiltro.forEach(botao => {
    botao.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".tag-btn.active")?.classList.remove("active");
      botao.classList.add("active");
      filtrarJogos();
    });
  });

  // Configura o evento de digitação na barra de busca
  if (barraPesquisa) {
    barraPesquisa.addEventListener("input", filtrarJogos);
  }
}

/* ================= AÇÕES ================= */
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("login.html");
}

function irParaPerfil() {
  alert("Página de perfil em breve 🚀");
}