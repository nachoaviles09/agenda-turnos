// Carga dinámica de datos desde el archivo config.js si existe, de lo contrario usa valores por defecto
const APP_CONFIG = typeof CONFIG !== 'undefined' ? CONFIG : {
  nombreComplejo: "Complejo Deportivo",
  whatsappContacto: "549343000000",
  scriptURL: "",
  deportes: ["Fútbol 5", "Pádel", "Tenis"],
  canchas: ["Cancha 1", "Cancha 2"],
  horarios: ['08:00 a 09:00 hs', '09:00 a 10:00 hs']
};

const SCRIPT_URL = APP_CONFIG.scriptURL;

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
  const option = [...selectEl.options].find(opt => {
    const optionValue = normalizeSelectionValue(opt.value);
    const optionText = normalizeSelectionValue(opt.textContent);
    return optionValue === normalizedTarget || optionText === normalizedTarget;
  });

  if (option) {
    selectEl.value = option.value;
    return true;
  }

  return false;
}

function syncSportsRules() {
  const selectSport = document.getElementById('res-sport');
  const selectCourt = document.getElementById('res-court');
  const selectMod = document.getElementById('res-modality');
  if (!selectSport || !selectCourt || !selectMod) return;

  const isFutsal = normalizeSelectionValue(selectSport.value) === 'futsal';

  Array.from(selectCourt.options).forEach(opt => {
    opt.disabled = isFutsal && opt.value !== 'Cancha Principal / Completa';
  });

  Array.from(selectMod.options).forEach(opt => {
    opt.disabled = isFutsal && normalizeSelectionValue(opt.value).includes('parcial');
  });

  if (isFutsal) {
    selectCourt.value = 'Cancha Principal / Completa';
    const completaOpt = [...selectMod.options].find(opt =>
      normalizeSelectionValue(opt.value).includes('completo')
    );
    if (completaOpt) selectMod.value = completaOpt.value;
  }

  applyAvailabilityToSelect();
}

function syncCourtWithModality() {
  const selectMod = document.getElementById('res-modality');
  const selectCourt = document.getElementById('res-court');
  if (!selectMod || !selectCourt) return;

  const modNorm = normalizeSelectionValue(selectMod.value);
  if (modNorm.includes('completo')) {
    selectCourt.value = 'Cancha Principal / Completa';
  } else if (modNorm.includes('parcial') && selectCourt.value === 'Cancha Principal / Completa') {
    selectCourt.value = 'Cancha 1';
  }
  applyAvailabilityToSelect();
}

function syncModalityWithCourt() {
  const selectMod = document.getElementById('res-modality');
  const selectCourt = document.getElementById('res-court');
  if (!selectMod || !selectCourt) return;

  const isCompleta = selectCourt.value === 'Cancha Principal / Completa';
  const targetKeyword = isCompleta ? 'completo' : 'parcial';

  const matchingOpt = [...selectMod.options].find(opt =>
    normalizeSelectionValue(opt.value).includes(targetKeyword)
  );
  if (matchingOpt) {
    selectMod.value = matchingOpt.value;
  }
  applyAvailabilityToSelect();
}

function selectSportFromCard(sportName) {
  const select = document.getElementById('res-sport');
  if (select && setMatchingSelectValue(select, sportName)) {
    syncSportsRules();
    document.querySelector('.reservation-section').scrollIntoView({ behavior: 'smooth' });
  }
}

function selectModality(modalityName) {
  const selectMod = document.getElementById('res-modality');
  const selectSport = document.getElementById('res-sport');

  if (normalizeSelectionValue(modalityName).includes('parcial') && selectSport) {
    if (normalizeSelectionValue(selectSport.value) === 'futsal') {
      selectSport.value = 'Básquet';
      syncSportsRules();
    }
  }

  if (selectMod && setMatchingSelectValue(selectMod, modalityName)) {
    syncCourtWithModality();
    document.querySelector('.reservation-section').scrollIntoView({ behavior: 'smooth' });
  }
}

function resetReservationFormUI() {
  const successBox = document.getElementById('reservation-success-box');
  if (successBox) {
    successBox.style.display = 'none';
    successBox.innerHTML = '';
  }
  const nameInput = document.getElementById('res-name');
  if (nameInput) nameInput.focus();
}

let occupiedBookingsCache = [];

