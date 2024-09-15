<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <title>Admin Panel</title>
</head>
<body>
  <nav>
    <ul class="menu">
      <li><a href="index.php">Anasayfa</a></li>
    </ul>
    <div class="search">
      <input type="text" id="search-bar" placeholder="Ara" />
      <button onclick="javascript:alert('deneme')">
        <img src="icons/search.png" />
      </button>
    </div>
  </nav>
  <div class="container">
    <h1>SORULAR</h1>
    <a href="question-pages/add.html" class="button">Soru Ekle</a>
    <hr />
    <table id="questions-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Başlık</th>
          <th>Zorluk</th>
          <th>Düzenle</th>
          <th>Sil</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <script>
    
    fetch('getQuestions.php')  
      .then(response => response.json())
      .then(data => {
        let questions = data;

        const tableBody = document.querySelector("#questions-table tbody");
        const searchBar = document.getElementById("search-bar");

        function renderTable(questionsToRender) {
          tableBody.innerHTML = "";
          if (questionsToRender.length > 0) {
            questionsToRender.forEach((question) => {
              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${question.id + 1}</td>
                <td>${question.title}</td>
                <td>${question.difficulty}</td>
                <td><a href='question-pages/customize.html?id=${question.id}'>Düzenle</a></td>
                <td><a href='question-pages/delete.php?id=${question.id}'>Sil</a></td>
              `;
              tableBody.appendChild(row);
            });
          } else {
            const noQuestionsMessage = document.createElement('tr');
            noQuestionsMessage.innerHTML = '<td colspan="5">Soru Bulunamadı.';
            tableBody.appendChild(noQuestionsMessage);
          }
        }

        function searchBarChange(value) {
          const searchTerm = value.toLowerCase();
          const filteredQuestions = questions.filter((question) =>
            question.title.toLowerCase().includes(searchTerm)
          );
          renderTable(filteredQuestions);
        }

        renderTable(questions);

        searchBar.addEventListener("input", function (event) {
          searchBarChange(event.target.value);
        });
      })
      .catch(error => {
        console.error("Verileri alırken hata oluştu:", error);
      });
  </script>
</body>
</html>
