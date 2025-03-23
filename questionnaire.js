const fs = require('fs');

let questions = [];
try {
  const questionsData = fs.readFileSync('question.json', 'utf8');
  questions = JSON.parse(questionsData);
} catch (error) {
  console.error("Erreur lors de la lecture du fichier questions.json:", error);
  console.log("Création d'un fichier questions.json par défaut...");
  
  fs.writeFileSync('question.json', JSON.stringify(questions, null, 2));
}

const responses = [];
let currentQuestion = 0;

process.stdout.write(questions[currentQuestion]);

process.stdin.on("data", (data) => {
  const response = data.toString().trim();
  responses.push(response);
  
  currentQuestion++;
  
  if (currentQuestion < questions.length) {
    process.stdout.write(questions[currentQuestion]);
  } else {
    console.log("\nRésumé de vos réponses:");
    for (let i = 0; i < questions.length; i++) {
      const questionText = questions[i].replace(/\s*\?\s*$/, "");
      console.log(`${questionText}: ${responses[i]}`);
    }
    
    const responseObject = {};
    for (let i = 0; i < questions.length; i++) {
      const key = questions[i].replace(/\s*\?\s*$/, "").toLowerCase().replace(/\s+/g, "_");
      responseObject[key] = responses[i];
    }
    
    let allResponses = [];
    try {
      if (fs.existsSync('reponses.json')) {
        allResponses = JSON.parse(fs.readFileSync('reponses.json', 'utf8'));
      }
    } catch (error) {
    }
    
    allResponses.push(responseObject);
    
    fs.writeFileSync('reponses.json', JSON.stringify(allResponses, null, 2));
    console.log("\nVos réponses ont été enregistrées dans reponses.json");
    
    process.exit();
  }
});