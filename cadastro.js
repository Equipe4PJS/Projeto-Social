const form = document.getElementById("cadastroForm");
const mensagemElemento = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Criamos o FormData a partir do formulário
  const formData = new FormData(form);

  // DICA DE OURO: Verifique se o seu HTML tem o atributo 'name' em cada campo.
  // Se não tiver certeza, podemos forçar a inclusão manual assim:
  formData.append("nome", document.getElementById("nome").value);
  formData.append("senha", document.getElementById("senha").value);
  formData.append("funcao_social", document.getElementById("funcao_social").value);
  
  // O campo de foto geralmente já funciona via 'new FormData(form)' 
  // se o <input type="file"> tiver name="foto"

  try {
    mensagemElemento.innerText = "Processando...";

    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      body: formData // Não use JSON.stringify e não defina headers manuais
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      mensagemElemento.style.color = "#2ec4b6"; // Cor secundária do seu site
      mensagemElemento.innerText = "Usuário cadastrado com sucesso! Redirecionando...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      mensagemElemento.style.color = "red";
      mensagemElemento.innerText = dados.erro || "Erro no cadastro";
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    mensagemElemento.style.color = "red";
    mensagemElemento.innerText = "Erro ao conectar com o servidor. Verifique se o Node está rodando.";
  }
});