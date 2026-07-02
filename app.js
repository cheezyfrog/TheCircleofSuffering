// 1. Data: A small sample of major/minor keys to start with
const keysDataset = [
    { name: "C Major", answer: "0 Sharps/Flats" },
    { name: "G Major", answer: "1 Sharp" },
    { name: "D Major", answer: "2 Sharps" },
    { name: "A Major", answer: "3 Sharps" },
    { name: "F Major", answer: "1 Flat" },
    { name: "B-flat Major", answer: "2 Flats" },
    { name: "A Minor", answer: "0 Sharps/Flats" },
    { name: "E Minor", answer: "1 Sharp" }
];

// 2. Variables to track game state
let currentQuestion = {};
let score = 0;
let streak = 0;

// 3. Grab HTML elements so JS can change them
const keyNameElement = document.getElementById("key-name");
const optionsContainer = document.getElementById("options-container");
const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");
const feedbackElement = document.getElementById("feedback");

// 4. Function to start a new question
function nextQuestion() {
    feedbackElement.innerText = ""; // Clear old feedback
    
    // Pick a random key from our dataset
    const randomIndex = Math.floor(Math.random() * keysDataset.length);
    currentQuestion = keysDataset[randomIndex];
    
    // Display the key name
    keyNameElement.innerText = currentQuestion.name;
    
    // Generate multiple choice options
    generateOptions(currentQuestion.answer);
}

// 5. Function to mix up answers and create buttons
function generateOptions(correctAnswer) {
    optionsContainer.innerHTML = ""; // Clear old buttons
    
    // Take a few random answers from our dataset to use as wrong options
    let options = [correctAnswer];
    while (options.length < 4) {
        let randomAnswer = keysDataset[Math.floor(Math.random() * keysDataset.length)].answer;
        if (!options.includes(randomAnswer)) {
            options.push(randomAnswer);
        }
    }
    
    // Shuffle the options so the correct answer isn't always first
    options.sort(() => Math.random() - 0.5);
    
    // Create HTML buttons for each option
    options.forEach(optionText => {
        const button = document.createElement("button");
        button.innerText = optionText;
        button.onclick = () => checkAnswer(optionText);
        optionsContainer.appendChild(button);
    });
}

// 6. Function to check if the user clicked the right answer
function checkAnswer(selectedAnswer) {
    if (selectedAnswer === currentQuestion.answer) {
        score++;
        streak++;
        feedbackElement.innerText = "Correct! 🎉";
        feedbackElement.style.color = "green";
    } else {
        streak = 0; // Reset streak on wrong answer
        feedbackElement.innerText = `Wrong! It's ${currentQuestion.answer}.`;
        feedbackElement.style.color = "red";
    }
    
    // Update the scoreboard numbers
    scoreElement.innerText = score;
    streakElement.innerText = streak;
    
    // Wait 1.5 seconds so the user can see feedback, then load next question
    setTimeout(nextQuestion, 1500);
}

// Start the game for the very first time
nextQuestion();
