let btn_lista = "";


const lista = {

  // Implementar para adicionar listas naquele board
  addLista: function() {
    btn_lista = Array.from(document.getElementsByClassName("adicionarLista"));
    btn_lista.forEach(element => {
      element.addEventListener("click", (event) => {
       console.log("IMPLEMENTAR " + event.target);
      });
    });
  },
// Busca as listas para aquele board
  getLists: async function(token, board_id) {
    try {
      const response = await fetch(`http://localhost:8087/api/v1/boards/${board_id}/lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer" + ` ${token}`,
        },
      });
  
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  },
// Cria listas
  postList: async function(data, token) {
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




  



  
