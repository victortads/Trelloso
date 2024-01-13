import propagation from "./stop_propagation.js";
import getToken from "./token.js";

const members = {
    addMembers: async function (card_id) {
        let members = await this.getMembers(getToken(), card_id);

        let membersContent = '<div class="div-members displayFlex">';
        members.forEach((member => {
            if(member.avatar_url === null){
                member.avatar_url = "";
            }
            membersContent += 
            `<div member_id="${member.id}" class="member-format displayFlex">
                <h3> ${member.name} </h3>
                <img class="member-img" src="${member.avatar_url}" alt="Imagem do usuário"/>
            </div>`;
        }));

        membersContent += "</div>";

        const cardsFormatElement = document.querySelector(`[card_id="${card_id}"]`);

        if (cardsFormatElement && cardsFormatElement.classList.contains("cards-format")) {
            cardsFormatElement.innerHTML += membersContent;
        }
        propagation.stopPropagation(".div-members")
        return membersContent;

    },
    getMembers: async function (token, card_id) {
        try {
            const response = await fetch(`http://localhost:8087/api/v1/cards/${card_id}/members`, {
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

export default members;