import adicionarFavorito from "./quadroAtualizar.js";

let boardsContent = document.getElementById("boards-content");
let board = document.getElementById("boards");

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
  boards.forEach((element) => {
    let div_board = document.createElement("div");
    let p = document.createElement('p');
    let conteudo = document.createTextNode(element.name);
    p.appendChild(conteudo);
    div_board.id = `${element.id}`;
    div_board.classList.add("boards-format");
    let star = document.createElement('p');
    let starEmpty = document.createElement('p');
    star.appendChild(document.createTextNode("⭐"));
    star.classList.add('star');
    starEmpty.classList.add('starEmpty');
    starEmpty.appendChild(document.createTextNode("✩"));
    div_board.appendChild(p);
    div_board.style.backgroundColor = `${element.color}`;
    boardsContent.appendChild(div_board);
    div_board.appendChild(starEmpty);
    div_board.appendChild(star);
    star.classList.add("displayNone");
    starEmpty.classList.add("displayOn");
  });
  let btnAddBoard = document.createElement("button");
  btnAddBoard.appendChild(document.createTextNode("Adicionar quadro"));
  btnAddBoard.id = "btn-addBoard";
  boardsContent.appendChild(btnAddBoard);
  await addBoardButton();
  await adicionarFavorito();
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
        if (
          document.querySelector("#div-createCard").classList.contains("displayOn")
        ) {
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
