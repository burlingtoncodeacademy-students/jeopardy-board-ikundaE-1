import placeholderQuestions from "./placeholder-questions.js";

const categories = [...new Set(placeholderQuestions.map((question) => question.category))].slice(0, 6);

const thElements = document.querySelectorAll("table th");
thElements.forEach((th, index) => {
    th.textContent = categories[index];
});

let playerTurn = document.getElementsByClassName("player-turn")[0];
let submit = document.querySelector(".guess-button");
let pass = document.querySelector(".pass-button");
const tds = document.querySelectorAll("table td");
const modal = document.querySelector(".modal");
let selectedTds = [];
let selectedTd
let currentPlayer
let question = ""; // Declare the question variable
let answer
let selectedQuestions = [];

class Player {
    constructor(name, id) {
        this.name = name;
        this.id = document.querySelector(id);
        this.score = 0;
    }

    addScore(score) {
        console.log("the score before:" + this.score)
        this.score += score;
        console.log("the score after:" + this.score)
        this.id.textContent = this.score;
        console.log(score)
    }
}

const players = [
    new Player("Player 1", "#player1"),
    new Player("Player 2", "#player2"),
];

currentPlayer = players[0]
function showPlayerTurn() {
    playerTurn.innerHTML = "<h3>It's " + currentPlayer.name + " turn to Choose</h3>";
}

function disableButtons() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.disabled = true;
    });
}

function handleAnswer(inputValue) {

    let pointsFromCard = parseInt(selectedTd.textContent, 10);

    if (inputValue.toLowerCase() === answer.toLowerCase()) {
        currentPlayer.addScore(pointsFromCard);
        closeModal()
        return true;
    } else {
        currentPlayer.addScore(- parseInt(selectedTd.textContent, 10));
        currentPlayer = (currentPlayer.name === players[0].name) ? players[1] : players[0]
        showPlayerTurn()
        //alert("Player turn switched")
        closeModal()
    }
}

function handleClick(currentTd) {
    const columnCategory = currentTd.closest("table").querySelectorAll("th")[currentTd.cellIndex].textContent;
    let nextQuestion = placeholderQuestions.find((q) => {
        if (q.category === columnCategory) {
            return !selectedQuestions.some((selected) => selected.question === q.question);
        }
        return false;
    });
    if (!nextQuestion) {
        alert("All questions in this category have been picked before!");
        return;
    }

    question = nextQuestion.question;
    answer = nextQuestion.answer;
    console.log(answer)
    selectedQuestions.push(nextQuestion);
    currentTd.style.color = "white";
    selectedTds.push(currentTd);
}

function enableButtons() {
    submit.textContent = "SUBMIT";
    submit.disabled = false;
}

function showModal() {
    let modalContent = document.querySelector(".modal p");
    modal.style.display = "block";
    modalContent.innerHTML = "<p>" + question + "</p>";
    modal.backdrop = "static";

}


addEventListener("load", () => {
    showPlayerTurn();
    disableButtons();
});
let modalDisplayed = false;

let input = document.querySelector('.answer-input');
tds.forEach((td) => {
    td.addEventListener("click", () => {
        pass.disabled = false;
        if (!selectedTds.includes(td)) {
            handleClick(td)
            selectedTd = td
        } else {
            alert(`This ${td} card has already been selected.`);
            return;
        }
        //showModal()
        let isItTheEnd = endRound()
        if (!isItTheEnd){
            showModal()
        }
    })
});

input.addEventListener('input', function () {
    if (input.value.length > 0) {
        enableButtons()
    }
});

submit.addEventListener("click", () => {
    let inputValue = input.value;
    handleAnswer(inputValue);
    console.log("this step")
    input.value = ""
    closeModal()
})

pass.addEventListener("click", () => {
    currentPlayer = (currentPlayer.name === players[0].name) ? players[1] : players[0]
    showPlayerTurn()
})
function closeModal() {
    modal.style.display = "none";
    console.log("close modal")
}

function endRound() {
    let scores = players.map((player) => player.score);
    if (scores.some((score) => score >= 700) || selectedTds.length >= 5) {
        alert("The game is over! Please proceed to Round 2.");
        let next = document.querySelector(".next-round")
        next.disabled = false;
        next.addEventListener('click', evt => {
            evt.preventDefault();
            document.location = `./round-2.html?score1=${players[0].score}&score2=${players[1].score}&name1=${players[0].name}&name2=${players[1].name}`;
        })
        return true
    }
    return false
}