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
    let boards = await getBoards(localStorage.getItem("token"));
    let boardsContent = document.getElementById("boards-content");
    if (boardsContent.classList.contains("displayOn")) {
      boardsContent.classList.remove("displayOn");
      boardsContent.classList.add("displayNone");
    } else {
      boardsContent.classList.remove("displayNone");
      boardsContent.classList.add("displayOn");
    }

    if (
      document.querySelector("#div-createCard").classList.contains("displayOn")
    ) {
      document.querySelector("#div-createCard").classList.remove("displayOn");
      document.querySelector("#div-createCard").classList.add("displayNone");
    }
    boardsContent.innerHTML = "";

    boards.forEach((element) => {
      let div_board = document.createElement("div");
      let conteudo = document.createTextNode(element.name);
      div_board.appendChild(conteudo);
      div_board.style.backgroundColor = `${element.color}`;
      boardsContent.appendChild(div_board);
    });
    let btnAddBoard = document.createElement("button");
    btnAddBoard.appendChild(document.createTextNode("Adicionar quadro"));
    btnAddBoard.id = "btn-addBoard";
    boardsContent.appendChild(btnAddBoard);
    await addBoardButton();
  } catch (error) {
    console.error("Error:", error);
  }
});

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
    let btnAddBoard = await document.querySelector("#btn-addBoard");

    if (btnAddBoard) {
      btnAddBoard.addEventListener("click", () => {
        if (
          document
            .querySelector("#div-createCard")
            .classList.contains("displayOn")
        ) {
          document
            .querySelector("#div-createCard")
            .classList.remove("displayOn");
          document
            .querySelector("#div-createCard")
            .classList.add("displayNone");
        } else {
          document
            .querySelector("#div-createCard")
            .classList.remove("displayNone");
          document.querySelector("#div-createCard").classList.add("displayOn");
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

let formBoard = document.getElementById("form-addBoard");

formBoard.addEventListener("submit", (event) => {
  event.preventDefault();
  let boardData = {
    name: document.getElementById("board-name").value,
    color: document.getElementById("board-color").value,
    favorito: false,
  };
  document.querySelector("#div-createCard").classList.remove("displayOn");
  document.querySelector("#div-createCard").classList.add("displayNone");
  postBoard(boardData, localStorage.getItem("token"));
});