function isSlotBlocked(bookedCourt, selectedCourt, bookedTime, optionTime) {
  if (bookedTime !== optionTime) return false;
  if (selectedCourt === 'Cancha Principal / Completa') return true;
  if (bookedCourt === 'Cancha Principal / Completa') return true;
  return bookedCourt === selectedCourt;
}

function isPastHourToday(dateValue, optionTime) {
  const now = new Date();
  const todayLocal = now.toLocaleDateString('en-CA');
  if (dateValue !== todayLocal) return false;

  const currentHour = now.getHours();
  const rawHour = parseInt(optionTime, 10);
  if (isNaN(rawHour)) return false;

  const slotHour = rawHour === 0 ? 24 : rawHour;
  return slotHour <= currentHour;
}

function applyAvailabilityToSelect() {
  const timeSelect = document.getElementById('res-time');
  const courtSelect = document.getElementById('res-court');
  const dateInput = document.getElementById('res-date');
  if (!timeSelect || !courtSelect) return;

  const selectedCourt = courtSelect.value;
  const selectedDate = dateInput ? dateInput.value : '';
  let firstAvailableIndex = -1;

  Array.from(timeSelect.options).forEach((option, index) => {
    const baseTime = option.value;
    const isPast = isPastHourToday(selectedDate, baseTime);
    const isOccupied = occupiedBookingsCache.some(b =>
      isSlotBlocked(b.court, selectedCourt, b.time, baseTime)
    );

    const disabled = isPast || isOccupied;
    option.disabled = disabled;

    if (isOccupied) {
      option.textContent = `${baseTime} (OCUPADO)`;
    } else if (isPast) {
      option.textContent = `${baseTime} (HORARIO PASADO)`;
    } else {
      option.textContent = baseTime;
    }

    if (!disabled && firstAvailableIndex === -1) {
      firstAvailableIndex = index;
    }
  });

  if (timeSelect.options[timeSelect.selectedIndex]?.disabled && firstAvailableIndex !== -1) {
    timeSelect.selectedIndex = firstAvailableIndex;
  }
}

