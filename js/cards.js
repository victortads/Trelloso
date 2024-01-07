import getToken from "./token.js";
import coments from "./comentários.js";

const cards = {
    addCardsOption: async function () {
        
    },
    addCards: async function (list_id) {
        let cards = await this.getCards(getToken(), list_id);
        // console.log(cards);
        let cardsContent = "<ul>";
        let IDs = [];
        cards.forEach((cards => {
            cardsContent += `<li card_id="${cards.id}" class="cards-format">${cards.name}</li>`;
            IDs.push(cards.id);
        }));

        cardsContent += "</ul>";

        
        const listsFormatElement = document.querySelector(`[list_id="${list_id}"]`);
        
        if (listsFormatElement && listsFormatElement.classList.contains("lists-format")) {
            listsFormatElement.innerHTML += cardsContent;
        }
        

        for (let i = 0; i < IDs.length; i++) {
            await coments.addComments(IDs[i]);
        }
        return cardsContent;

    },
    getCards: async function (token, list_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/lists/${list_id}/cards`, {
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

export default cards;