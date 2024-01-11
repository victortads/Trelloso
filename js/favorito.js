//  Implementar para apertar e ter lista de favoritos
let content = document.getElementById("boards-content");
let favoritos = document.getElementById("favoritos");

favoritos.addEventListener("click", async () => {
    await addFavoriteBoards()
})

// Os boards inicialmente tem uma estrutura de começar no 1 e crescer em 2
// O código trata para que eu verifique se os elementos são uma div
// E remove os childNodes que não tem favorito: true
export async function addFavoriteBoards() {
    let favBoardsList = content.childNodes;
    // Elimina logo o BUTTON da lista
    content.childNodes[favBoardsList.length - 1].remove();
    console.log(content.childNodes)
    for (let i = favBoardsList.length - 1; i >= 1; i--) {
        if (content.childNodes[i].nodeName === "DIV") {
            if (content.childNodes[i].getAttribute("favorito") === "false"){
                content.childNodes[i].remove()
            }
        }
        if (content.childNodes[i].nodeName === "BUTTON") {
            console.log("É button")
            content.childNodes[i].remove();
        }
    }
}