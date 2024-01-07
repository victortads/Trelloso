import getToken from "./token.js";

let user = document.getElementById("user-show");
let divAtualizar = document.getElementById("atualizar-cadastro");
let inputNomeAtualizar = document.getElementById("input-atualizar-nome");
let inputUsernameAtualizar = document.getElementById("input-atualizar-username");
let inputURLAtualizar = document.getElementById("input-atualizar-url");
let inputSenhaAtualizar = document.getElementById("input-atualizar-senha");
let formAtualizar = document.getElementById("form-atualizar");

user.addEventListener("click", () => {
  if (divAtualizar.classList.contains("displayNone")) {
    getDataUser(getToken());
    nav.classList.remove("displayOn");
    nav.classList.add("displayNone");
    content.classList.remove("displayOn");
    content.classList.add("displayNone");
    divAtualizar.classList.remove("displayNone");
    divAtualizar.classList.add("displayOn");
  } else {
    divAtualizar.classList.remove("displayOn");
    divAtualizar.classList.add("displayNone");
    nav.classList.remove("displayNone");
    nav.classList.add("displayOn");
    content.classList.remove("displayNone");
    content.classList.add("displayOn");
  }
});

// form de atualizar os dados
formAtualizar.addEventListener("submit", async (event) => {
  event.preventDefault();

  let dadosMod = {
    name: inputNomeAtualizar.value,
    username: inputUsernameAtualizar.value,
    avatar_url: inputURLAtualizar.value,
    password: inputSenhaAtualizar.value,
  };
  let id = await getId(getToken());
  atualizarUser(dadosMod, id, getToken());
});

// Pega id do usuário
async function getId(token) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${token}`,
      },
    });
    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getDataUser(token) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${token}`,
      },
    });
    const result = await response.json();
    inputNomeAtualizar.value = result.name;
    inputUsernameAtualizar.value = result.username;
    inputURLAtualizar.value = result.avatar_url;
    inputSenhaAtualizar.value = "";
  } catch (error) {
    console.error("Error:", error);
  }
}

async function atualizarUser(data, userid, token) {
  try {
    await fetch(`http://localhost:8087/api/v1/users/${userid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

  } catch (error) {
    console.error("Error:", error);
  }
}

export default user;
