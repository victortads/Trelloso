import login from "./login.js";
console.log("main module!");

let verify = localStorage.getItem("token");
let nav = document.querySelector("#nav");
let content = document.querySelector("#content");
document.querySelector("#btn-rmtoken").addEventListener("click", () => {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
    alert("Token apagado!");
    getToken();
  }
});

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
    console.log("Success:", result.name);
    if (result.name) {
      let div = document.createElement("div");
      let p = document.createElement("p");
      var textEl = document.createTextNode("Bem vindo, " + result.name);
      p.appendChild(textEl);
      div.appendChild(p);

      document.querySelector("#header").appendChild(div);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

let token = localStorage.getItem("token");
readUser(token);
