const timeDisplay = document.getElementById('time-display');
const scoreDisplay = document.getElementById('score-display');
const bestDisplay = document.getElementById('best-display');
const notationContainer = document.getElementById('notation-container');
const keyTypeDisplay = document.getElementById('key-type');
const optionsContainer = document.getElementById('options-container');
const startButton = document.getElementById('start-button');

let timer = null, timeLeft = 60, score = 0, currentAnswer = '', isRoundActive = false;
let highScore = localStorage.getItem('suffering-highscore') || 0;
bestDisplay.textContent = highScore;

const keySignatures = [
  { name: 'C Major', type: 'Major', spec: [] }, { name: 'G Major', type: 'Major', spec: ['F'] },
  { name: 'D Major', type: 'Major', spec: ['F', 'C'] }, { name: 'A Major', type: 'Major', spec: ['F', 'C', 'G'] },
  { name: 'E Major', type: 'Major', spec: ['F', 'C', 'G', 'D'] }, { name: 'B Major', type: 'Major', spec: ['F', 'C', 'G', 'D', 'A'] },
  { name: 'F# Major', type: 'Major', spec: ['F', 'C', 'G', 'D', 'A', 'E'] }, { name: 'C# Major', type: 'Major', spec: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] },
  { name: 'F Major', type: 'Major', spec: ['B'] }, { name: 'Bb Major', type: 'Major', spec: ['B', 'E'] },
  { name: 'Eb Major', type: 'Major', spec: ['B', 'E', 'A'] }, { name: 'Ab Major', type: 'Major', spec: ['B', 'E', 'A', 'D'] },
  { name: 'Db Major', type: 'Major', spec: ['B', 'E', 'A', 'D', 'G'] }, { name: 'Gb Major', type: 'Major', spec: ['B', 'E', 'A', 'D', 'G', 'C'] },
  { name: 'Cb Major', type: 'Major', spec: ['B', 'E', 'A', 'D', 'G', 'C', 'F'] }, { name: 'A Minor', type: 'Minor', spec: [] },
  { name: 'E Minor', type: 'Minor', spec: ['F'] }, { name: 'B Minor', type: 'Minor', spec: ['F', 'C'] },
  { name: 'F# Minor', type: 'Minor', spec: ['F', 'C', 'G'] }, { name: 'C# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D'] },
  { name: 'G# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D', 'A'] }, { name: 'D# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D', 'A', 'E'] },
  { name: 'A# Minor', type: 'Minor', spec: ['F', 'C', 'G', 'D', 'A', 'E', 'B'] }, { name: 'D Minor', type: 'Minor', spec: ['B'] },
  { name: 'G Minor', type: 'Minor', spec: ['B', 'E'] }, { name: 'C Minor', type: 'Minor', spec: ['B', 'E', 'A'] },
  { name: 'F Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D'] }, { name: 'Bb Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D', 'G'] },
  { name: 'Eb Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D', 'G', 'C'] }, { name: 'Ab Minor', type: 'Minor', spec: ['B', 'E', 'A', 'D', 'G', 'C', 'F'] }
];

function renderStaff(specArray) {
  if (typeof Vex === 'undefined') throw new Error("VexFlow not loaded");
  notationContainer.innerHTML = '';
  const renderer = new Vex.Flow.Renderer(notationContainer, Vex.Flow.Renderer.Backends.SVG);
  renderer.resize(300, 150);
  const stave = new Vex.Flow.Stave(10, 20, 280);
  stave.setContext(renderer.getContext());
  stave.addClef(Math.random() > 0.5 ? 'treble' : 'bass');
  if (specArray.length > 0) {
    let keyName = currentAnswer.split(' ')[0];
    if (currentAnswer.includes('Minor')) keyName += 'm';
    stave.addKeySignature(keyName);
  }
  stave.draw();
}

function generateQuestion() {
  optionsContainer.innerHTML = '';
  const correctKey = keySignatures[Math.floor(Math.random() * keySignatures.length)];
  currentAnswer = correctKey.name;
  keyTypeDisplay.textContent = correctKey.type;
  try {
    renderStaff(correctKey.spec);
  } catch (e) {
    console.error("VexFlow Critical Error:", e);
    notationContainer.innerHTML = '<div style="color:red;">Error: ' + e.message + '</div>';
  }
  let wrongCandidates = keySignatures.filter(k => k.name !== currentAnswer && k.type === correctKey.type);
  let shuffledWrong = wrongCandidates.sort(() => 0.5 - Math.random()).slice(0, 3);
  let choices = [correctKey, ...shuffledWrong].sort(() => 0.5 - Math.random());
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = choice.name;
    btn.onclick = () => {
      if (choice.name === currentAnswer) score++;
      else if (score > 0) score--;
      scoreDisplay.textContent = score;
      generateQuestion();
    };
    optionsContainer.appendChild(btn);
  });
}

function startRound() {
  if (isRoundActive) return;
  isRoundActive = true; score = 0; timeLeft = 60;
  scoreDisplay.textContent = score; timeDisplay.textContent = '60s';
  startButton.style.display = 'none';
  generateQuestion();
  timer = setInterval(() => {
    timeLeft--; timeDisplay.textContent = timeLeft + 's';
    if (timeLeft <= 0) {
      clearInterval(timer); isRoundActive = false;
      if (score > highScore) { highScore = score; localStorage.setItem('suffering-highscore', highScore); bestDisplay.textContent = highScore; }
      notationContainer.innerHTML = 'Time Up!'; optionsContainer.innerHTML = ''; startButton.style.display = 'block';
    }
  }, 1000);
}

startButton.addEventListener('click', startRound);
