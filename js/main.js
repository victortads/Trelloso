import cadastro from "./cadastro.js";
import login from "./login.js";
import user from "./atualizar.js";
import getToken from "./token.js";
import addBoards from "./quadros.js";

let verify = getToken();
let nav = document.querySelector("#nav");
let content = document.querySelector("#content");
let views = Array.from(document.getElementsByClassName("view"));
let divAtualizar = document.getElementById("atualizar-cadastro");
let btnToHome = document.getElementById("atualizar-home");
let btnFecharForm = document.querySelectorAll(".fecharForm");

// Adiciona a função de remover o token do local storage para que o usuário seja deslogado
document.querySelector("#btn-rmtoken").addEventListener("click", () => {
  if (getToken()) {
    localStorage.removeItem("token");
    getToken();
    alert("Token apagado!");
    // Fechamento de elementos ao deslogar
    document.getElementById("image-user").classList.remove("displayOn");
    document.getElementById("image-user").classList.add("displayNone");
    document.getElementById("btn-rmtoken").classList.remove("displayOn");
    document.getElementById("btn-rmtoken").classList.add("displayNone");
    document.getElementById("user-show").classList.remove("displayOn");
    document.getElementById("user-show").classList.add("displayNone");
    document.getElementById("nav").classList.remove("displayOn");
    document.getElementById("nav").classList.add("displayNone");
    document.getElementById("user-show").innerText = "";
    content.classList.remove("displayOn");
    content.classList.add("displayNone");
    // Reset dos campos de login
    login.inputSenha.value = '';
    login.inputName.value = '';
    login.divLogin.classList.remove("displayNone");
    login.divLogin.classList.add("displayOn");
    content.classList.remove("displayOn");
    content.classList.add("displayNone");
    // Reset dos boards
    document.getElementById("boards-content").innerHTML = "";


    if (document.getElementById("atualizar-cadastro").classList.contains("displayOn")) {
      document.getElementById("atualizar-cadastro").classList.remove("displayOn");
      document.getElementById("atualizar-cadastro").classList.add("displayNone");
    }
    if (document.getElementById("div-adicionar-lista").classList.contains("displayOn")) {
      document.getElementById("div-adicionar-lista").classList.remove("displayOn");
      document.getElementById("div-adicionar-lista").classList.add("displayNone");
    }

    if (document.getElementById("div-adicionar-card").classList.contains("displayOn")) {
      document.querySelector("#div-adicionar-card").classList.remove("displayOn");
      document.querySelector("#div-adicionar-card").classList.add("displayNone");
    }
  }
});

// Irá buscar o token no local storage para verificar se o usuário está logado
async function verificarToken() {
  if (!verify) {
    login.divLogin.classList.remove("displayNone");
    login.divLogin.classList.add("displayOn");
    nav.classList.remove("displayOn");
    nav.classList.add("displayNone");
    content.classList.remove("displayOn");
    content.classList.add("displayNone");
    if (divAtualizar.classList.contains("displayOn")) {
      divAtualizar.classList.remove("displayOn");
      divAtualizar.classList.add("displayNone");
    }
    login.inputSenha.value = '';
    login.inputName.value = '';
  }
}

verificarToken();

async function showMe(token) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${token}`,
      },
    });

    const result = await response.json();
    // console.log("Usuário: ", await result)
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteUser(token, user_id) {
  try {
    const response = await fetch(`http://localhost:8087/api/v1/users/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${token}`,
      },
    });

    console.log(response)
  } catch (error) {
    console.error("Erro:", error);
  }
}
// Faz requisição do usuário logado para recuperar seu nome e adicionar no header da página
async function readUser() {
  const result = await showMe(getToken());
  if (result.name) {
    let textEl = document.createTextNode(result.name);
    document.getElementById("user-show").appendChild(textEl);

    document.getElementById("image-user").classList.remove("displayNone");
    document.getElementById("image-user").classList.add("displayOn");
    document.getElementById("image-user").src = result.avatar_url;
    document.getElementById("btn-rmtoken").classList.remove("displayNone");
    document.getElementById("btn-rmtoken").classList.add("displayOn");
    document.getElementById("user-show").classList.remove("displayNone");
    document.getElementById("user-show").classList.add("displayOn");
    document.getElementById("boards-content").classList.remove("displayNone");
    document.getElementById("boards-content").classList.add("displayFlex");
    document.getElementById("content").classList.remove("displayNone");
    document.getElementById("content").classList.add("displayOn");
    document.getElementById("nav").classList.remove("displayNone");
    document.getElementById("nav").classList.add("displayOn");

    addBoards();

    if (login.divLogin.classList.contains("displayOn")) {
      login.divLogin.classList.remove("displayOn");
      login.divLogin.classList.add("displayNone");
      if (nav.classList.contains("displayNone") && content.classList.contains("displayNone")) {
        nav.classList.remove("displayNone");
        nav.classList.add("displayOn");
        content.classList.remove("displayNone");
        content.classList.add("displayOn");
      }
    }
  }
}

readUser();

// Adiciona a função de visualizar senha
views.forEach((view) => {
  view.addEventListener("click", () => {
    if (cadastro.inputSenha.type === "password") {
      cadastro.inputSenha.type = "text";
    } else {
      cadastro.inputSenha.type = "password";
    }

    if (login.inputSenha.type === "password") {
      login.inputSenha.type = "text";
    } else {
      login.inputSenha.type = "password";
    }
  });
});

// Função de apagar usuário
document.getElementById("apagarUsuario").addEventListener("click", async () => {
  let me = await showMe(getToken());
  console.log("Funcionando, ", me.id)
  await deleteUser(getToken(), me.id);
  localStorage.removeItem("token");
  verify = getToken();
  await verificarToken();
})

// Sai do atualizar para home
btnToHome.addEventListener("click", () => {
  nav.classList.remove("displayNone");
  nav.classList.add("displayOn");
  content.classList.remove("displayNone");
  content.classList.add("displayOn");
  divAtualizar.classList.remove("displayOn");
  divAtualizar.classList.add("displayNone");
})

// Adiciona event listener para sair dos forms
btnFecharForm.forEach((button)=>{
  button.addEventListener("click", (event)=>{
    const div = event.target.parentNode.parentNode.parentNode;
    div.classList.remove("displayOn");
    div.classList.add("displayNone");
  })
})

export default readUser;