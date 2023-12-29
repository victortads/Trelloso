let form_login = document.getElementById("form-login");

let input_username = document.getElementById("input-user_login");
let input_password = document.getElementById("input-passsword_login");

async function verifyToken(username, password) {
    try {
        const response = await fetch("http://192.168.89.186:8087/api/v1/auth/token", {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username: username, password: password }).toString()
        });
        const result = await response.json();
        console.log("Success: ", result);
        localStorage.setItem("token", result.access_token);
    } catch (error) {
        console.error("Error:", error);
    }
}


const login = {

    function: form_login.addEventListener("submit", (event) => {
        event.preventDefault();

        let dados = {
            username: input_username.value,
            password: input_password.value
        }
        verifyToken(dados.username, dados.password);

    })

}

export default login;