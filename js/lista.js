import getToken from "./token.js";
import addBoards, { addLists } from "./quadros.js";
import propagation from "./stop_propagation.js";
import { exibirBoard } from "./quadros.js";

let btn_lista = "";

const lista = {
  // Implementar para adicionar listas naquele board
  addLista: function () {
    btn_lista = Array.from(document.getElementsByClassName("adicionarLista"));
    btn_lista.forEach(element => {
      element.addEventListener("click", (event) => {
        event.stopPropagation()
        event.stopImmediatePropagation()
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
  }
};

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