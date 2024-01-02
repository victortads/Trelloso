let user = document.getElementById("user-show");
let divAtualizar = document.getElementById("atualizar-cadastro");
let inputNomeAtualizar = document.getElementById("input-atualizar-nome");
let inputUsernameAtualizar = document.getElementById(
  "input-atualizar-username"
);
let inputURLAtualizar = document.getElementById("input-atualizar-url");
let inputSenhaAtualizar = document.getElementById("input-atualizar-senha");
let formAtualizar = document.getElementById("form-atualizar");

user.addEventListener("click", () => {
  if (divAtualizar.classList.contains("displayNone")) {
    getDataUser(localStorage.getItem("token"));
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

formAtualizar.addEventListener("submit", async (event) => {
  event.preventDefault();

  let dadosMod = {
    name: inputNomeAtualizar.value,
    username: inputUsernameAtualizar.value,
    avatar_url: inputURLAtualizar.value,
    password: inputSenhaAtualizar.value,
  };
  let id = await getId(localStorage.getItem("token"));
  atualizarUser(dadosMod, id, localStorage.getItem("token"));
});

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
    console.log("Success:", result.id);
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
    console.log("Success:", result);
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
    console.log(`http://localhost:8087/api/v1/users/${userid}`);
    const response = await fetch(
      `http://localhost:8087/api/v1/users/${userid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

export default user;
