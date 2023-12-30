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
    function: document.getElementById("form-cadastro").addEventListener("submit", (event) => {
        event.preventDefault();

        let dados = {
            name: input_nome.value,
            username: input_username.value,
            password: input_senha.value
        }
        postJSON(dados);

    })

}

export default cadastro;