import cards from "./cards.js";
import lista from "./lista.js";
import members from "./members.js";
import propagation from "./stop_propagation.js";
import tags from "./tags.js";
import getToken from "./token.js";

const coments = {
    addComments: async function (card_id) {
        let comments = await this.getComments(getToken(), card_id);
        // console.log(cards);

        let commentContent = `<ul class="displayOn" id="ul-comentarios">`;
        comments.forEach((comment => {
            commentContent += `<li style="display: flex; column-gap: 1rem; flex-direction: row; " comment_id="${comment.id}" class="comment-format"><div class="comment-content" contenteditable="true">${comment.comment}</div><p class="removerComentario"> 🗑️ </p></li>`;
        }));

        commentContent += `</ul> <button class="adicionarComentario"> ➕ Adicionar comentário</button>`;

        const cardsFormatElement = document.querySelector(`[card_id="${card_id}"]`);

        let id = await cards.readCard(getToken(), card_id);

        if (cardsFormatElement && cardsFormatElement.classList.contains("cards-format")) {
            // cardsFormatElement.innerHTML = ``;
            cardsFormatElement.innerHTML = `<h3 contenteditable="true" class="card-name">${id.name}</h3> <p class="removerCard">🗑️</p>`;
            cardsFormatElement.innerHTML += commentContent;
        }
        cards.eventEditCard();
        this.eventEditComment();

        const btnRmComentario = Array.from(document.getElementsByClassName("removerComentario"));
        btnRmComentario.forEach((button) => {
            button.addEventListener("click", async (event) => {
                let id = event.target.parentNode.getAttribute("comment_id");
                let cardId = (await this.readComment(getToken(), id)).card_id;
                console.log(id);
                console.log(event.target);
                await this.deleteComment(getToken(), id)
                await this.addComments(cardId);
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
    },
    updateComment: async function (token, comment_id, data) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/card_comments/${comment_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Comentario atualizado (RESULT): ", await result)
        } catch (error) {
            console.error("Error:", error);
        }
    },
    deleteComment: async function (token, comment_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/card_comments/${comment_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + `${token}`,
                },
            });
            const result = await response.json();
            console.log("Comentário apagado (RESULT): ", await result)
        } catch (error) {
            console.error("Erro:", error);
        }
    },
    readComment: async function (token, comment_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/card_comments/${comment_id}`, {
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
    eventEditComment: function () {
        const commentNameElements = document.querySelectorAll('.comment-content');

        const handleCardEdit = async (event) => {
            event.stopImmediatePropagation();

            const commentNameElements = event.target.textContent;
            const comment_id = event.target.parentElement.getAttribute("comment_id");
            let data = {
                comment: commentNameElements
            }
            // console.log(data);
            await this.updateComment(getToken(), comment_id, data);
        };

        const handleCardMouseOver = (event) => {
            const commentNameElements = event.target;
            commentNameElements.setAttribute('title', 'Clique para editar');
        };

        const handleCardMouseOut = (event) => {
            const commentNameElements = event.target;
            commentNameElements.removeAttribute('title');
        };

        commentNameElements.forEach((commentNameElements) => {
            commentNameElements.addEventListener('mouseover', handleCardMouseOver);
            commentNameElements.addEventListener('mouseout', handleCardMouseOut);
            commentNameElements.addEventListener('blur', handleCardEdit);
        });
    },
    eventAddComment: function () {
        const btnaddComment = Array.from(document.getElementsByClassName("adicionarComentario"));
        btnaddComment.forEach((element) => {
            element.addEventListener("click", async (event) => {
                event.stopImmediatePropagation();
                // console.log("Funcionando")
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
    await tags.addTags(data.card_id);
    await members.addMembers(data.card_id);
    coments.eventAddComment();
    coments.eventEditComment();
})

export default coments;