// 1. Core DOM Element Selectors
const timeDisplay = document.getElementById('time-display');
const scoreDisplay = document.getElementById('score-display');
const bestDisplay = document.getElementById('best-display');
const notationContainer = document.getElementById('notation-container');
const statusMessage = document.getElementById('status-message');
const keyTypeDisplay = document.getElementById('key-type');
const optionsContainer = document.getElementById('options-container');
const startButton = document.getElementById('start-button');

// 2. Game State Variables
let timer = null;
let timeLeft = 60;
let score = 0;
let currentAnswer = '';
let isRoundActive = false;

// Load the historical high score from the browser storage
let highScore = localStorage.getItem('suffering-highscore') || 0;
bestDisplay.textContent = highScore;

// 3. Complete Music Theory Database (Major and Minor Key Signatures)
const keySignatures = [
  { name: 'C Major', type: 'Major', spec: [] },
  { name: 'G Major', type: 'Major', spec: ['F'] },
  { name: 'D Major', type: 'Major', spec: ['F', 'C'] },
  { name: 'A Major', type: 'Major', spec: ['F', 'C', 'G'] },
  { name: 'E Major', type: 'Major', spec: ['F', 'C', 'G', 'D'] },
  { name: 'B Major', type: 'Major', spec: ['F', 'C', 'G', 'D', 'A'] },
  { name: 'F# Major', type: 'Major', spec: ['F', 'C', 'G', 'D', 'A', 'E'] },
  { name: 'C# Major', type: 'Major', spec: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] },
  { name: 'F Major', type: 'Major', spec: ['B'] },
  { name: 'Bb Major', type: 'Major', spec: ['B', 'E'] },
  { name: 'Eb Major', type: 'Major', spec: ['B', 'E', 'A'] },
  { name: 'Ab Major', type: 'Major', spec: ['B', 'E', 'A', 'D'] },
  { name: 'Db Major', type: 'Major', spec: ['B', 'E', 'A', 'D', 'G'] },
  { name: 'Gb Major', type: 'Major', spec: ['B', 'E', 'A', 'D', 'G', 'C'] },
  { name: 'Cb Major', type: 'Major', spec: ['B', 'E', 'A', 'D', 'G', 'C', 'F'] },
  { name: 'A Minor', type: 'Minor', spec: [] },
  { name: 'E Minor', type: 'Minor', spec: ['F'] },
  { name: 'B Minor', type: 'Minor', spec: ['F', 'C'] },
  { name: 'F# Minor', type: 'Minor', spec: ['F', 'C', 'G'] },
  { name: 'C# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D'] },
  { name: 'G# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D', 'A'] },
  { name: 'D# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D', 'A', 'E'] },
  { name: 'A# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] },
  { name: 'D Minor', type: 'Minor', spec: ['B'] },
  { name: 'G Minor', type: 'Minor', spec: ['B', 'E'] },
  { name: 'C Minor', type: 'Minor', spec: ['B', 'E', 'A'] },
  { name: 'F Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D'] },
  { name: 'Bb Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D', 'G'] },
  { name: 'Eb Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D', 'G', 'C'] },
  { name: 'Ab Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D', 'G', 'C', 'F'] }
];

// 4. Game Action Functions
function startRound() {
  if (isRoundActive) return;
  
  isRoundActive = true;
  score = 0;
  timeLeft = 60;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft + 's';
  startButton.style.display = 'none';
  
  if (statusMessage) statusMessage.style.display = 'none';
  
  generateQuestion();
  
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft + 's';
    
    if (timeLeft <= 0) {
      endRound();
    }
  }, 1000);
}

function endRound() {
  clearInterval(timer);
  isRoundActive = false;
  
  // Wipe notation canvas and clear choices
  notationContainer.innerHTML = '<div id="status-message">Time Up!</div>';
  optionsContainer.innerHTML = '';
  
  // Manage high score calculations
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('suffering-highscore', highScore);
    bestDisplay.textContent = highScore;
  }
  
  startButton.textContent = 'TRY AGAIN';
  startButton.style.display = 'block';
}

function generateQuestion() {
  optionsContainer.innerHTML = '';
  
  // Pick a random key signature card
  const correctKey = keySignatures[Math.floor(Math.random() * keySignatures.length)];
  currentAnswer = correctKey.name;
  keyTypeDisplay.textContent = correctKey.type;
  
  // Safely trigger VexFlow rendering inside a try/catch guard
  try {
    renderStaff(correctKey.spec);
  } catch (error) {
    console.error("VexFlow Rendering Crash:", error);
    notationContainer.innerHTML = '<div id="status-message" class="error-msg" style="color:red; font-weight:bold;">Notation Engine Offline</div>';
  }
  
  // Gather matching wrong choice candidates
  let wrongCandidates = keySignatures.filter(k => k.name !== currentAnswer && k.type === correctKey.type);
  let shuffledWrong = wrongCandidates.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // Group, randomize order, and construct multiple choice elements
  let finalChoices = [correctKey, ...shuffledWrong].sort(() => 0.5 - Math.random());
  
  finalChoices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = choice.name;
    btn.addEventListener('click', () => handleAnswer(choice.name));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedName) {
  if (!isRoundActive) return;
  
  if (selectedName === currentAnswer) {
    score++;
    scoreDisplay.textContent = score;
  } else {
    // Optional point deduction penalty for wrong selections
    if (score > 0) score--;
    scoreDisplay.textContent = score;
  }
  
  generateQuestion();
}

// 5. The VexFlow Render Pipeline
function renderStaff(specArray) {
  // Clear any existing canvasses out of the way
  const oldCanvas = notationContainer.querySelector('canvas');
  if (oldCanvas) oldCanvas.remove();
  
  const { Renderer, Stave, StaveModifier } = vexflow.Flow;
  
  // Build drawing surface
  const renderer = new Renderer(notationContainer, Renderer.Backends.CANVAS);
  renderer.resize(300, 150);
  const context = renderer.getContext();
  
  // Render clean white staff lines on clear canvas structure
  const stave = new Stave(10, 20, 280);
  stave.setContext(context);
  
  // Alternate clefs for random variety
  const chosenClef = Math.random() > 0.5 ? 'treble' : 'bass';
  stave.addClef(chosenClef);
  
  // Add key signature layout modifiers if accidental steps exist
  if (specArray.length > 0) {
    // Generate an official VexFlow spec text mapping format (e.g. "Eb", "F#")
    let lookUpName = currentAnswer.split(' ')[0];
    stave.addKeySignature(lookUpName);
  }
  
  stave.draw();
}

// 6. Bind Launch Button Event Listeners
startButton.addEventListener('click', startRound);
