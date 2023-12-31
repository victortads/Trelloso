import login from "./login.js";

// Envia os dados do cadastro para serem salvos no backend
async function postJSON(data) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

const cadastro = {
  divCadastro: document.getElementById("div_cadastro"),
  formCadastro: document.getElementById("form-cadastro"),
  inputNome: document.getElementById("input-nome"),
  inputUsername: document.getElementById("input-username"),
  inputSenha: document.getElementById("input-senha"),
  // Trata com os eventos de submissão do formulário de cadastro
  function: document
    .getElementById("form-cadastro")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      let dados = {
        name: document.getElementById("input-nome").value,
        username: document.getElementById("input-username").value,
        password: document.getElementById("input-senha").value,
      };

      postJSON(dados);
    }),
  // Transfere para o formulário de login quando o usuário já possui cadastro
  function: document
    .querySelector("#btn-withLogin")
    .addEventListener("click", () => {
      login.divLogin.classList.remove("displayNone");
      login.divLogin.classList.add("displayOn");
      document.querySelector("#div_cadastro").classList.remove("displayOn");
      document.querySelector("#div_cadastro").classList.add("displayNone");
    }),
};

export default cadastro;
