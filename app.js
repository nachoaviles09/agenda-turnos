const sportsData = [
  {
    id: 'futsal',
    name: 'Futsal',
    icon: `<svg viewBox="0 0 24 24" class="sport-icon-box"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-4l5-3-5-3v6z"/></svg>`,
    desc: 'Cancha reglamentaria con superficie de alta calidad y excelente rebote.',
    price: 'Completo: $80.000'
  },
  {
    id: 'basquet',
    name: 'Básquet',
    icon: `<svg viewBox="0 0 24 24" class="sport-icon-box"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.22-.38-.63-.65-1.1-.65h-1v-2c0-.55-.45-1-1-1h-4v-1h3c.55 0 1-.45 1-1v-2h1c1.1 0 2-.9 2-2V7.15c2.28 1.45 3.84 3.93 3.98 6.85-1.57.19-2.92 1.05-3.88 2.4z"/></svg>`,
    desc: 'Piso flotante profesional, aros rebatibles y marcación oficial.',
    price: 'Completo $80k | Parcial $40k'
  },
  {
    id: 'voley',
    name: 'Vóley',
    icon: `<svg viewBox="0 0 24 24" class="sport-icon-box"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>`,
    desc: 'Espacio óptimo con altura libre superior y red profesional ajustable.',
    price: 'Completo $80k | Parcial $40k'
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
        <span class="sport-price">${sport.price}</span>
        <button class="btn-sport" onclick="selectSportFromCard('${sport.name}')">Reservar</button>
      </div>
    </div>
  `).join('');
}

function selectSportFromCard(sportName) {
  const select = document.getElementById('res-sport');
  if (select) {
    select.value = sportName;
    document.querySelector('.reservation-section').scrollIntoView({ behavior: 'smooth' });
  }
}

function selectModality(modalityName) {
  const selectMod = document.getElementById('res-modality');
  if (selectMod) {
    selectMod.value = modalityName;
    document.querySelector('.reservation-section').scrollIntoView({ behavior: 'smooth' });
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

  const phoneNumber = '5493436131681'; 
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