import cadastro from "./cadastro.js"
import login from "./login.js"
console.log("main module!");

let verify = localStorage.getItem("token");

if (!verify) {
    alert("Usuário não logado");
    login.divLogin.classList.remove("displayNone");
    login.divLogin.classList.add("displayOn");
} 

