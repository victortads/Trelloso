import getToken from "./token.js";
import coments from "./comentários.js";
import lista from "./lista.js";
import tags from "./tags.js";
import propagation from "./stop_propagation.js";

let boardId = "";

const cards = {
    addCardsOption: async function () {

    },
    addCards: async function (list_id) {

        let cards = Array.from(await this.getCards(getToken(), list_id));
        // console.log(cards);
        let cardsContent = "<ul>";
        let IDs = [];
        cards.forEach((cards => {
            cardsContent += `<li draggable="true" card_id="${cards.id}" class="cards-format">${cards.name} <p class="removerCard">🗑️</p></li>`;
            IDs.push(cards.id);
        }));

        cardsContent += `</ul> <button class="adicionarCards"> ➕ Adicionar cards</button>`;
        const listsFormatElement = document.querySelector(`[list_id="${list_id}"]`);

        let id = await lista.getList(getToken(), list_id);
        if (listsFormatElement) {
            listsFormatElement.innerHTML = `<div class="div-list"><h3 contenteditable="true" class="card-name">${id.name}</h3> <p class="removerLista"> 🗑️ </p></div>`;
            listsFormatElement.innerHTML += cardsContent;
        }
        lista.eventEditList();
        await lista.deleteListButton()
        propagation.stopPropagation(".removerCard");
        const btnaddCard = Array.from(document.getElementsByClassName("adicionarCards"));
        btnaddCard.forEach((element) => {
            element.addEventListener("click", (event) => {
                event.stopImmediatePropagation()
                if (document.getElementById("div-adicionar-lista").classList.contains("displayOn")) {
                    document.getElementById("div-adicionar-lista").classList.remove("displayOn");
                    document.getElementById("div-adicionar-lista").classList.add("displayNone");
                }

                if (document.getElementById("div-adicionar-comentario").classList.contains("displayOn")) {
                    document.querySelector("#div-adicionar-comentario").classList.remove("displayOn");
                    document.querySelector("#div-adicionar-comentario").classList.add("displayNone");
                }

                const parentListElement = event.target.closest(".lists-format");
                const listId = parentListElement.getAttribute("list_id");
                boardId = parentListElement.parentNode.parentNode.id;
                if (document.querySelector("#div-adicionar-card").classList.contains("displayNone")) {
                    document.querySelector("#div-adicionar-card").classList.remove("displayNone");
                    document.querySelector("#div-adicionar-card").classList.add("displayOn");
                } else {
                    document.querySelector("#div-adicionar-card").classList.remove("displayOn");
                    document.querySelector("#div-adicionar-card").classList.add("displayNone");
                }

                document.getElementById("input-card-id").value = listId;

            })
        })

        let cardsFunction = Array.from(document.getElementsByClassName("cards-format"));
        cardsFunction.forEach((card)=>{
            card.addEventListener("click", async (event) =>{
                event.stopPropagation();
                event.stopImmediatePropagation();

                
                // console.log(event.target.classList);
                // console.log(event.target.childNodes);
                
                if (event.target.classList.contains("positionAbsoluteCard")) {
                    let cardName = event.target.childNodes[0].textContent;
                    console.log(cardName)
                    event.target.childNodes[3].classList.remove("displayOn");
                    event.target.childNodes[3].classList.add("displayNone");

                    event.target.innerHTML = `${cardName} <p class="removerCard">🗑️</p>`;
                    propagation.stopPropagation(".removerCard")

                    event.target.classList.remove("positionAbsoluteCard");
                    if (document.getElementById("div-adicionar-lista").classList.contains("displayOn")) {
                      document.getElementById("div-adicionar-lista").classList.remove("displayOn");
                      document.getElementById("div-adicionar-lista").classList.add("displayNone");
                    }
            
                    if (document.getElementById("div-adicionar-card").classList.contains("displayOn")) {
                      document.querySelector("#div-adicionar-card").classList.remove("displayOn");
                      document.querySelector("#div-adicionar-card").classList.add("displayNone");
                    }
            
                    if (document.getElementById("div-adicionar-comentario").classList.contains("displayOn")) {
                      document.querySelector("#div-adicionar-comentario").classList.remove("displayOn");
                      document.querySelector("#div-adicionar-comentario").classList.add("displayNone");
                    }
            
                  } else {
                    // event.target.childNodes[1].classList.remove("displayNone");
                    // event.target.childNodes[1].classList.add("displayFlex");
                    event.target.classList.add("positionAbsoluteCard");
                    await coments.addComments(event.target.getAttribute("card_id"));
                    // console.log(event.target.childNodes[3])
                  }
            })
        })

        // for (let i of IDs) {
        //     await coments.addComments(i);
        //     // await tags.addTags(i);
        // }

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
    },
    postCard: async function (data, token) {
        try {
            const response = await fetch("http://localhost:8087/api/v1/cards/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer" + ` ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("Card enviado (RESULT): " + await result)
        } catch (error) {
            console.error("Error:", error);
        }
    },
    readCard: async function (token, card_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/cards/${card_id}`, {
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
    deleteCard: async function (token, card_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/cards/${card_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + `${token}`,
                },
            });

            console.log(response)
        } catch (error) {
            console.error("Erro:", error);
        }
    }
}

document.getElementById("form-card").addEventListener("submit", async (event) => {
    event.preventDefault()
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString();
    let data = {
        name: document.getElementById("input-card-nome").value,
        date: dataFormatada,
        list_id: document.getElementById("input-card-id").value,
        position: 0
    }
    await cards.postCard(data, getToken());
    document.querySelector("#div-adicionar-card").classList.remove("displayOn");
    document.querySelector("#div-adicionar-card").classList.add("displayNone");
    document.getElementById("input-card-nome").value = "";
    document.getElementById("input-card-id").value = "";
    await cards.addCards(data.list_id);
})

export default cards;