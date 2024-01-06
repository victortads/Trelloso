import getToken from "./token.js";

const cards = {
    addCardsOption: async function () {
        btn_lista = Array.from(document.getElementsByClassName("adicionarLista"));
        btn_lista.forEach(element => {
            element.addEventListener("click", (event) => {
                event.stopPropagation()
                if (document.getElementById("div-adicionar-lista").classList.contains("displayNone")) {
                    document.getElementById("div-adicionar-lista").classList.remove("displayNone");
                    document.getElementById("div-adicionar-lista").classList.add("displayOn");
                } else {
                    document.getElementById("div-adicionar-lista").classList.remove("displayOn");
                    document.getElementById("div-adicionar-lista").classList.add("displayNone");
                }

                document.getElementById("input-lista-id").value = event.target.parentNode.parentNode.id;

                console.log(event.target.parentNode.parentNode.id)
            });
        });
    },
    addCards: async function (list_id) {
        let cards = await this.getCards(getToken(), list_id);
        // console.log(cards);
        let cardsContent = "<ul>";
        cards.forEach((cards => {
            cardsContent += `<li card_id="${cards.id}">${cards.name}</li>`;

        }));

        cardsContent += "</ul>";


        
        const listsFormatElement = document.querySelector(`[list_id="${list_id}"]`);

        if (listsFormatElement && listsFormatElement.classList.contains("lists-format")) {
            listsFormatElement.innerHTML += cardsContent;
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