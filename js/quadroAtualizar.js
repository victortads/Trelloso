export default async function adicionarFavorito() {

    let favorito = Array.from(document.getElementsByClassName("star"));
    let noFavorito = Array.from(document.getElementsByClassName("starEmpty"));

    favorito.forEach(element => {
        element.addEventListener("click", (event) => {
            event.target.parentNode.childNodes[3].classList.remove("displayNone");
            event.target.parentNode.childNodes[3].classList.add("displayOn");
            event.target.parentNode.childNodes[5].classList.remove("displayOn");
            event.target.parentNode.childNodes[5].classList.add("displayNone");
            let data = {
                name: event.target.parentNode.childNodes[0].innerText,
                color: event.target.parentNode.style.backgroundColor,
                favorito: false
            }
            atualizarBoard(data, event.target.parentNode.id, localStorage.getItem("token"));
        })
    });

    noFavorito.forEach(element => {
        element.addEventListener("click", (event) => {
            event.target.parentNode.childNodes[3].classList.remove("displayOn");
            event.target.parentNode.childNodes[3].classList.add("displayNone");
            event.target.parentNode.childNodes[5].classList.remove("displayNone");
            event.target.parentNode.childNodes[5].classList.add("displayOn");



            console.log(event.target.parentNode.id)
            let data = {
                name: event.target.parentNode.childNodes[0].innerText,
                color: event.target.parentNode.style.backgroundColor,
                favorito: true
            }
            atualizarBoard(data, event.target.parentNode.id, localStorage.getItem("token"));
        })
    })
}

async function atualizarBoard(data, boardid, token) {
    try {
        //   console.log(`http://localhost:8087/api/v1/boards/${boardid}`);
        const response = await fetch(
            `http://localhost:8087/api/v1/boards/${boardid}`,
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
