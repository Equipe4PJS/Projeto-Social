document.addEventListener("DOMContentLoaded", () => {
  protegerRota();
  carregarUsuario();
  configurarMenuPerfil();
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

/* ================= AÇÕES ================= */
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.replace("login.html");
}

function irParaPerfil() {
  alert("Página de perfil em breve 🚀");
}