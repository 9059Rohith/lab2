const API_BASE = 'http://localhost:3000/api';

const matrixLine = document.getElementById('matrixLine');
const finalText = 'HELLO, I BUILD LOUD THINGS.';

function matrixTyping() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(){}[]';
  let frame = 0;
  const timer = setInterval(() => {
    const solved = Math.floor(frame / 2);
    matrixLine.textContent = finalText
      .split('')
      .map((c, i) => {
        if (c === ' ') return ' ';
        if (i < solved) return finalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    frame += 1;
    if (solved >= finalText.length) {
      clearInterval(timer);
      matrixLine.textContent = finalText;
    }
  }, 44);
}

function setupFallingIcons() {
  let fired = false;
  const icons = [...document.querySelectorAll('.fall-icon')];
  const trigger = () => {
    if (fired) return;
    fired = true;
    icons.forEach((icon) => icon.classList.add('fall'));
  };
  window.addEventListener('scroll', trigger, { once: true });
}

function setupMarkerAnimations() {
  const markers = document.querySelectorAll('.marker');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.5 });
  markers.forEach((m) => observer.observe(m));
}

function setupPaperTears() {
  const tears = [...document.querySelectorAll('[data-tear]')];
  const update = () => {
    tears.forEach((tear) => {
      const rect = tear.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
      tear.style.setProperty('--close', String(1 - ratio * 0.45));
    });
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

async function fetchPortfolioData() {
  try {
    const res = await fetch(`${API_BASE}/portfolio-data`);
    if (!res.ok) throw new Error('API failed');
    return await res.json();
  } catch {
    return {
      timeline: [
        {
          id: 'journey-1',
          title: 'Curious Start',
          year: '2020',
          description: 'Started crafting bold, hand-made interfaces.',
          lat: 12.9716,
          lng: 77.5946,
          location: 'Bengaluru'
        },
        {
          id: 'journey-2',
          title: 'Frontend Playground Era',
          year: '2022',
          description: 'Built map-and-motion rich interaction systems.',
          lat: 13.0827,
          lng: 80.2707,
          location: 'Chennai'
        },
        {
          id: 'journey-3',
          title: 'Design Storytelling',
          year: '2024',
          description: 'Merged storytelling with playful interface design.',
          lat: 11.0168,
          lng: 76.9558,
          location: 'Coimbatore'
        }
      ]
    };
  }
}

function setupBookFlip() {
  const book = document.getElementById('book');
  const btn = document.getElementById('flipBook');
  btn.addEventListener('click', () => {
    book.classList.toggle('open');
  });
}

function setupMapAndTimeline(items) {
  const timelineEl = document.getElementById('timeline');

  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([12.97, 77.59], 4);

  L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
    maxZoom: 16,
    attribution: '&copy; Stadia Maps, &copy; OpenMapTiles, &copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = new Map();

  items.forEach((item, index) => {
    const marker = L.marker([item.lat, item.lng]).addTo(map)
      .bindPopup(`<strong>${item.title}</strong><br>${item.location}<br>${item.year}`);
    markers.set(item.id, marker);

    const node = document.createElement('div');
    node.className = 'timeline-item';
    node.innerHTML = `<strong>${item.year} - ${item.title}</strong><p>${item.description}</p><small>${item.location}</small>`;
    node.addEventListener('click', () => {
      document.querySelectorAll('.timeline-item').forEach((n) => n.classList.remove('active'));
      node.classList.add('active');
      map.flyTo([item.lat, item.lng], 7, { duration: 1.2 });
      marker.openPopup();
    });
    if (index === 0) node.classList.add('active');
    timelineEl.appendChild(node);
  });
}

function setupAssetWall() {
  const files = [
    'aaa.jpg','blue_crystal.png','blue_rocket_logo_stellar.png','cat_dog.png','chef_kid.png','cloud_animation.png','coco_cartton.png','different_color_juices_lined_up.png','earth.png','eee.png','french_fries_happy.png','fruit_happy.png','grapes_cartton.png','green_crystal.png','happy_bear.png','happy_bell.png','happy_tin_cartoon.png','huskey_playing_with_ball.png','joker_seeing_up.png','man_dancing.png','moon.png','peach_cartoon.png','pear_cartoon.png','pear_cartton_02.png','person_playing_guitar.png','potato_cartoon.png','purple crystal.png','rainbow_wgg.png','react.svg','rocket.png','rocket_01.png','saturn.png','star1.png','strawberry_cartoon.png','super_main_crystal.png','uranus.png'
  ];

  const grid = document.getElementById('assetGrid');
  files.forEach((name) => {
    const item = document.createElement('div');
    item.className = 'asset';
    item.innerHTML = `<img src="./image/${name}" alt="${name}" loading="lazy" /><small>${name}</small>`;
    grid.appendChild(item);
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    status.textContent = 'Sending...';

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to send');
      status.textContent = 'Message sent. Thank you!';
      form.reset();
    } catch {
      status.textContent = 'Could not send right now. Backend may be offline.';
    }
  });
}

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('neoTheme') || 'light';
  document.body.classList.toggle('dark', saved === 'dark');

  btn.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('neoTheme', dark ? 'dark' : 'light');
  });
}

async function trackVisit() {
  const sessionId = localStorage.getItem('neoSessionId') || crypto.randomUUID();
  localStorage.setItem('neoSessionId', sessionId);

  await fetch(`${API_BASE}/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: 'index', sessionId, metadata: { referrer: document.referrer || '' } })
  }).catch(() => undefined);
}

async function init() {
  matrixTyping();
  setupThemeToggle();
  setupFallingIcons();
  setupMarkerAnimations();
  setupPaperTears();
  setupBookFlip();
  setupAssetWall();
  setupContactForm();
  await trackVisit();

  const data = await fetchPortfolioData();
  setupMapAndTimeline(data.timeline || []);
}

window.addEventListener('DOMContentLoaded', init);
