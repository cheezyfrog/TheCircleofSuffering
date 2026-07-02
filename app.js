// 1. Expanded dataset with Spaced Repetition weights and VexFlow codes
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
let streak = 0;

const notationContainer = document.getElementById("notation-container");
const keyHintElement = document.getElementById("key-hint");
const optionsContainer = document.getElementById("options-container");
const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");
const feedbackElement = document.getElementById("feedback");

// 2. VexFlow Rendering Logic
function renderKeySignature(keyCode) {
    notationContainer.innerHTML = ""; // Clear out old render
    
    // Safety check if VexFlow didn't load properly
    if (typeof vexflow === 'undefined' && typeof VexFlow === 'undefined') {
        notationContainer.innerHTML = "<p style='color:red; padding: 20px;'>Notation Engine Offline</p>";
        return;
    }

    // Capture whichever naming convention the global window utilized
    const VF = typeof VexFlow !== 'undefined' ? VexFlow : vexflow;

    // Use the reliable Factory framework to draw everything automatically
    const factory = new VF.Factory({
        renderer: { elementId: 'notation-container', width: 300, height: 110 }
    });

    const system = factory.System({ width: 280 });

    system.addStave({ voices: [] })
          .addClef("treble")
          .addKeySignature(keyCode);

    factory.draw();
}

// 3. Spaced Repetition Selection Mechanics
function getWeightedRandomQuestion() {
    // Sum up total weights
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
    feedbackElement.innerText = "";
    
    currentQuestion = getWeightedRandomQuestion();
    
    // Help out the user by clarifying if we want Major or Minor name
    keyHintElement.innerText = `Type: ${currentQuestion.type}`;
    
    // Render sheet music dynamically via VexFlow
    renderKeySignature(currentQuestion.code);
    
    generateOptions(currentQuestion.name);
}

function generateOptions(correctAnswer) {
    optionsContainer.innerHTML = "";
    
    // Separate pools to make smart wrong answer configurations
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
        feedbackElement.innerText = "Correct! 🎯";
        feedbackElement.style.color = "green";
        currentQuestion.weight = Math.max(1, currentQuestion.weight - 3);
    } else {
        // Deduct a point, but use Math.max so the score never drops below 0
        score = Math.max(0, score - 1); 
        
        feedbackElement.innerText = `Incorrect! That was ${currentQuestion.name}.`;
        feedbackElement.style.color = "red";
        currentQuestion.weight += 10;
    }
    
    scoreElement.innerText = score;
    
    // Disable buttons so they can't spam clicks during the brief feedback window
    optionsContainer.querySelectorAll("button").forEach(btn => btn.disabled = true);
    setTimeout(nextQuestion, 1000); // 1-second delay before moving to next key
}
    
    
    // Freeze layout choice interactions momentarily for visualization buffer
    optionsContainer.querySelectorAll("button").forEach(btn => btn.disabled = true);
    setTimeout(nextQuestion, 1500);
}

// Initial game trigger point sequence
nextQuestion();
