import getToken from "./token.js";

const tags = {
    addTags: async function (card_id) {
        let tags = await this.readTags(getToken());
        const userTags = await this.getTags(getToken(), card_id);
        let idTagsUser = [];
        userTags.forEach((userTag) => {
            idTagsUser.push(userTag.id)
        })

        let tagsContent = '<div class="tagsContent displayFlex">';
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
        const selecionado = document.querySelectorAll(".tag");
        selecionado.forEach((el)=>{
            el.addEventListener("click", () => {
                console.log("Clicado")
            });
        })


        

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
    }
}

export default tags;