import getToken from "./token.js";
import addBoards, { addLists } from "./quadros.js";
import propagation from "./stop_propagation.js";
import { exibirBoard } from "./quadros.js";
import cards from "./cards.js";

let btn_lista = "";

const deleteListButtonClickHandler = async (event) => {
  // event.stopImmediatePropagation();
  let id = event.target.parentNode.parentNode.getAttribute("list_id");
  const listBoard = await lista.getList(getToken(), id);
  await lista.deleteCardsList(id);
  addLists(listBoard.board_id, document.getElementById(`${listBoard.board_id}`).childNodes[3]);
};

const lista = {
  // Implementar para adicionar listas naquele board
  addLista: function () {
    btn_lista = Array.from(document.getElementsByClassName("adicionarLista"));
    btn_lista.forEach(element => {
      element.addEventListener("click", (event) => {
        event.stopPropagation()
        event.stopImmediatePropagation()

        if (document.getElementById("div-adicionar-card").classList.contains("displayOn")) {
          document.querySelector("#div-adicionar-card").classList.remove("displayOn");
          document.querySelector("#div-adicionar-card").classList.add("displayNone");
        }

        if (document.getElementById("div-adicionar-comentario").classList.contains("displayOn")) {
          document.querySelector("#div-adicionar-comentario").classList.remove("displayOn");
          document.querySelector("#div-adicionar-comentario").classList.add("displayNone");
        }

        if (document.getElementById("div-adicionar-lista").classList.contains("displayNone")) {
          document.getElementById("div-adicionar-lista").classList.remove("displayNone");
          document.getElementById("div-adicionar-lista").classList.add("displayOn");
        } else {
          document.getElementById("div-adicionar-lista").classList.remove("displayOn");
          document.getElementById("div-adicionar-lista").classList.add("displayNone");
        }

        document.getElementById("input-lista-id").value = event.target.parentNode.parentNode.id;

        console.log(event.target.parentNode.parentNode.id)


        propagation.stopPropagation("form-lista")
      });
    });
  },
  // Busca as listas para aquele board
  getLists: async function (token, board_id) {
    try {
      const response = await fetch(`http://localhost:8087/api/v1/boards/${board_id}/lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + ` ${token}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  },
  getList: async function (token, list_id) {
    try {
      // console.log(`http://localhost:8087/api/v1/lists/${list_id}`)
      const response = await fetch(`http://localhost:8087/api/v1/lists/${list_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + ` ${token}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
    }
  },
  // Cria listas
  postList: async function (data, token) {
    try {
      const response = await fetch("http://localhost:8087/api/v1/lists/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + ` ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Lista enviada (RESULT): ", result)
    } catch (error) {
      console.error("Error:", error);
    }
  },
  deleteList: async function (token, list_id) {
    try {
      const response = await fetch(`http://localhost:8087/api/v1/lists/${list_id}`, {
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
  },
  deleteListButton: async function () {
    let trashList = Array.from(document.getElementsByClassName("removerLista"));

    trashList.forEach((button) => {
      button.removeEventListener("click", deleteListButtonClickHandler);
    });
    trashList.forEach((button) => {
      button.addEventListener("click", deleteListButtonClickHandler);
    });
  },

  // BUSCA O ARRAY DE LISTAS E APAGA
  deleteCardsList: async function (list_id) {
    let cardsArray = Array.from(await cards.getCards(getToken(), list_id));
    // console.log("Lista de cards: ", cardsArray);
    cardsArray.forEach(async (card) => {
      await cards.deleteCard(getToken(), card.id)
    })
    await lista.deleteList(getToken(), list_id);
  }
}

export default lista;

document.getElementById("form-lista").addEventListener("submit", async (event) => {
  event.preventDefault();
  // adiciona o position como 0
  let data = {
    name: document.getElementById("input-lista-nome").value,
    board_id: document.getElementById("input-lista-id").value,
    position: 0
  }
  // console.log("DADOS SÃO: ", data)
  await lista.postList(data, getToken())
  await addLists(data.board_id, document.getElementById(data.board_id).childNodes[3])
  document.getElementById("input-lista-nome").value = "";
  document.getElementById("input-lista-id").value = "";
  document.getElementById("div-adicionar-lista").classList.remove("displayOn");
  document.getElementById("div-adicionar-lista").classList.add("displayNone");

})