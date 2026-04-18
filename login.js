const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const senha = document.getElementById("senha").value;

      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
  // salvar usuário no navegador
  localStorage.setItem("usuario", JSON.stringify(dados.usuario));

  // redirecionar para a página principal
  window.location.href = "index.html";
} else {
  document.getElementById("mensagem").innerText =
    dados.erro;
}
    });

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.querySelector("#nome").value;
  const senha = document.querySelector("#senha").value;

  const resposta = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, senha })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    alert(dados.erro);
    return;
  }

  //  SALVA USUÁRIO NO NAVEGADOR
  localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

  // Redireciona
  window.location.href = "index.html";
});