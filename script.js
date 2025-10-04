// Features:
// - Milliseconds (displayed as 3 digits)
// - Prevents multiple intervals from starting
// - Responsive-friendly
// - Theme toggle with localStorage persistence

// Get DOM elements
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const stopBtn  = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const themeToggle = document.getElementById('theme-toggle');

let intervalId = null;      // reference to setInterval
let startTime = 0;          // timestamp when timer started (ms)
let elapsedBefore = 0;      // elapsed time before current run (ms)
const tick = 10;            // update every 10 ms for smooth milliseconds

// Format time helper: returns "HH:MM:SS:MSMS"
function pad(number, length=2){
  return String(number).padStart(length, '0');
}
function formatTime(totalMs){
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = totalMs % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${String(milliseconds).padStart(3,'0')}`;
}

// Update display from elapsed ms
function render(ms){
  display.textContent = formatTime(ms);
}

// Start button handler
startBtn.addEventListener('click', function(){
  // If already running, do nothing (prevents multiple setInterval)
  if (intervalId !== null) return;

  // set start time relative to already elapsed time so it resumes correctly
  startTime = Date.now() - elapsedBefore;

  // start interval
  intervalId = setInterval(function(){
    const now = Date.now();
    const elapsed = now - startTime;
    render(elapsed);
  }, tick);
});

// Stop button handler
stopBtn.addEventListener('click', function(){
  if (intervalId === null) return; // not running
  // compute elapsedBefore and clear interval
  const now = Date.now();
  elapsedBefore = now - startTime;
  clearInterval(intervalId);
  intervalId = null;
});

// Reset button handler
resetBtn.addEventListener('click', function(){
  // stop if running
  if (intervalId !== null){
    clearInterval(intervalId);
    intervalId = null;
  }
  // reset times and display
  startTime = 0;
  elapsedBefore = 0;
  render(0);
});

// THEME TOGGLE: simple dark/light using body[data-theme]
// Save choice in localStorage so it persists between reloads
function setTheme(theme){
  if (theme === 'dark'){
    document.body.setAttribute('data-theme','dark');
    themeToggle.textContent = '🌞';
  } else {
    document.body.removeAttribute('data-theme');
    themeToggle.textContent = '🌗';
  }
  localStorage.setItem('stopwatch-theme', theme);
}

// Toggle button event
themeToggle.addEventListener('click', function(){
  const current = localStorage.getItem('stopwatch-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

// On load, apply saved theme (if any)
(function init(){
  const saved = localStorage.getItem('stopwatch-theme') || 'light';
  setTheme(saved);
  render(0); // initialize display
})();
