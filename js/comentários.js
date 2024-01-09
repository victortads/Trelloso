import cards from "./cards.js";
import getToken from "./token.js";

const coments = {
    addComments: async function (card_id) {
        let comments = await this.getComments(getToken(), card_id);
        // console.log(cards);
        let commentContent = "<ul>";
        comments.forEach((comment => {
            commentContent += `<li draggable="true" comment_id="${comment.id}" class="comment-format">${comment.comment}</li>`;
        }));

        commentContent += `</ul> <button class="adicionarComentario"> ➕ Adicionar comentário</button>`;

        const cardsFormatElement = document.querySelector(`[card_id="${card_id}"]`);

        let id = await cards.readCard(getToken(), card_id);

        if (cardsFormatElement && cardsFormatElement.classList.contains("cards-format")) {
            // cardsFormatElement.innerHTML = ``;
            cardsFormatElement.innerHTML = `<h3>${id.name}</h3>`;
            cardsFormatElement.innerHTML += commentContent;
        }

        const btnaddComment = Array.from(document.getElementsByClassName("adicionarComentario"));
        btnaddComment.forEach((element) => {
            element.addEventListener("click", (event) => {
                event.stopImmediatePropagation()
                if (document.getElementById("div-adicionar-lista").classList.contains("displayOn")) {
                    document.getElementById("div-adicionar-lista").classList.remove("displayOn");
                    document.getElementById("div-adicionar-lista").classList.add("displayNone");
                }

                if (document.getElementById("div-adicionar-card").classList.contains("displayOn")) {
                    document.querySelector("#div-adicionar-card").classList.remove("displayOn");
                    document.querySelector("#div-adicionar-card").classList.add("displayNone");
                }
                let cardId = event.target.parentNode.getAttribute("card_id");

                if (document.querySelector("#div-adicionar-comentario").classList.contains("displayNone")) {
                    document.querySelector("#div-adicionar-comentario").classList.remove("displayNone");
                    document.querySelector("#div-adicionar-comentario").classList.add("displayOn");
                } else {
                    document.querySelector("#div-adicionar-comentario").classList.remove("displayOn");
                    document.querySelector("#div-adicionar-comentario").classList.add("displayNone");
                }

                document.getElementById("input-comentario-id").value = cardId;

            })
        })
        return commentContent;

    },
    getComments: async function (token, card_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/cards/${card_id}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`,
                },
            });

            const result = await response.json();
            // console.log("Success: ", result);
            return result;
        } catch (error) {
            console.error("Error:", error);
        }
    },
    postComment: async function (data, token) {
        try {
            const response = await fetch("http://localhost:8087/api/v1/card_comments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Comentário enviado (RESULT): ", await result)
        } catch (error) {
            console.error("Error:", error);
        }
    }
}
document.querySelector("#div-adicionar-comentario").addEventListener("submit", async (event) => {
    event.preventDefault();

    let data = {
        comment: document.getElementById("input-comentario-nome").value,
        card_id: document.getElementById("input-comentario-id").value
    }
    await coments.postComment(data, getToken())
    document.querySelector("#div-adicionar-comentario").classList.remove("displayOn");
    document.querySelector("#div-adicionar-comentario").classList.add("displayNone");
    // console.log("Funcionando", data.card_id)
    await coments.addComments(data.card_id);
})

export default coments;