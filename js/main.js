import cadastro from "./cadastro.js";
import login from "./login.js";

let verify = localStorage.getItem("token");
let nav = document.querySelector("#nav");
let content = document.querySelector("#content");
let views = Array.from(document.getElementsByClassName("view"));

// Adiciona a função de remover o token do local storage para que o usuário seja deslogado
document.querySelector("#btn-rmtoken").addEventListener("click", () => {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
    getToken();
    alert("Token apagado!");
    document.querySelector("#welcome-user").innerHTML = "";
    document.getElementById("image-user").classList.remove("displayOn");
    document.getElementById("image-user").classList.add("displayNone");
  }
});

// Irá buscar o token no local storage para verificar se o usuário está logado
function getToken() {
  if (!verify) {
    alert("Usuário não logado");
    login.divLogin.classList.remove("displayNone");
    login.divLogin.classList.add("displayOn");
    nav.classList.remove("displayOn");
    nav.classList.add("displayNone");
    content.classList.remove("displayOn");
    content.classList.add("displayNone");
  }
}

getToken();

// Faz requisição do usuário logado para recuperar seu nome e adicionar no header da página
async function readUser(token) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${token}`,
      },
    });

    const result = await response.json();
    console.log("Success:", result.avatar_url);
    if (result.name) {
      let div = document.createElement("div");
      let p = document.createElement("p");
      let textEl = document.createTextNode("Bem vindo, " + result.name);
      p.appendChild(textEl);
      div.appendChild(p);
      div.id = "welcome-user";

      document.getElementById("image-user").classList.remove("displayNone");
      document.getElementById("image-user").classList.add("displayOn");
      document.getElementById("image-user").src = result.avatar_url;
      document.querySelector("#div-user").appendChild(div);

      if (login.divLogin.classList.contains("displayOn")) {
        login.divLogin.classList.remove("displayOn");
        login.divLogin.classList.add("displayNone");
        if (
          nav.classList.contains("displayNone") &&
          content.classList.contains("displayNone")
        ) {
          nav.classList.remove("displayNone");
          nav.classList.add("displayOn");
          content.classList.remove("displayNone");
          content.classList.add("displayOn");
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

readUser(localStorage.getItem("token"));

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

export default readUser;
