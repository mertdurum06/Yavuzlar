const questionElement = document.getElementById("question");
const soruButonu = document.getElementById("soru-butonu");
const ileriButton = document.getElementById("ileri");
const soruekleButton = document.getElementById("soru-ekle");
const sorusilButton = document.getElementById("soru-sil");
const sorulisteleButton = document.getElementById("soru-listele");
const soruListesiDiv = document.getElementById("soru-listesi");

document.getElementById("kolay").addEventListener("click", () => startQuiz("kolay"));
document.getElementById("orta").addEventListener("click", () => startQuiz("orta"));
document.getElementById("zor").addEventListener("click", () => startQuiz("zor"));

let currentQuestionIndex = 0;
let score = 0;
let filteredQuestions = [];


function loadQuestions() {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
        return JSON.parse(storedQuestions);
    }
    return [
        {
            question: "Türkiye'nin başkenti neresidir?",
            difficulty: "kolay",
            answers: [
                { text: "Ankara", correct: true },
                { text: "Bursa", correct: false },
                { text: "Konya", correct: false },
                { text: "Diyarbakır", correct: false },
            ]
        },
        {
            question: "Alper Gezeravcı uzaya çıktığında ilk söylediği söz nedir?",
            difficulty: "orta",
            answers: [
                { text: "Uzay çok güzel.", correct: false },
                { text: "İstikbal göklerdedir.", correct: true },
                { text: "Burada yaşam var.", correct: false },
                { text: "Tüm hackerlara selam olsun.", correct: false },
            ]
        },
        {
            question: "Siber Vatan Bootcamp 2024 yılında hangi ilimizde düzenlendi?",
            difficulty: "zor",
            answers: [
                { text: "Van", correct: false },
                { text: "Mersin", correct: false },
                { text: "Tunceli", correct: false },
                { text: "Antalya", correct: true },
            ]
        },
        {
            question: "Yavuzların blog sayfasına nereden ulaşılır?",
            difficulty: "zor",
            answers: [
                { text: "instagram.yavuzlar", correct: false },
                { text: "twitter.yavuzlar", correct: false },
                { text: "telegram.yavuzlar", correct: false },
                { text: "docs.yavuzlar", correct: true },
            ]
        }
    ];
}

const questions = loadQuestions();


function saveQuestions() {
    localStorage.setItem('questions', JSON.stringify(questions));
}


function startQuiz(selectedDifficulty) {
    currentQuestionIndex = 0;
    score = 0;
    ileriButton.innerHTML = "İleri";
    filteredQuestions = filterQuestionsByDifficulty(selectedDifficulty);

    if (filteredQuestions.length === 0) {
        questionElement.innerHTML = "Seçilen zorluk seviyesinde soru bulunamadı.";
        resetState();
        ileriButton.style.display = "block";
        return;
    }

    shuffleQuestions();
    showQuestion();
}


function showQuestion() {
    resetState();
    let currentQuestion = filteredQuestions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        soruButonu.appendChild(button);
        button.dataset.correct = answer.correct ? "true" : "false";
        button.addEventListener("click", selectAnswer);
    });
}


function resetState() {
    ileriButton.style.display = "none";
    while (soruButonu.firstChild) {
        soruButonu.removeChild(soruButonu.firstChild);
    }
}


function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score += 10;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(soruButonu.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    ileriButton.style.display = "block";
}


function showScore() {
    resetState();
    questionElement.innerHTML = `Skorun: ${score}`;
    ileriButton.innerHTML = "Tekrar oyna";
    ileriButton.style.display = "block";
}

function handleİleriButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < filteredQuestions.length) {
        showQuestion();
    } else {
        showScore();
    }
}


function addQuestion(questionText, answers, difficulty) {
    questions.push({
        question: questionText,
        answers: answers,
        difficulty: difficulty
    });
    saveQuestions(); 
    alert("Yeni soru eklendi!");
    listQuestions(); 
}


function deleteQuestion(index) {
    if (index >= 0 && index < questions.length) {
        questions.splice(index, 1);
        saveQuestions(); 
        alert("Soru silindi!");
        listQuestions(); 
    } else {
        alert("Geçersiz soru numarası.");
    }
}


function listQuestions() {
    soruListesiDiv.innerHTML = ""; 
    const ul = document.createElement("ul");
    questions.forEach((q, index) => {
        const li = document.createElement("li");
        li.innerText = `${index + 1}. ${q.question} (Zorluk: ${q.difficulty || "Belirtilmemiş"})`;
        ul.appendChild(li);
    });
    soruListesiDiv.appendChild(ul);
}


function filterQuestionsByDifficulty(difficulty) {
    return questions.filter(question => question.difficulty === difficulty);
}


function shuffleQuestions() {
    filteredQuestions.sort(() => Math.random() - 0.5);
}

ileriButton.addEventListener("click", () => {
    if (currentQuestionIndex < filteredQuestions.length) {
        handleİleriButton();
    } else {
        startQuiz("kolay");  
    }
});


soruekleButton.addEventListener("click", () => {
    const questionText = prompt("Yeni soru metni:");
    const answers = [];
    const difficulty = prompt("Zorluk derecesini girin (kolay, orta, zor):").toLowerCase();

    for (let i = 0; i < 4; i++) {
        const answerText = prompt(`Cevap ${i + 1}:`);
        const isCorrect = confirm(`Bu cevap doğru mu?`);
        answers.push({ text: answerText, correct: isCorrect });
    }

    addQuestion(questionText, answers, difficulty);
});


sorusilButton.addEventListener("click", () => {
    const index = parseInt(prompt("Silmek istediğiniz sorunun numarasını girin:")) - 1;
    if (!isNaN(index)) {
        deleteQuestion(index);
    } else {
        alert("Geçersiz giriş.");
    }
});


sorulisteleButton.addEventListener("click", listQuestions);
