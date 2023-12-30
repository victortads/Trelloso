import cadastro from "./cadastro.js"

async function verifyToken(data) {
    try {
        const response = await fetch("http://localhost:8087/api/v1/auth/token", {
            method: 'POST',
            body: data
        });
        const result = await response.json();
        console.log("Success: ", result);
        
        if (result.access_token){
        localStorage.setItem("token", result.access_token);
        alert("Token adicionado ao LS!")
        }
} catch (error) {
    console.error("Error:", error);
}
}

const login = {
    
    divLogin: document.getElementById("div_login"),
    formLogin: document.getElementById("form-login"),
    function: document.getElementById("form-login").addEventListener("submit", (event) => {
        event.preventDefault();

        let login = document.getElementById("form-login")
        let formdata = new FormData(login);
        verifyToken(formdata);

    }),
    function: document.querySelector("#btn-noLogin").addEventListener("click", () => {
        login.divLogin.classList.remove("displayOn");
        login.divLogin.classList.add("displayNone");
        cadastro.divCadastro.classList.remove("displayNone");
        cadastro.divCadastro.classList.add("displayOn");
    })
}

export default login;