async function fetchAvailabilityForDate(dateValue) {
  const timeSelect = document.getElementById('res-time');
  const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
  if (!dateValue || !timeSelect) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?date=${encodeURIComponent(dateValue)}`);
    const result = await response.json();
    occupiedBookingsCache = Array.isArray(result.bookings) ? result.bookings : [];
  } catch (error) {
    console.error('No se pudo consultar disponibilidad:', error);
    occupiedBookingsCache = [];
  } finally {
    applyAvailabilityToSelect();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  }
}

async function generateReservation(event) {
  event.preventDefault();

  const sport = document.getElementById('res-sport').value;
  const court = document.getElementById('res-court').value;
  const modality = document.getElementById('res-modality').value;
  const date = document.getElementById('res-date').value;
  const timeSelect = document.getElementById('res-time');
  const time = timeSelect.value;
  const name = document.getElementById('res-name').value.trim();
  const phone = document.getElementById('res-phone').value.trim();
  const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
  const successBox = document.getElementById('reservation-success-box');

  if (!date || !name || !phone) {
    alert('Por favor completá tu nombre, teléfono y fecha del turno.');
    return;
  }

  if (timeSelect.options[timeSelect.selectedIndex]?.disabled) {
    alert('Ese horario no está disponible. Por favor elegí otro turno libre.');
    return;
  }

  const originalBtnText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando turno...';
  }

  const refCode = 'APS-' + Math.floor(1000 + Math.random() * 9000);

  const reservationData = {
    refCode: refCode,
    name: name,
    phone: phone,
    sport: sport,
    court: court,
    modality: modality,
    date: date,
    time: time
  };

  let savedInSheet = false;

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(reservationData)
    });
    const result = await response.json();

    if (result.status === 'duplicate') {
      alert('¡Ups! Alguien acaba de reservar ese mismo turno recién. Actualizamos los horarios disponibles.');
      fetchAvailabilityForDate(date);
      return;
    }

    if (result.status === 'ok') {
      savedInSheet = true;
    }
  } catch (error) {
    console.error('Error al registrar:', error);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  }

  if (savedInSheet) {
    occupiedBookingsCache.push({ time: time, court: court });
    applyAvailabilityToSelect();
  }

  document.getElementById('res-name').value = '';
  document.getElementById('res-phone').value = '';

  let message = `🏟️ *SOLICITUD DE TURNO #${refCode}*\n`;
  message += `📍 _${APP_CONFIG.nombreComplejo}_\n\n`;
  message += `🏆 *Disciplina:* ${sport}\n`;
  message += `🏟️ *Cancha:* ${court}\n`;
  message += `💳 *Modalidad:* ${modality}\n`;
  message += `📅 *Fecha:* ${date}\n`;
  message += `⏰ *Horario:* ${time}\n`;
  message += `👤 *Responsable:* ${name}\n`;
  message += `📱 *Teléfono:* ${phone}\n\n`;
  message += `_¡Hola! Envío mi solicitud de reserva para confirmar el turno._`;

  let shareMessage = `🏟️ *COMPROBANTE DE TURNO #${refCode}*\n`;
  shareMessage += `📍 _${APP_CONFIG.nombreComplejo}_\n\n`;
  shareMessage += `🏆 *Disciplina:* ${sport}\n`;
  shareMessage += `🏟️ *Cancha:* ${court}\n`;
  shareMessage += `📅 *Fecha:* ${date}\n`;
  shareMessage += `⏰ *Horario:* ${time}\n`;
  shareMessage += `👤 *Reserva a nombre de:* ${name}\n\n`;
  shareMessage += `_¡Nos vemos en la cancha!_`;

  const phoneNumber = APP_CONFIG.whatsappContacto;
  const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  if (successBox) {
    const statusTitle = savedInSheet
      ? '¡Turno pre-reservado en agenda!'
      : '⚠️ Sin conexión con la agenda automática';
    const statusNote = savedInSheet
      ? `<strong>${sport}</strong> · ${court}<br>${date} a las <strong>${time}</strong>`
      : `Enviá tu solicitud por WhatsApp al complejo para confirmarlo manualmente.<br><strong>${sport}</strong> · ${date} · <strong>${time}</strong>`;

    successBox.innerHTML = `
      <span class="confirm-badge">CÓDIGO #${refCode}</span>
      <h4>${statusTitle}</h4>
      <p>${statusNote}</p>
      <a href="${waShareUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-confirm">
        Compartir comprobante por WhatsApp
      </a>
      <button type="button" onclick="resetReservationFormUI()" style="margin-top: 12px; background: transparent; border: none; color: var(--text-muted); font-size: 0.85rem; text-decoration: underline; cursor: pointer;">
        Reservar otro turno
      </button>
    `;
    successBox.style.display = 'block';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

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

function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('main-nav');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!toggleBtn || !navMenu) return;

  function setMenuState(isOpen) {
    navMenu.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    if (iconOpen && iconClose) {
      iconOpen.style.display = isOpen ? 'none' : 'block';
      iconClose.style.display = isOpen ? 'block' : 'none';
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCurrentlyOpen = navMenu.classList.contains('open');
    setMenuState(!isCurrentlyOpen);
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !e.target.closest('.header')) {
      setMenuState(false);
    }
  });
}

function cargarHorariosDinamicos() {
  const timeSelect = document.getElementById('res-time');
  if (!timeSelect) return;

  const horariosDisponibles = APP_CONFIG.horarios || [
    '08:00 a 09:00 hs', '09:00 a 10:00 hs', '10:00 a 11:00 hs', '11:00 a 12:00 hs'
  ];

  timeSelect.innerHTML = '';

  horariosDisponibles.forEach(horario => {
    const option = document.createElement('option');
    option.value = horario;
    option.textContent = horario;
    timeSelect.appendChild(option);
  });
}

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderSports();
  initScrollReveal();
  initScrollSpy();
  initMobileMenu();
  cargarHorariosDinamicos(); // Carga automática de horarios desde config.js

  const dateInput = document.getElementById('res-date');
  const courtSelect = document.getElementById('res-court');
  const modalitySelect = document.getElementById('res-modality');
  const sportSelect = document.getElementById('res-sport');

  if (dateInput) {
    const today = new Date().toLocaleDateString('en-CA');
    dateInput.value = today;
    dateInput.min = today;

    fetchAvailabilityForDate(today);
    dateInput.addEventListener('change', (e) => {
      fetchAvailabilityForDate(e.target.value);
    });
  }

  if (sportSelect) {
    sportSelect.addEventListener('change', syncSportsRules);
    syncSportsRules();
  }

  if (courtSelect) {
    courtSelect.addEventListener('change', syncModalityWithCourt);
  }

  if (modalitySelect) {
    modalitySelect.addEventListener('change', syncCourtWithModality);
  }
});