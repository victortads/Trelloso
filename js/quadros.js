import adicionarFavorito from "./quadroAtualizar.js";
import lista from "./lista.js";
import getToken from "./token.js";
import cards from "./cards.js";
import propagation from "./stop_propagation.js";

let boardsContent = document.getElementById("boards-content");
let board = document.getElementById("boards");
let boardsList = "";


// Adiciona eventListener para exibir os quadros
export async function exibirBoard() {
  boardsList = Array.from(document.getElementsByClassName("boards-format"));

  // Trata para que os elementos board se sobreponham sobre os outros
  // E expande para visualizar
  boardsList.forEach(element => {

    element.addEventListener("click", async (event) => {

      // if(document.getElementById("div-adicionar-lista").classList.contains("displayOn"))

      if (event.target.classList.contains("positionAbsolute")) {
        event.target.childNodes[3].classList.remove("displayFlex");
        event.target.childNodes[3].classList.add("displayNone");
        event.target.classList.remove("positionAbsolute");
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
        event.target.childNodes[3].classList.remove("displayNone");
        event.target.childNodes[3].classList.add("displayFlex");
        event.target.classList.add("positionAbsolute");
        // console.log(event.target.childNodes[3])
        await addLists(event.target.id, event.target.childNodes[3]);
      }

      // console.log("Disparou o elemento: ", event.target.childNodes[3]); // div com as listas salvo

    })
  })
}

// Buscar quadros do usuário logado
async function getBoards(token) {
  try {
    const response = await fetch(
      "http://localhost:8087/api/v1/users/me/boards",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + ` ${token}`,
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Carrega os quadros na página de quadros
board.addEventListener("click", async () => {
  try {
    if (boardsContent.classList.contains("displayFlex")) {
      boardsContent.classList.remove("displayFlex");
      boardsContent.classList.add("displayNone");
    } else {
      boardsContent.classList.remove("displayNone");
      boardsContent.classList.add("displayFlex");
    }

    if (document.querySelector("#div-createCard").classList.contains("displayOn")) {
      document.querySelector("#div-createCard").classList.remove("displayOn");
      document.querySelector("#div-createCard").classList.add("displayNone");
    }

    await addBoards();


  } catch (error) {
    console.error("Error:", error);
  }
});


// Adicionar quadros na lista e exibir
export default async function addBoards() {
  boardsContent.innerHTML = "";
  let boards = await getBoards(getToken());
  let div_board = "";
  boards.forEach((element) => {

    let star;
    let starEmpty;
    if (element.favorito) {
      star = "displayOn";
      starEmpty = "displayNone"
    } else {
      star = "displayNone";
      starEmpty = "displayOn"
    }
    div_board += `
    <div id="${element.id}" class="boards-format displayFlex" style="background-color: ${element.color};">
    <div class="board-header displayFlex">    
    <p class="board-name">${element.name}</p>
        <p class="starEmpty ${starEmpty}">✩</p>
        <p class="star ${star}">⭐</p>
        <p class="removerQuadro"> 🗑️ </p>
        <p class="editarQuadro"> ✏️ </p>
        </div>
        <div class="lists-content displayNone">
        <button class="adicionarLista"> ➕ Adicionar lista</button>
        </div>
    </div>
`;
    boardsContent.innerHTML = div_board;

  });


  await addBoardButton();
  await adicionarFavorito();
  await exibirBoard();
  await deleteBoardButton();
  await editBoardButton();
  propagation.stopPropagation('.board-name');
  propagation.stopPropagation('.lists-content');
  propagation.stopPropagation('.board-header');

}

// ADICIONA OS EVENTOS PARA EDITAR O BOARD
async function editBoardButton() {
  let edit = Array.from(document.getElementsByClassName("editarQuadro"));
  edit.forEach(button => {
    button.addEventListener("click", (event) => {
      let id = event.target.parentNode.parentNode.id; // id
      // console.log(event.target.parentNode.parentNode.style.backgroundColor); // color
      // console.log(event.target.parentNode.childNodes[1]); // Name
      // console.log(event.target.parentNode.childNodes[1]);
    })
  })
}


// EXCLUIR AS LISTAS ASSOCIADAS AO BOARD
async function deleteBoardButton() {
  let trash = Array.from(document.getElementsByClassName("removerQuadro"));
  trash.forEach(button => {
    button.addEventListener("click", async (event) => {
      let id = event.target.parentNode.parentNode.id;
      console.log(id)
      await deleteListsBoard(id);
      await addBoards();
    })
  })
}

// BUSCA O ARRAY DE LISTAS E APAGA
async function deleteListsBoard(board_id) {
  let listsArray = Array.from(await lista.getLists(getToken(), board_id));
  console.log("Lista de listas: ", listsArray);
  listsArray.forEach(async (list) => {
    await lista.deleteList(getToken(), list.id)
  })
  await removerQuadro(getToken(), board_id);
}

// Adiciona listas relacionadas ao board
export async function addLists(board_id, element) {
  // console.log("ADICIONANDO AS LISTAS")
  let div_listas = "";
  let listas = Array.from(await lista.getLists(getToken(), board_id));

  // Verifica se o array não está vazio
  if (listas.length != 0) {
    listas.forEach(async (list) => {
      div_listas += `
    <div draggable="true" list_id="${list.id}" class="lists-format">
    </div>
`;
      element.innerHTML = div_listas
      element.innerHTML += `<button class="adicionarLista"> ➕ Adicionar lista</button>`;
      await cards.addCards(list.id);
    })
  } else {
    element.innerHTML = `<button class="adicionarLista"> ➕ Adicionar lista</button>`;
  }

  propagation.stopPropagation('.lists-format');
  lista.addLista();

}

async function postBoard(data, token) {
  try {
    await fetch("http://localhost:8087/api/v1/boards/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function removerQuadro(token, board_id) {
  try {
    const response = await fetch(`http://localhost:8087/api/v1/boards/${board_id}`, {
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

async function atualizarQuadro(token, board_id, data) {
  try {
    await fetch(`http://localhost:8087/api/v1/boards/${board_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

  } catch (error) {
    console.error("Error:", error);
  }
}

// Adiciona o form para envio dos dados de novo card
async function addBoardButton() {
  try {
    boardsContent.innerHTML += `<button id="btn-addBoard"> Adicionar quadro </button>`;
    let btnAddBoard = document.querySelector("#btn-addBoard");

    if (btnAddBoard) {
      btnAddBoard.addEventListener("click", () => {
        if (document.querySelector("#div-createCard").classList.contains("displayOn")) {
          document.querySelector("#div-createCard").classList.remove("displayOn");
          document.querySelector("#div-createCard").classList.add("displayNone");
        } else {
          document.querySelector("#div-createCard").classList.remove("displayNone");
          document.querySelector("#div-createCard").classList.add("displayOn");
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


let formBoard = document.getElementById("form-addBoard");
// Formatação para criação de boards (Salva favorito: false como padrão)
formBoard.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    let boardData = {
      name: document.getElementById("board-name").value,
      color: document.getElementById("board-color").value,
      favorito: false,
    };
    document.querySelector("#div-createCard").classList.remove("displayOn");
    document.querySelector("#div-createCard").classList.add("displayNone");
    await postBoard(boardData, getToken());
    await addBoards();
  } catch (error) {
    console.error("Error:", error);
  }
});