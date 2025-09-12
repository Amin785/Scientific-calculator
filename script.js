const display = document.getElementById('display');
const panel = document.querySelector('.button-panel');
const historyEl = document.getElementById('history');
const modeToggle = document.getElementById('mode-toggle');

const buttons = [
  'C', 'DEL', '(', ')',
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
  'sin', 'cos', 'tan', 'log', 'ln', '√', '^', '!'
];

let input = '';
let history = [];

// Generate buttons
buttons.forEach(btn => {
  const button = document.createElement('button');
  button.textContent = btn;
  button.className = 'button';
  if (['/', '*', '-', '+', '=', '^'].includes(btn)) button.classList.add('operator');
  if (['sin', 'cos', 'tan', 'log', 'ln', '√', '!'].includes(btn)) button.classList.add('function');

  button.addEventListener('click', () => handleInput(btn));
  panel.appendChild(button);
});

// Input handling
function handleInput(value) {
  if (value === 'C') {
    input = '';
    display.textContent = '0';
  } else if (value === 'DEL') {
    input = input.slice(0, -1);
    display.textContent = input || '0';
  } else if (value === '=') {
    calculateResult();
  } else {
    input += value;
    display.textContent = input;
  }
}

// Calculate result
function calculateResult() {
  try {
    // Replace custom symbols with math.js compatible functions
    let formatted = input
      .replace(/√/g, 'sqrt') // √ → sqrt()
      .replace(/\^/g, '**')  // ^ → **
      .replace(/ln/g, 'log') // ln → log (natural)
      .replace(/log/g, 'log10'); // log → base 10

    // math.js evaluates radians by default
    // If you want degrees, convert them here:
    formatted = formatted.replace(/(sin|cos|tan)\(([^)]+)\)/g, (match, fn, val) => {
      return `${fn}((${val}) * pi / 180)`; // convert degrees to radians
    });

    const result = math.evaluate(formatted);
    history.push(`${input} = ${result}`);
    updateHistory();
    input = result.toString();
    display.textContent = input;
  } catch {
    display.textContent = 'Error';
    input = '';
  }
}


// Update scrollable history
function updateHistory() {
  historyEl.innerHTML = '';
  history.slice(-5).forEach(entry => {
    const div = document.createElement('div');
    div.textContent = entry;
    historyEl.appendChild(div);
  });
  historyEl.scrollTop = historyEl.scrollHeight;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) handleInput(key);
  else if (key === 'Enter') { e.preventDefault(); calculateResult(); }
  else if (key === 'Backspace') handleInput('DEL');
  else if (key.toLowerCase() === 'c') handleInput('C');
});

// Dark/Light mode toggle
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  modeToggle.textContent = document.body.classList.contains('light') ? '🌞' : '🌙';
});
