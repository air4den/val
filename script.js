const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const buttonsContainer = document.getElementById('buttonsContainer');
const questionState = document.getElementById('questionState');
const happyState = document.getElementById('happyState');
const heartsContainer = document.getElementById('heartsContainer');
const macronImg = document.getElementById('macronImg');
const forSureSound = document.getElementById('forSureSound');

// ---- No button evasion ----
const FLEE_DISTANCE = 100; // px — how close before it runs

function getContainerRect() {
  return buttonsContainer.getBoundingClientRect();
}

function getBtnNoRect() {
  return btnNo.getBoundingClientRect();
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function moveNoButton(pointerX, pointerY) {
  const containerRect = getContainerRect();
  const btnRect = getBtnNoRect();

  // Center of the No button
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  const dx = btnCenterX - pointerX;
  const dy = btnCenterY - pointerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < FLEE_DISTANCE) {
    // Determine flee direction (away from pointer)
    let angle = Math.atan2(dy, dx);
    // Add some randomness so it's not always the exact opposite
    angle += (Math.random() - 0.5) * 1.2;

    const fleeDist = 80 + Math.random() * 60;
    let newCenterX = btnCenterX + Math.cos(angle) * fleeDist;
    let newCenterY = btnCenterY + Math.sin(angle) * fleeDist;

    // Clamp within the container
    const halfW = btnRect.width / 2;
    const halfH = btnRect.height / 2;

    newCenterX = clamp(newCenterX, containerRect.left + halfW, containerRect.right - halfW);
    newCenterY = clamp(newCenterY, containerRect.top + halfH, containerRect.bottom - halfH);

    // If clamped position is still too close to pointer, try opposite side
    const newDx = newCenterX - pointerX;
    const newDy = newCenterY - pointerY;
    const newDist = Math.sqrt(newDx * newDx + newDy * newDy);

    if (newDist < FLEE_DISTANCE * 0.6) {
      // Jump to a random spot in the container
      newCenterX = containerRect.left + halfW + Math.random() * (containerRect.width - btnRect.width);
      newCenterY = containerRect.top + halfH + Math.random() * (containerRect.height - btnRect.height);
    }

    // Convert to position relative to container
    const relX = newCenterX - containerRect.left - halfW;
    const relY = newCenterY - containerRect.top - halfH;

    btnNo.style.left = relX + 'px';
    btnNo.style.top = relY + 'px';
    btnNo.style.transform = 'none';
  }
}

// Position the No button initially (centered, below the For Sure button)
function initNoButtonPosition() {
  const containerRect = getContainerRect();
  const btnRect = getBtnNoRect();
  const yesRect = btnYes.getBoundingClientRect();

  // Center horizontally
  const x = (containerRect.width - btnRect.width) / 2;
  // Below the Yes button with some gap
  const yesBottom = yesRect.bottom - containerRect.top;
  const y = yesBottom + 12;

  btnNo.style.left = x + 'px';
  btnNo.style.top = y + 'px';
}

// ---- Play sound helper ----
function playForSureSound() {
  forSureSound.currentTime = 0;
  forSureSound.play();
}

// Desktop: mousemove
document.addEventListener('mousemove', (e) => {
  moveNoButton(e.clientX, e.clientY);
});

// Mobile: touchmove + touchstart
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  moveNoButton(touch.clientX, touch.clientY);
}, { passive: true });

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  moveNoButton(touch.clientX, touch.clientY);
}, { passive: true });

// ---- Yes button ----
btnYes.addEventListener('click', () => {
  questionState.classList.add('hidden');
  happyState.classList.remove('hidden');
  playForSureSound();
  spawnHearts();
});

// ---- Macron image click ----
macronImg.addEventListener('click', () => {
  playForSureSound();
  spawnHearts();
});

// Prevent the No button from doing anything if somehow clicked
btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  // Just move it away again
  const rect = btnNo.getBoundingClientRect();
  moveNoButton(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

// ---- Hearts animation ----
function spawnHearts() {
  const emojis = ['💕', '❤️', '💖', '💗', '💘', '🌸', '🇫🇷', '🥪', '🥰', '😁'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.classList.add('heart');
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.bottom = '-40px';
      heart.style.animationDuration = (2 + Math.random() * 2) + 's';
      heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      heartsContainer.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove());
    }, i * 100);
  }
}

// Initialize No button position on load
window.addEventListener('load', initNoButtonPosition);
window.addEventListener('resize', initNoButtonPosition);
