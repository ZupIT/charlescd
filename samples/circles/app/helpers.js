const palette = [
  '#ede682',
  '#ffae00',
  '#ff7b10',
  '#ade498',
  '#01e89a',
  '#feceab',
  '#ff847c',
  '#e84a5f'
];

function Colors() {
  const colors = Object.assign([], palette);

  function generate() {
    const pos = Math.floor((Math.random() * colors.length));
    const color = colors.splice(pos, 1);

    if (colors.length === 0) {
      colors = Object.assign([], palette);
    }
    
    return color;
  }

  return {
    generate
  }
}

function getDefaultCircle() {
  const defaultCircle = document.querySelector('#circle-default');
  const w = defaultCircle ? defaultCircle.getAttribute('width') : '';
  const h = defaultCircle ? defaultCircle.getAttribute('height') : '';

  return {
    defaultCircle,
    w,
    h
  }
}

function toggleLoading(selector, text = 'loading') {
  document.querySelector(selector).textContent = text;
}

function errorMessage(message = '') {
  document.querySelector('#error-message').textContent = message;
}

function hideElement(selector) {
  document.querySelector(selector).className = 'hidden';
}

function showElement(selector) {
  document.querySelector(selector).className = 'show';
}

function resetSVG() {
  const content = document.querySelector('#content');
  const { defaultCircle } = getDefaultCircle();

  if (defaultCircle) {
    content.removeChild(defaultCircle);
  }

  const newSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  newSVG.id = 'circle-default';
  newSVG.setAttribute('width', '400');
  newSVG.setAttribute('height', '400');

  content.appendChild(newSVG);
}