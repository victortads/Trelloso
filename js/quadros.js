import adicionarFavorito from "./quadroAtualizar.js";
import lista from "./lista.js";

let boardsContent = document.getElementById("boards-content");
let board = document.getElementById("boards");
let boardsList = "";

// Adiciona eventListener para exibir os quadros
async function exibirBoard() {
  boardsList = Array.from(document.getElementsByClassName("boards-format"));
  boardsList.forEach(element => {

    element.addEventListener("click", async (event) => {

      const PositionAbsolute = event.target.classList.contains("positionAbsolute");
      const DisplayFlex = event.target.classList.contains("displayFlex");
      if (PositionAbsolute && DisplayFlex) {
        event.target.classList.remove("positionAbsolute");
        console.log("PARA REMOVER POSITION " + PositionAbsolute);
        const childNode = event.target.childNodes[3];
        if (childNode) {
          childNode.classList.remove("displayOn");
          childNode.classList.add("displayNone");
        }
      } else if (!PositionAbsolute && DisplayFlex) {
        event.target.classList.add("positionAbsolute");
        console.log("PARA ADICIONAR POSITION " + !PositionAbsolute);
        const childNode = event.target.childNodes[3];
        if (childNode) {
          childNode.classList.remove("displayNone");
          childNode.classList.add("displayOn");
        }
      }
      // console.log(event.target.childNodes[3].classList)
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
    lista.addLista();


  } catch (error) {
    console.error("Error:", error);
  }
});


// Adicionar quadros na lista e exibir
async function addBoards() {
  boardsContent.innerHTML = "";
  let boards = await getBoards(localStorage.getItem("token"));
  let div_board = "";
  boards.forEach((element) => {
    div_board += `
    <div id="${element.id}" class="boards-format displayFlex" style="background-color: ${element.color};">
    <div class="board-header displayFlex">    
    <p class="board-name">${element.name}</p>
        <p class="starEmpty">✩</p>
        <p class="star displayNone">⭐</p>
        </div>
        <div class="displayNone">
        <button class="adicionarLista"> ➕ Adicionar lista</button>
        </div>
    </div>
`;
    boardsContent.innerHTML = div_board;
    lista.getLists(localStorage.getItem("token"), element.id)

  });
  let btnAddBoard = document.createElement("button");
  btnAddBoard.appendChild(document.createTextNode("Adicionar quadro"));
  btnAddBoard.id = "btn-addBoard";
  boardsContent.appendChild(btnAddBoard);
  await addBoardButton();
  await adicionarFavorito();
  await exibirBoard();

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
    await postBoard(boardData, localStorage.getItem("token"));
    await addBoards();
  } catch (error) {
    console.error("Error:", error);
  }
});
