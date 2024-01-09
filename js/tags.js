import getToken from "./token.js";

const tags = {
    addTags: async function (card_id) {
        // let tags = await this.getTags(getToken(), card_id);
        // console.log(tags)
        // console.log(cards);
        // let tagsContent = "<ul>";
        // tags.forEach((tag => {
        //     commentContent += `<li draggable="true" tag_id="${comment.id}" class="comment-format">${comment.comment}</li>`;
        // }));

        // commentContent += "</ul>";



        // const cardsFormatElement = document.querySelector(`[card_id="${card_id}"]`);

        // if (cardsFormatElement && cardsFormatElement.classList.contains("cards-format")) {
        //     cardsFormatElement.innerHTML += commentContent;
        // }
        // return commentContent;
    },
    getTags: async function (token, card_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/cards/${card_id}/tags`, {
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
    }
}

export default tags;