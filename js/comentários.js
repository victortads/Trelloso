import getToken from "./token.js";

const coments = {
    addComments: async function (card_id) {
        let comments = await this.getComments(getToken(), card_id);
        // console.log(cards);
        let commentContent = "<ul>";
        comments.forEach((comment => {
            commentContent += `<li draggable="true" comment_id="${comment.id}" class="comment-format">${comment.comment}</li>`;

        }));

        commentContent += "</ul>";


        
        const cardsFormatElement = document.querySelector(`[card_id="${card_id}"]`);

        if (cardsFormatElement && cardsFormatElement.classList.contains("cards-format")) {
            cardsFormatElement.innerHTML += commentContent;
        }
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
    postComment: async function(){
        
    }
}

export default coments;