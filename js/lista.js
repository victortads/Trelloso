let btn_lista = "";
let btnAddCard = '';

const lista = {

  // Implementar para adicionar listas naquele board
  addLista: function () {
    btn_lista = Array.from(document.getElementsByClassName("adicionarLista"));
    btn_lista.forEach(element => {
      element.addEventListener("click", (event) => {
        event.stopPropagation()
        if (document.getElementById("div-adicionar-lista").classList.contains("displayNone")) {
          document.getElementById("div-adicionar-lista").classList.remove("displayNone");
          document.getElementById("div-adicionar-lista").classList.add("displayOn");
        } else {
          document.getElementById("div-adicionar-lista").classList.remove("displayOn");
          document.getElementById("div-adicionar-lista").classList.add("displayNone");
        }

        document.getElementById("input-lista-id").value = event.target.parentNode.parentNode.id;

        console.log(event.target.parentNode.parentNode.id)
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
      // console.log("Success: ", result);

      console.log("Conteudo das listas: ", result);
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
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

export default lista;









