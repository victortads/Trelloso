import adicionarFavorito from "./quadroAtualizar.js";
import lista from "./lista.js";
import getToken from "./token.js";
import cards from "./cards.js";

let boardsContent = document.getElementById("boards-content");
let board = document.getElementById("boards");
let boardsList = "";
let listsContent = "";


// Adiciona eventListener para exibir os quadros
async function exibirBoard() {
  boardsList = Array.from(document.getElementsByClassName("boards-format"));

  boardsList.forEach(element => {

    element.addEventListener("click", async (event) => {
      if (event.target.classList.contains("positionAbsolute")) {
        event.target.childNodes[3].classList.remove("displayFlex");
        event.target.childNodes[3].classList.add("displayNone");
        event.target.classList.remove("positionAbsolute");
        if (document.getElementById("div-adicionar-lista").classList.contains("displayOn")) {
          document.getElementById("div-adicionar-lista").classList.remove("displayOn");
          document.getElementById("div-adicionar-lista").classList.add("displayNone");
        }
      } else {
        event.target.childNodes[3].classList.remove("displayNone");
        event.target.childNodes[3].classList.add("displayFlex");
        event.target.classList.add("positionAbsolute");
      }

      // console.log(event.target.classList); // div com as listas salvo
      addLists(event.target.id, event.target.childNodes[3])

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
    console.log("Success:", result);
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

}


async function addLists(id, element) {

  let div_listas = "";
  let listas = Array.from(await lista.getLists(getToken(), id));

  let IDs = [];
  listas.forEach((list) => {
    div_listas += `
    <div list_id="${list.id}" class="lists-format">
       <h3>${list.name}</h3> 
    </div>
`;
    IDs.push(list.id);
    console.log("BOARD DE ID: ", id)
    element.innerHTML += `<button class="adicionarLista"> ➕ Adicionar lista</button>`;
  })
  element.innerHTML = div_listas
  
  for (let i = 0; i < IDs.length; i++) {
    await cards.addCards(IDs[i]);
}

  lista.addLista();
}

async function postBoard(data, token) {
  try {
    const response = await fetch("http://localhost:8087/api/v1/boards/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer" + ` ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function addBoardButton() {
  try {
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
