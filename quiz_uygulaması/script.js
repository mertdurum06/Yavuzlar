const questionElement = document.getElementById("question");
const soruButonu = document.getElementById("soru-butonu");
const ileriButton = document.getElementById("ileri");

const soruekleButton = document.getElementById("soru-ekle");
const sorusilButton = document.getElementById("soru-sil");
const sorulisteleButton = document.getElementById("soru-listele");
const soruListesiDiv = document.getElementById("soru-listesi");

let currentQuestionIndex = 0;
let score = 0;


function loadQuestions() {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
        return JSON.parse(storedQuestions);
    }
    return [
        {
            question: "Türkiye'nin başkenti neresidir?",
            answers: [
                { text: "Ankara", correct: true },
                { text: "Bursa", correct: false },
                { text: "Konya", correct: false },
                { text: "Diyarbakır", correct: false },
            ]
        },
        {
            question: "Alper Gezeravcı uzaya çıktığında ilk söylediği söz nedir?",
            answers: [
                { text: "Uzay çok güzel.", correct: false },
                { text: "İstikbal göklerdedir.", correct: true },
                { text: "Burada yaşam var.", correct: false },
                { text: "Tüm hackerlara selam olsun.", correct: false },
            ]
        },
        {
            question: "Siber Vatan Bootcamp 2024 yılında hangi ilimizde düzenlendi?",
            answers: [
                { text: "Van", correct: false },
                { text: "Mersin", correct: false },
                { text: "Tunceli", correct: false },
                { text: "Antalya", correct: true },
            ]
        },
        {
            question: "Yavuzların blog sayfasına nereden ulaşılır?",
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

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    ileriButton.innerHTML = "İleri";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

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
    ileriButton.innerHTML = "Play again";
    ileriButton.style.display = "block";
}

function handleİleriButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function addQuestion(questionText, answers) {
    questions.push({
        question: questionText,
        answers: answers,
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
        li.innerText = `${index + 1}. ${q.question}`;
        ul.appendChild(li);
    });
    soruListesiDiv.appendChild(ul);
}

ileriButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleİleriButton();
    } else {
        startQuiz();
    }
});

soruekleButton.addEventListener("click", () => {
    const questionText = prompt("Yeni soru metni:");
    const answers = [];

    for (let i = 0; i < 4; i++) {
        const answerText = prompt(`Cevap ${i + 1}:`);
        const isCorrect = confirm(`Bu cevap doğru mu?`);
        answers.push({ text: answerText, correct: isCorrect });
    }

    addQuestion(questionText, answers);
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

startQuiz();
