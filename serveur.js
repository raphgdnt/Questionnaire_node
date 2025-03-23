const http = require('http');
const fs = require('fs');
const PORT = 3000;
const server = http.createServer((req, res) => {
  const url = req.url;

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Visualisation des données</title>
        </head>
        <body>
          <h1>Questionnaire</h1>
          <div class="container">
            <div class="box">
              <h2>question.json</h2>
              <pre id="question"></pre>
            </div>
            <div class="box">
              <h2>reponses.json</h2>
              <pre id="reponses"></pre>
            </div>
          </div>

          <script>
            // Fonction simple pour charger un fichier JSON
            function chargerJSON(url, elementId) {
              fetch(url)
                .then(response => response.json())
                .then(data => {
                  document.getElementById(elementId).textContent = JSON.stringify(data, null, 2);
                })
                .catch(error => {
                  document.getElementById(elementId).textContent = "Erreur: " + error.message;
                });
            }

            // Chargement des fichiers
            chargerJSON('/node/question', 'question');
            chargerJSON('/node/reponses', 'reponses');
          </script>
        </body>
      </html>
    `);
  }

  else if (url === '/node/question') {
    servirFichierJSON('question.json', res);
  }

  else if (url === '/node/reponses') {
    servirFichierJSON('reponses.json', res);
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page non trouvée');
  }
});

function servirFichierJSON(nomFichier, res) {
  fs.readFile(nomFichier, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ erreur: `Fichier ${nomFichier} non trouvé ou illisible` }));
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});