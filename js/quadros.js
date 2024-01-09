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
        addLists(event.target.id, event.target.childNodes[3])
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
    div_board += `
    <div id="${element.id}" class="boards-format displayFlex" style="background-color: ${element.color};">
    <div class="board-header displayFlex">    
    <p class="board-name">${element.name}</p>
        <p class="starEmpty">✩</p>
        <p class="star displayNone">⭐</p>
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
  propagation.stopPropagation('.board-name');
  propagation.stopPropagation('.lists-content')
  propagation.stopPropagation('.board-header');

}

// Adiciona listas relacionadas ao board
export async function addLists(id, element) {
  let div_listas = "";
  let listas = Array.from(await lista.getLists(getToken(), id));

  // Array para salvar os ids de cada lista e depois usar para buscar os cards
  // let IDs = [];
  listas.forEach(async (list) => {
    div_listas += `
    <div draggable="true" list_id="${list.id}" class="lists-format">
       <h3>${list.name}</h3> 
    </div>
`;
    // IDs.push(list.id);
    element.innerHTML = div_listas
    element.innerHTML += `<button class="adicionarLista"> ➕ Adicionar lista</button>`;
    await cards.addCards(list.id);
  })

  // Adiciona para cada lista os cards relacionados
  // for (let i of IDs) {
  // }


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