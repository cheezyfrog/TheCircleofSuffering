const keysDataset = [
    { name: "C Major", code: "C", type: "Major", weight: 10 },
    { name: "G Major", code: "G", type: "Major", weight: 10 },
    { name: "D Major", code: "D", type: "Major", weight: 10 },
    { name: "A Major", code: "A", type: "Major", weight: 10 },
    { name: "E Major", code: "E", type: "Major", weight: 10 },
    { name: "B Major", code: "B", type: "Major", weight: 10 },
    { name: "F# Major", code: "F#", type: "Major", weight: 10 },
    { name: "C# Major", code: "C#", type: "Major", weight: 10 },
    { name: "F Major", code: "F", type: "Major", weight: 10 },
    { name: "Bb Major", code: "Bb", type: "Major", weight: 10 },
    { name: "Eb Major", code: "Eb", type: "Major", weight: 10 },
    { name: "Ab Major", code: "Ab", type: "Major", weight: 10 },
    { name: "Db Major", code: "Db", type: "Major", weight: 10 },
    { name: "Gb Major", code: "Gb", type: "Major", weight: 10 },
    { name: "Cb Major", code: "Cb", type: "Major", weight: 10 },
    { name: "A Minor", code: "Am", type: "Minor", weight: 10 },
    { name: "E Minor", code: "Em", type: "Minor", weight: 10 },
    { name: "B Minor", code: "Bm", type: "Minor", weight: 10 },
    { name: "F# Minor", code: "F#m", type: "Minor", weight: 10 },
    { name: "C# Minor", code: "C#m", type: "Minor", weight: 10 },
    { name: "G# Minor", code: "G#m", type: "Minor", weight: 10 },
    { name: "D# Minor", code: "D#m", type: "Minor", weight: 10 },
    { name: "A# Minor", code: "A#m", type: "Minor", weight: 10 },
    { name: "D Minor", code: "Dm", type: "Minor", weight: 10 },
    { name: "G Minor", code: "Gm", type: "Minor", weight: 10 },
    { name: "C Minor", code: "Cm", type: "Minor", weight: 10 },
    { name: "F Minor", code: "Fm", type: "Minor", weight: 10 },
    { name: "Bb Minor", code: "Bbm", type: "Minor", weight: 10 },
    { name: "Eb Minor", code: "Ebm", type: "Minor", weight: 10 },
    { name: "Ab Minor", code: "Abm", type: "Minor", weight: 10 }
];

let currentQuestion = {};
let score = 0;
let timeLeft = 60;
let timerInterval = null;
let gameActive = false;

// Load High Score from browser storage
let highScore = localStorage.getItem("keySignatureHighScore") || 0;

const notationContainer = document.getElementById("notation-container");
const keyHintElement = document.getElementById("key-hint");
const optionsContainer = document.getElementById("options-container");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");
const startButton = document.getElementById("start-btn");
const questionPrompt = document.getElementById("question-prompt");

// Initialize display elements
if (highScoreElement) highScoreElement.innerText = highScore;

// Hook up start button click event
if (startButton) startButton.onclick = startRound;

function startRound() {
    score = 0;
    timeLeft = 60;
    gameActive = true;
    if (scoreElement) scoreElement.innerText = score;
    if (timerElement) timerElement.innerText = timeLeft;
    if (feedbackElement) feedbackElement.innerText = "";
    if (questionPrompt) questionPrompt.innerText = "Identify this key signature:";
    if (startButton) startButton.style.display = "none";
    
    nextQuestion();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerElement) timerElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            endRound();
        }
    }, 1000);
}

function endRound() {
    gameActive = false;
    clearInterval(timerInterval);
    if (optionsContainer) optionsContainer.innerHTML = "";
    if (notationContainer) notationContainer.innerHTML = ""; 
    
    if (keyHintElement) keyHintElement.innerText = "Time's Up!";
    if (questionPrompt) questionPrompt.innerText = `You identified ${score} keys!`;
    
    if (score > highScore) {
