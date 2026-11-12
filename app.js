const sportsData = [
  {
    id: 'futsal',
    name: 'Futsal',
    icon: `<svg viewBox="0 0 24 24" class="sport-icon-box"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 6.7V5.3zm-3.35-.95L11 5.3v1.4L7.01 9.49l-1.35-.46-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.08 17.11l-1.14.1C4.73 15.81 4 13.99 4 12c0-.12.01-.23.02-.35l1-.73 1.38.48 1.46 4.34-.78 1.37zm7.42 2.48c-.79.26-1.63.41-2.5.41s-1.71-.15-2.5-.41l-.69-1.49.64-1.1h5.11l.64 1.1-.7 1.49zM14.27 15H9.73l-1.35-4.02L12 8.44l3.63 2.54L14.27 15zm3.79 2.21l-1.14-.1-.79-1.37 1.46-4.34 1.39-.47 1 .73c.01.11.02.22.02.34 0 1.99-.73 3.81-1.94 5.21z"/></svg>`,
    desc: 'Cancha reglamentaria con superficie de alta calidad y excelente rebote.'
  },
  {
    id: 'basquet',
    name: 'Básquet',
    icon: `<svg viewBox="0 0 24 24" class="sport-icon-box"><path d="M17.09 11h4.86c-.16-1.61-.71-3.11-1.54-4.4-1.42 1.15-2.66 2.66-3.32 4.4zM6.91 11c-.66-1.74-1.9-3.25-3.32-4.4C2.76 7.89 2.21 9.39 2.05 11h4.86zm8.14 0c.72-2.16 2.23-4.02 4.13-5.26C17.44 3.56 14.88 2.18 12 2.03V11h3.05zm-6.1 0H12V2.03C9.12 2.18 6.56 3.56 4.82 5.74c1.9 1.24 3.41 3.1 4.13 5.26zM8.95 13c-.72 2.16-2.23 4.02-4.13 5.26 1.74 2.18 4.3 3.56 7.18 3.71V13H8.95zm-2.04 0H2.05c.16 1.61.71 3.11 1.54 4.4 1.42-1.15 2.66-2.66 3.32-4.4zm10.18 0c.66 1.74 1.9 3.25 3.32 4.4.83-1.29 1.38-2.79 1.54-4.4h-4.86zm-2.04 0H12v8.97c2.88-.15 5.44-1.53 7.18-3.71-1.9-1.24-3.41-3.1-4.13-5.26z"/></svg>`,
    desc: 'Piso flotante profesional, aros rebatibles y marcación oficial.'
  },
  {
    id: 'voley',
    name: 'Vóley',
    icon: `<svg viewBox="0 0 24 24" class="sport-icon-box" style="fill: none; stroke: var(--accent); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;"><circle cx="12" cy="12" r="9.5"/><path d="M12 12 Q 9.5 7.5 9.2 2.9"/><path d="M12 12 Q 16.8 11.8 21.2 14.3"/><path d="M12 12 Q 9.7 16.5 5.5 18.9"/><path d="M6.2 4.5 Q 6.4 8.5 8.2 12.2"/><path d="M13.2 2.6 Q 14.2 7.5 17.2 11.8"/><path d="M17.8 17.2 Q 14 17.2 9.8 15.8"/></svg>`,
    desc: 'Espacio óptimo con altura libre superior y red profesional ajustable.'
  }
];

function renderSports() {
  const container = document.getElementById('sports-grid-container');
  if (!container) return;

  container.innerHTML = sportsData.map((sport, index) => `
    <div class="sport-card glass-effect reveal delay-${index + 1}">
      <div>
        ${sport.icon}
        <h4>${sport.name}</h4>
        <p>${sport.desc}</p>
      </div>
      <div class="sport-meta">
        <button class="btn-sport" style="width: 100%; padding: 12px;" onclick="selectSportFromCard('${sport.name}')">Reservar Turno</button>
      </div>
    </div>
  `).join('');
}

function normalizeSelectionValue(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function setMatchingSelectValue(selectEl, desiredValue) {
  if (!selectEl) return false;

  const normalizedTarget = normalizeSelectionValue(desiredValue);
  const option = [...selectEl.options].find(option => {
    const optionValue = normalizeSelectionValue(option.value);
    const optionText = normalizeSelectionValue(option.textContent);
    return optionValue === normalizedTarget || optionText === normalizedTarget;
  });

  if (option) {
    selectEl.value = option.value;
    return true;
  }

  return false;
}

function selectSportFromCard(sportName) {
  const select = document.getElementById('res-sport');
  if (select) {
    if (setMatchingSelectValue(select, sportName)) {
      document.querySelector('.reservation-section').scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function selectModality(modalityName) {
  const selectMod = document.getElementById('res-modality');
  if (selectMod) {
    if (setMatchingSelectValue(selectMod, modalityName)) {
      document.querySelector('.reservation-section').scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function generateReservation(event) {
  event.preventDefault();

  const sport = document.getElementById('res-sport').value;
  const court = document.getElementById('res-court').value;
  const modality = document.getElementById('res-modality').value;
  const date = document.getElementById('res-date').value;
  const time = document.getElementById('res-time').value;
  const name = document.getElementById('res-name').value.trim();

  if (!date || !name) {
    alert('Por favor complete todos los campos obligatorios.');
    return;
  }

  // Generar código de referencia único para sincronizar Excel y WhatsApp
  const refCode = 'APS-' + Math.floor(1000 + Math.random() * 9000);

  const reservationData = {
    refCode: refCode,
    name: name,
    sport: sport,
    court: court,
    modality: modality,
    date: date,
    time: time
  };

  const scriptURL = 'https://script.google.com/macros/s/AKfycbyLsWbd-41slJBYV8GyIvJyOI-VgLHJMY3Iutbdw3Jil3hOEyR1k7rFigZ3sBsGQYM/exec';

  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(reservationData)
  }).catch(error => console.error('Error al registrar:', error));

  let message = `🏟️ *SOLICITUD DE TURNO #${refCode}*\n`;
  message += `📍 _Arena Paraná Sport (Juan Morath 10)_\n\n`;
  message += `🏆 *Disciplina:* ${sport}\n`;
  message += `🏟️ *Cancha:* ${court}\n`;
  message += `💳 *Modalidad:* ${modality}\n`;
  message += `📅 *Fecha:* ${date}\n`;
  message += `⏰ *Horario:* ${time}\n`;
  message += `👤 *Responsable:* ${name}\n\n`;
  message += `_¡Hola! Envío mi solicitud de reserva para consultar disponibilidad y confirmar el turno._`;

  const phoneNumber = '5493434717233'; 
  const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  window.open(waUrl, '_blank');
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('.scrollspy-target');
  const navLinks = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current) && current !== '') {
        link.classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSports();
  initScrollReveal();
  initScrollSpy();

  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
});