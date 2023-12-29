let form_cadastro = document.getElementById("form-cadastro");
let input_nome = document.getElementById("input-nome");
let input_username = document.getElementById("input-username");
let input_senha = document.getElementById("input-senha");


async function postJSON(data) {
    try {
        const response = await fetch("http://192.168.89.186:8087/api/v1/users/", {
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

    function: form_cadastro.addEventListener("submit", (event) => {
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