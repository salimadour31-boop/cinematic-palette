// Cinematic Palette - free browser tool
// Generates film-inspired color palettes

const palettes = {
  noir: ['#0d0d0d', '#1a1a1a', '#4a4a4a', '#c0c0c0', '#f5f5f5'],
  scifi: ['#0a1628', '#1a3a5c', '#00d4ff', '#ff6b35', '#e8e8e8'],
  western: ['#3d2914', '#8b5a2b', '#d4a574', '#e8d5b7', '#f5e6d3'],
  romance: ['#4a1c3a', '#8b3a5a', '#e8a0b0', '#f5d0d8', '#fff5f7'],
  horror: ['#1a0a0a', '#4a0a0a', '#8b1a1a', '#c45c5c', '#e8d0d0'],
  fantasy: ['#1a2a1a', '#2d5a3d', '#7cb342', '#c5e1a5', '#f1f8e9'],
  random: null
};

const texts = {
  fr: {
    title: 'Cinematic Palette',
    generate: 'Générer',
    copy: 'Copier CSS',
    export: 'Exporter PNG',
    genre: 'Genre / Ambiance :',
    copied: 'Copié !',
    random: 'Aléatoire'
  },
  en: {
    title: 'Cinematic Palette',
    generate: 'Generate',
    copy: 'Copy CSS',
    export: 'Export PNG',
    genre: 'Genre / Mood :',
    copied: 'Copied!',
    random: 'Random'
  }
};

let lang = 'fr';

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateRandomPalette() {
  const baseHue = Math.floor(Math.random() * 360);
  return [
    hslToHex(baseHue, 70, 15),
    hslToHex(baseHue, 60, 30),
    hslToHex((baseHue + 30) % 360, 80, 50),
    hslToHex((baseHue + 180) % 360, 40, 70),
    hslToHex(baseHue, 20, 90)
  ];
}

function renderPalette(colors) {
  const container = document.getElementById('palette');
  container.innerHTML = '';
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.background = color;
    const span = document.createElement('span');
    span.textContent = color;
    swatch.appendChild(span);
    swatch.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
      span.textContent = texts[lang].copied;
      setTimeout(() => span.textContent = color, 1000);
    });
    container.appendChild(swatch);
  });
}

function updateTexts() {
  document.getElementById('title').textContent = texts[lang].title;
  document.getElementById('generate').textContent = texts[lang].generate;
  document.getElementById('copyCss').textContent = texts[lang].copy;
  document.getElementById('exportPng').textContent = texts[lang].export;
  document.querySelector('label').textContent = texts[lang].genre;
  document.querySelector('option[value="random"]').textContent = texts[lang].random;
  document.getElementById('langBtn').textContent = lang === 'fr' ? 'EN' : 'FR';
}

document.getElementById('generate').addEventListener('click', () => {
  const genre = document.getElementById('genre').value;
  const colors = genre === 'random' ? generateRandomPalette() : palettes[genre];
  renderPalette(colors);
});

document.getElementById('copyCss').addEventListener('click', () => {
  const swatches = document.querySelectorAll('.swatch');
  const css = Array.from(swatches).map((s, i) => `--color-${i + 1}: ${s.style.background};`).join('\n');
  navigator.clipboard.writeText(`:root {\n${css}\n}`);
  alert(texts[lang].copied);
});

document.getElementById('exportPng').addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  const swatches = document.querySelectorAll('.swatch');
  const w = 800 / swatches.length;
  swatches.forEach((s, i) => {
    ctx.fillStyle = s.style.background;
    ctx.fillRect(i * w, 0, w, 200);
  });
  const link = document.createElement('a');
  link.download = 'cinematic-palette.png';
  link.href = canvas.toDataURL();
  link.click();
});

document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  updateTexts();
});

// Initial
updateTexts();
renderPalette(palettes.noir);
