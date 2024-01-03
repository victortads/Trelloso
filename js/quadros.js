import adicionarFavorito from "./quadroAtualizar.js";

let boardsContent = document.getElementById("boards-content");
let board = document.getElementById("boards");
let boardsList = "";

// Adiciona eventListener para exibir os quadros
async function exibirBoard() {
  boardsList = Array.from(document.getElementsByClassName("boards-format"));
boardsList.forEach(element => {

  element.addEventListener("click", (event) =>{
    if(event.target.classList.contains("positionAbsolute")){
      event.target.classList.remove("positionAbsolute")
    } else{
      event.target.classList.add("positionAbsolute")
    }
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

async function addBoards() {
  boardsContent.innerHTML = "";
  let boards = await getBoards(localStorage.getItem("token"));
  let div_board = "";
  boards.forEach((element) => {
    div_board += `
    <div id="${element.id}" class="boards-format" style="background-color: ${element.color};">
        <p>${element.name}</p>
        <p class="starEmpty">✩</p>
        <p class="star displayNone">⭐</p>
    </div>
`;
    boardsContent.innerHTML = div_board;

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
