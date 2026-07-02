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
        highScore = score;
        localStorage.setItem("keySignatureHighScore", highScore);
        if (highScoreElement) highScoreElement.innerText = highScore;
        if (feedbackElement) {
            feedbackElement.innerText = "New Personal Best! 🎉";
            feedbackElement.style.color = "green";
        }
    } else {
        if (feedbackElement) {
            feedbackElement.innerText = "Good try! Practice makes perfect.";
            feedbackElement.style.color = "#555";
        }
    }
    
    if (startButton) {
        startButton.innerText = "PLAY AGAIN";
        startButton.style.display = "block";
    }
}

function renderKeySignature(keyCode) {
    if (!notationContainer) return;
    notationContainer.innerHTML = ""; 
    
    if (typeof vexflow === 'undefined' && typeof VexFlow === 'undefined') {
        notationContainer.innerHTML = "<p style='color:red; padding: 20px;'>Notation Engine Offline</p>";
        return;
    }

    const VF = typeof VexFlow !== 'undefined' ? VexFlow : vexflow;
    const factory = new VF.Factory({
        renderer: { elementId: 'notation-container', width: 300, height: 110 }
    });

    const system = factory.System({ width: 280 });
    system.addStave({ voices: [] }).addClef("treble").addKeySignature(keyCode);
    factory.draw();
}

// Spaced Repetition Selection Mechanics
function getWeightedRandomQuestion() {
    const totalWeight = keysDataset.reduce((sum, item) => sum + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (let i = 0; i < keysDataset.length; i++) {
        randomNum -= keysDataset[i].weight;
        if (randomNum <= 0) {
            return keysDataset[i];
        }
    }
    return keysDataset[0];
}

function nextQuestion() {
    if (!gameActive) return;
    if (feedbackElement) feedbackElement.innerText = "";
    currentQuestion = getWeightedRandomQuestion();
    if (keyHintElement) keyHintElement.innerText = `Type: ${currentQuestion.type}`;
    renderKeySignature(currentQuestion.code);
    generateOptions(currentQuestion.name);
}

function generateOptions(correctAnswer) {
    if (!optionsContainer) return;
    optionsContainer.innerHTML = "";
    let potentialWrongOptions = keysDataset.filter(k => k.name !== correctAnswer && k.type === currentQuestion.type);
    
    let options = [correctAnswer];
    while (options.length < 4 && potentialWrongOptions.length > 0) {
        let randIndex = Math.floor(Math.random() * potentialWrongOptions.length);
        let optionName = potentialWrongOptions[randIndex].name;
        if (!options.includes(optionName)) {
            options.push(optionName);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(optionText => {
        const button = document.createElement("button");
        button.innerText = optionText;
        button.onclick = () => checkAnswer(optionText);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedAnswer) {
    if (!gameActive) return;

    if (selectedAnswer === currentQuestion.name) {
        score++;
        if (feedbackElement) {
            feedbackElement.innerText = "Correct! 🎯";
            feedbackElement.style.color = "green";
        }
        currentQuestion.weight = Math.max(1, currentQuestion.weight - 3);
    } else {
        // Point deduction with safety floor at 0
        score = Math.max(0, score - 1); 
        if (feedbackElement) {
            feedbackElement.innerText = `Incorrect! That was ${currentQuestion.name}.`;
            feedbackElement.style.color = "red";
        }
        currentQuestion.weight += 10;
    }
    
    if (scoreElement) scoreElement.innerText = score;
    
    if (optionsContainer) {
        optionsContainer.querySelectorAll("button").forEach(btn => btn.disabled = true);
    }
    setTimeout(nextQuestion, 1000);
}

// Initialize the data pool silently so the start function is ready
currentQuestion = getWeightedRandomQuestion();

// Set initial screen state waiting for user trigger
if (notationContainer) {
    notationContainer.innerHTML = "<p style='color:#888; font-weight: 500; padding: 40px 20px;'>Press Start to Begin</p>";
}
if (optionsContainer) {
    optionsContainer.innerHTML = "";
}
