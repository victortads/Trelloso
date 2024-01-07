import cadastro from "./cadastro.js";
import readUser from "./main.js";

// Verifica o token do usuário com as informações preenchidas do login
async function verifyToken(data) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/auth/token", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    console.log("Success: ", result);

    if (result.access_token) {
      localStorage.setItem("token", result.access_token);
      alert("Token adicionado ao LS!");
      readUser(result.access_token);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const login = {
  divLogin: document.getElementById("div_login"),
  formLogin: document.getElementById("form-login"),
  inputSenha: document.getElementById('input-passsword_login'),
  inputName: document.getElementById('input-user_login'),
  // Envia os dados do login para o backend
  function: document.getElementById("form-login").addEventListener("submit", (event) => {
      event.preventDefault();

      let login = document.getElementById("form-login");
      let formdata = new FormData(login);
      verifyToken(formdata);
    }),
  // Transfere para a página de cadastro se o usuário não tem login
  function: document
    .querySelector("#btn-noLogin")
    .addEventListener("click", () => {
      login.divLogin.classList.remove("displayOn");
      login.divLogin.classList.add("displayNone");
      cadastro.divCadastro.classList.remove("displayNone");
      cadastro.divCadastro.classList.add("displayOn");
    }),
};

export default login;