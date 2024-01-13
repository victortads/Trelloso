import getToken from "./token.js";

const tags = {
    addTags: async function (card_id) {
        let tags = await this.readTags(getToken());
        const userTags = await this.getTags(getToken(), card_id);
        let idTagsUser = [];
        userTags.forEach((userTag) => {
            idTagsUser.push(userTag.id)
        })

        let tagsContent = `<div tags_card="${card_id}" class="tagsContent displayFlex">`;
        tags.forEach((tag => {
            let checked = "";
            if (idTagsUser.includes(tag.id)) {
                checked = "checked";
            }
            tagsContent +=
                `<div tag_id="${tag.id}" class="tag-format">
                <input type="checkbox" class="tag" name="tag" ${checked} />
                <label for="tag">#${tag.name}</label>
            </div>`;
        }));

        tagsContent += "</div>";

        const cardsFormatElement = document.querySelector(`[card_id="${card_id}"]`);

        if (cardsFormatElement && cardsFormatElement.classList.contains("cards-format")) {
            cardsFormatElement.innerHTML += tagsContent;
        }

        return tagsContent;
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
    },
    readTags: async function (token) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/tags/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`
                },
            });

            const result = await response.json();
            // console.log("Success: ", result);
            return result;
        } catch (error) {
            console.error("Error:", error);
        }
    },
    addTag: async function (token, data) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/card_tags/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Tag criada (RESULT): " + await result)
        } catch (error) {
            console.error("Error:", error);
        }
    },
    removeTag: async function (token, card_id, tag_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/card_tags/${card_id}/${tag_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`,
                },
            });
            const result = await response.json();
            console.log("Tag apagada (RESULT): " + await result)
        } catch (error) {
            console.error("Error:", error);
        }
    },
    eventChangeInput: function () {
        const selecionado = document.querySelectorAll(".tag");
        selecionado.forEach((el) => {
            el.addEventListener("change", async (event) => {
                const cardId = event.target.parentNode.parentNode.getAttribute("tags_card");
                const tagId = event.target.parentNode.getAttribute("tag_id");
                if (el.checked) {  // criar tag
                    let data = {
                        card_id: cardId,
                        tag_id: tagId
                    }
                    await this.addTag(getToken(), data);
                } else { //apagar tag
                    await this.removeTag(getToken(), cardId, tagId);
                }
            });
        })
    }
}

export default tags;