class QuestionPackage{
    constructor(id, title, question, optionA, optionB, optionC, optionD, correctOption, difficulty){
        this.id = id;
        this.title = title;
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOption = correctOption;
        this.difficulty = difficulty;
    }

    get Id(){
        return this.id;
    }
    get Title(){
        return this.title;
    }
    get Difficulty(){
        return this.difficulty;
    }

    get Question(){
        return this.question;
    }
    get Options(){
        return [this.optionA, this.optionB, this.optionC, this.optionD];
    }
    get CorrectOption(){
        return this.correctOption;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            question: this.question,
            optionA: this.optionA,
            optionB: this.optionB,
            optionC: this.optionC,
            optionD: this.optionD,
            correctOption: this.correctOption,
            difficulty: this.difficulty
        };
    }
}

questions = JSON.parse(localStorage.getItem('questions')) || [];

function addQuestion(event) {
    event.preventDefault(); 
  
    const form = event.target;
    const formData = new FormData(form);
  
    fetch('../quest-app-task-2/question-pages/addQuestionToDatabase.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(result => {
      alert(result); 
      window.location.href = '../admin-panel.php';
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }


  function addQuestion(event) {
    event.preventDefault(); 
  
    const form = event.target;
    const formData = new FormData(form);

    
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    
    const questionPackage = new QuestionPackage(
        formObject.id, 
        formObject.T,
        formObject.Q,
        formObject.A,
        formObject.B,
        formObject.C,
        formObject.D,
        formObject.correctOption, 
        formObject.difficulty
    );

    
    const questionJSON = questionPackage.toJSON();

    
    fetch('../quest-app-task-2/question-pages/addQuestionToDatabase.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionJSON)
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        window.location.href = '../admin-panel.php';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
