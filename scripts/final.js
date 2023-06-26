import placeholderQuestions from "./placeholder-questions.js";
const submit = document.querySelector('.submit-button');
const betButton = document.querySelector('.bet-button');
const wagerInput = document.querySelector('.final-input');
let playerTurn = document.getElementsByClassName("player-turn")[0];
let modal = document.querySelector('.modal')
let url = window.location.href;
let params = new URL(url).searchParams;
let currentPlayer
class Player {
    constructor(id, name, scoreElement, score) {
        this.id = document.querySelector(id);
        this.idElement = name
        this.id.textContent = name
        this.scoreElement = document.querySelector(scoreElement);
        this.score = score
        this.scoreElement.textContent = this.score;
        console.log(score)
    }

    addScore(score) {
        this.score += score;
        console.log(this.score);
        this.scoreElement.textContent = this.score;
    }
}

// Get player names and score from URL parameters
let name1 = params.get("name1") || "Player1";
let name2 = params.get("name2") || "Player2";
let player1Score = parseInt(params.get("score1")) || 0;
let player2Score = parseInt(params.get("score2")) || 0;


// Create an array of player objects
const players = [
    new Player("#player1", name1, "#score1", player1Score),
    new Player("#player2", name2, "#score2", player2Score)
];

currentPlayer = players[0]
let finalQ = placeholderQuestions.find(q => q.category === "Final")
let question = finalQ.question
let answer = finalQ.answer


function showModal(toDisplay) {
    let modalContent = document.querySelector(".modal p");
    modal.style.display = "block";
    modalContent.innerHTML = "<p>" + toDisplay + "</p>";
    modal.backdrop = "static";


}

function showPlayerTurn() {
    playerTurn.innerHTML = "<h3>It's " + currentPlayer.id.textContent + " turn to Choose</h3>";
}
addEventListener("load", () => {
    showPlayerTurn()
});
function switchPlayers() {
    currentPlayer = (currentPlayer.idElement === players[0].idElement) ? players[1] : players[0]
}

let count = 0;
let player1Wager, player2Wager;
//let userInput
betButton.addEventListener("click", (e) => {
    e.preventDefault()
    if (betButton.textContent === "ANSWER"){
        showModal(`${question}`)
    }else{
        showModal("Enter your wager")
    }
})

function closeModal() {
    modal.style.display = "none";
}

submit.addEventListener("click", (e) => {
    let userInput = wagerInput.value;

    if(betButton.textContent === "ANSWER" ){
        if(currentPlayer.idElement == players[0].idElement){
            if(userInput.toLowerCase() === answer.toLocaleLowerCase()){
                currentPlayer.addScore(player1Wager);
                switchPlayers();
                showPlayerTurn();
                count++
                
            }else{
                currentPlayer.addScore(- player1Wager);
                switchPlayers();
                showPlayerTurn();
                count++
                
            }
        }else {
            if(userInput.toLowerCase()=== answer.toLocaleLowerCase()){
                currentPlayer.addScore(player2Wager);
                switchPlayers();
                count++
                
            }else{
                currentPlayer.addScore(- player2Wager);
                switchPlayers();
                count++
                
            }

        }
        wagerInput.value = ""
        closeModal();
        findWinner(count)
        return
    }

    userInput = parseInt(userInput);

    if (isNaN(userInput)) {
        alert("Please enter a number");
        return;
    }

    if (userInput > currentPlayer.score) {
        alert("Please enter a wager less than your score");
        return;
    }

    if (currentPlayer === players[0]) {
        player1Wager = userInput;
        switchPlayers();
        showPlayerTurn()
    } else {
        player2Wager = userInput;
        switchPlayers();
        showPlayerTurn()
        betButton.textContent = "ANSWER";
    }
    wagerInput.value = ""
    closeModal();
})

function findWinner(cnt){
    console.log(`${players[0].idElement} and ${players[1].idElement}`)
    if (cnt === 2){
        if(players[0].score > players[1].score){
            alert(`${players[0].idElement} is the winner!!!`)
        }else{
            alert(`${players[1].idElement} is the winner!!!`)
        }
        betButton.disabled = true;
    }
}