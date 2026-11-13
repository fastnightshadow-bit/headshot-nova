const header = document.querySelector('.site-header');
let lastScrollY = Math.max(0, window.scrollY);
let scrollTravel = 0;
let lastDirection = 0;
let scrollScheduled = false;

function updateHeader() {
  const currentY = Math.max(0, window.scrollY);
  const delta = currentY - lastScrollY;
  const direction = Math.sign(delta);
  header.classList.toggle('scrolled', currentY > 40);
  if (direction !== lastDirection) scrollTravel = 0;
  scrollTravel += delta;
  if (currentY < 90) {
    header.classList.remove('is-hidden');
  } else if (Math.abs(scrollTravel) > 12) {
    header.classList.toggle('is-hidden', direction > 0);
    scrollTravel = 0;
  }
  lastDirection = direction;
  lastScrollY = currentY;
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

const petalLayer = document.querySelector('.petals');
for (let index = 0; index < 24; index++) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  const values = {
    left: ((index * 41 + 7) % 100) + '%',
    size: (10 + (index * 7) % 15) + 'px',
    opacity: .35 + (index % 4) * .13,
    duration: (13 + (index * 3) % 12) + 's',
    delay: (-index * 2.7) + 's',
    drift: ((index % 2 ? 1 : -1) * (45 + index * 6)) + 'px',
    spin: ((index % 2 ? 1 : -1) * (140 + index * 21)) + 'deg',
    blur: (index % 5 === 0 ? .9 : .25) + 'px',
    turn: (3 + index % 5) + 's'
  };
  for (const [name, value] of Object.entries(values)) {
    petal.style.setProperty('--' + name, value);
  }
  petal.append(document.createElement('i'));
  petalLayer.append(petal);
}
let heroVisible = true;
function updatePetalPlayback() {
  petalLayer.classList.toggle('paused', document.hidden || !heroVisible);
}
const heroObserver = new IntersectionObserver(entries => {
  heroVisible = entries[0].isIntersecting;
  updatePetalPlayback();
});
heroObserver.observe(document.querySelector('.hero'));
document.addEventListener('visibilitychange', updatePetalPlayback);

const photo = document.querySelector('#photo');
document.querySelector('#open-photo').addEventListener('click', () => photo.showModal());
document.querySelector('#close-photo').addEventListener('click', () => photo.close());
photo.addEventListener('click', event => {
  if (event.target === photo) photo.close();
});

const form = document.querySelector('#application');
const result = document.querySelector('#result');
const status = document.querySelector('#status');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const fields = ['nickname', 'discord', 'about'].map(key => data.get(key).trim());
  if (fields.some(value => !value)) {
    status.textContent = 'Заполни все поля текстом';
    return;
  }
  result.value = [
    'Заявка в HeadShot · NOVA',
    'Ник персонажа: ' + fields[0],
    'Discord: ' + fields[1],
    'О себе: ' + fields[2]
  ].join('\n\n');
  document.querySelector('#output').hidden = false;
  status.textContent = 'Скопируй заявку и передай представителю семьи';
});
document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    status.textContent = 'Заявка скопирована';
  } catch {
    result.focus();
    result.select();
    status.textContent = 'Текст выделен — скопируй его вручную';
  }
});
