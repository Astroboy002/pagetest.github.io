/* ═══════════════════════════════════════════════════════════
   NONE — Catálogo Automotriz  |  script.js
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────
   CREDENCIALES
───────────────────────────────────── */
const CREDS = { user: 'admin', pass: 'velox2025' };

/* ─────────────────────────────────────
   DATOS DEFAULT
   images: array de strings (URL o base64)
───────────────────────────────────── */
const DEFAULT_CARS = [
  {
    id:1, brand:'Porsche', name:'911 GT3 RS', type:'deportivo', badge:'Nuevo',
    price:'$243,000 USD', power:'525 CV', speed:'0–100 en 3.2s', maxSpeed:'296 km/h',
    images:['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
            'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80'],
    desc:'El rey de Nürburgring. Aerodinámica activa, motor de aspiración natural y una conexión directísima con el asfalto.'
  },
  {
    id:2, brand:'BMW', name:'M8 Competition', type:'sedan', badge:'',
    price:'$133,000 USD', power:'625 CV', speed:'0–100 en 3.0s', maxSpeed:'305 km/h',
    images:['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
    desc:'El gran turismo definitivo. Lujo sin compromisos, rendimiento sin límites. Todo en un mismo paquete.'
  },
  {
    id:3, brand:'Mercedes-AMG', name:'GT 63 S', type:'deportivo', badge:'Hot',
    price:'$179,000 USD', power:'639 CV', speed:'0–100 en 3.2s', maxSpeed:'315 km/h',
    images:['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'],
    desc:'Elegancia alemana con alma de bestia. El GT 63 S redefine lo que significa un supersedán.'
  },
  {
    id:4, brand:'Lamborghini', name:'Urus Performante', type:'suv', badge:'Nuevo',
    price:'$256,000 USD', power:'666 CV', speed:'0–100 en 3.3s', maxSpeed:'306 km/h',
    images:['https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80'],
    desc:'El SUV más rápido del mundo. Desde pista hasta la ciudad, el Urus Performante lo puede todo.'
  },
  {
    id:5, brand:'Tesla', name:'Model S Plaid', type:'electrico', badge:'',
    price:'$108,990 USD', power:'1,020 CV', speed:'0–100 en 2.1s', maxSpeed:'322 km/h',
    images:['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'],
    desc:'El sedán eléctrico más rápido jamás fabricado. Tecnología del mañana, disponible hoy.'
  },
  {
    id:6, brand:'Aston Martin', name:'DB12', type:'deportivo', badge:'2025',
    price:'$245,000 USD', power:'671 CV', speed:'0–100 en 3.6s', maxSpeed:'323 km/h',
    images:['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'],
    desc:'El grand tourer definitivo. Con el DB12, Aston Martin reinventa el arte del lujo en movimiento.'
  },
  {
    id:7, brand:'Range Rover', name:'Sport SVR', type:'suv', badge:'',
    price:'$115,000 USD', power:'575 CV', speed:'0–100 en 4.5s', maxSpeed:'283 km/h',
    images:['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'],
    desc:'El SUV premium más capaz del planeta. Off-road extremo sin renunciar al lujo absoluto.'
  },
  {
    id:8, brand:'Bentley', name:'Continental GT', type:'sedan', badge:'',
    price:'$224,900 USD', power:'659 CV', speed:'0–100 en 3.6s', maxSpeed:'335 km/h',
    images:['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80'],
    desc:'La cima del grand touring. Artesanía británica de la más alta calidad en cada detalle.'
  },
  {
    id:9, brand:'Rivian', name:'R1T Adventure', type:'electrico', badge:'Eco',
    price:'$73,000 USD', power:'835 CV', speed:'0–100 en 3.0s', maxSpeed:'201 km/h',
    images:['https://images.unsplash.com/photo-1645810902233-35e70c6b8c49?w=800&q=80'],
    desc:'La pickup eléctrica que lo cambia todo. Aventura sin límites, cero emisiones, tecnología de vanguardia.'
  }
];

const featuredCar = {
  id:0, brand:'Ferrari', name:'296 GTB', type:'deportivo', badge:'Nuevo',
  price:'$329,000 USD', power:'830 CV', speed:'0–100 en 2.9s', maxSpeed:'330 km/h',
  images:['https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'],
  desc:'Una revolución en forma de automóvil. El 296 GTB combina un motor V6 turboalimentado con un motor eléctrico para ofrecer una experiencia de conducción sin igual.'
};

/* ─────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────── */
let cars          = [];
let nextId        = 100;
let currentFilter = 'todos';
let currentSearch = '';
let editingId     = null;

// imágenes temporales mientras el admin llena el formulario
// formato: { src: 'url o base64', name: 'opcional' }
let formImages    = [];  // para el formulario "agregar"
let editImages    = [];  // para el modal "editar"

// intervalos de autoplay por tarjeta  { carId: intervalId }
const cardIntervals = {};

// estado del carrusel del modal
let modalImages  = [];
let modalIdx     = 0;
let modalInterval = null;

/* ═══════════════════════════════════════════════════════════
   PERSISTENCIA
═══════════════════════════════════════════════════════════ */
function save() {
  try { localStorage.setItem('none_v1', JSON.stringify(cars)); } catch(e) {}
}

function load() {
  try {
    const raw = localStorage.getItem('none_v1');
    if (raw) {
      cars = JSON.parse(raw);
      // migrar autos que solo tenían "image" string → images array
      cars.forEach(c => {
        if (!c.images) c.images = c.image ? [c.image] : [];
        delete c.image;
      });
      nextId = Math.max(...cars.map(c => c.id), 99) + 1;
    } else {
      cars = JSON.parse(JSON.stringify(DEFAULT_CARS));
      save();
    }
  } catch(e) {
    cars = JSON.parse(JSON.stringify(DEFAULT_CARS));
  }
}

/* ═══════════════════════════════════════════════════════════
   RENDER CATÁLOGO (tarjetas con carrusel)
═══════════════════════════════════════════════════════════ */
function renderCards(list) {
  // limpia intervalos anteriores
  Object.values(cardIntervals).forEach(id => clearInterval(id));
  Object.keys(cardIntervals).forEach(k => delete cardIntervals[k]);

  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '';

  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray);">No se encontraron vehículos</div>';
    return;
  }

  list.forEach(car => buildCard(car, grid));
  document.getElementById('pub-total').textContent = cars.length;
}

function buildCard(car, container) {
  const imgs = car.images && car.images.length ? car.images : ['https://placehold.co/600x400/1a1a1a/c8a96e?text=Sin+imagen'];
  const multi = imgs.length > 1;

  const d = document.createElement('div');
  d.className = 'car-card';
  d.dataset.carId = car.id;

  // construir slides
  const slidesHTML = imgs.map(src =>
    `<div class="card-slide"><img src="${src}" alt="${car.name}" loading="lazy"></div>`
  ).join('');

  // dots
  const dotsHTML = multi
    ? `<div class="card-dots">${imgs.map((_,i) => `<div class="card-dot${i===0?' active':''}" onclick="event.stopPropagation();cardGoTo(${car.id},${i})"></div>`).join('')}</div>`
    : '';

  // flechas
  const arrowsHTML = multi
    ? `<button class="card-arrow prev" onclick="event.stopPropagation();cardPrev(${car.id})">&#8249;</button>
       <button class="card-arrow next" onclick="event.stopPropagation();cardNext(${car.id})">&#8250;</button>`
    : '';

  d.innerHTML = `
    <div class="car-image-wrap">
      ${car.badge ? `<span class="car-badge">${car.badge}</span>` : ''}
      <div class="card-carousel" id="carousel-${car.id}">
        <div class="card-slides" id="slides-${car.id}">${slidesHTML}</div>
        ${arrowsHTML}
        ${dotsHTML}
      </div>
      <div class="car-overlay">
        <button class="overlay-btn" onclick="event.stopPropagation();openModal(${car.id})">Ver Detalles</button>
      </div>
    </div>
    <div class="car-info">
      <div class="car-brand">${car.brand}</div>
      <div class="car-name">${car.name}</div>
      <div class="car-specs">
        <div class="spec"><span class="spec-val">${car.power}</span><span class="spec-label">Potencia</span></div>
        <div class="spec"><span class="spec-val">${car.speed}</span><span class="spec-label">Aceleración</span></div>
        <div class="spec"><span class="spec-val">${car.maxSpeed}</span><span class="spec-label">Vel. Máx</span></div>
      </div>
      <div class="car-footer">
        <span class="car-price">${car.price}</span>
        <button class="car-cta" onclick="event.stopPropagation();openModal(${car.id})">
          <svg viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>`;

  d.addEventListener('click', () => openModal(car.id));
  container.appendChild(d);

  // autoplay si hay más de 1 imagen
  if (multi) startCardAutoplay(car.id, imgs.length);
}

/* ── Carrusel de tarjeta ── */
function cardCurrentIdx(carId) {
  const slides = document.getElementById('slides-' + carId);
  if (!slides) return 0;
  const tx = slides.style.transform;
  const match = tx.match(/-?[\d.]+/);
  if (!match) return 0;
  const pct = Math.abs(parseFloat(match[0]));
  return Math.round(pct / 100);
}

function cardGoTo(carId, idx) {
  const slides = document.getElementById('slides-' + carId);
  if (!slides) return;
  const count = slides.children.length;
  idx = (idx + count) % count;
  slides.style.transform = `translateX(-${idx * 100}%)`;
  // actualizar dots
  const dots = slides.closest('.car-image-wrap').querySelectorAll('.card-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function cardNext(carId) {
  cardGoTo(carId, cardCurrentIdx(carId) + 1);
}
function cardPrev(carId) {
  cardGoTo(carId, cardCurrentIdx(carId) - 1);
}

function startCardAutoplay(carId, count) {
  if (count < 2) return;
  cardIntervals[carId] = setInterval(() => cardNext(carId), 3500);
}

/* ═══════════════════════════════════════════════════════════
   FILTROS
═══════════════════════════════════════════════════════════ */
function applyFilters() {
  let f = cars;
  if (currentFilter !== 'todos') f = f.filter(c => c.type === currentFilter);
  if (currentSearch) f = f.filter(c =>
    c.name.toLowerCase().includes(currentSearch) ||
    c.brand.toLowerCase().includes(currentSearch)
  );
  renderCards(f);
}

function filterCars(val) {
  currentSearch = val.toLowerCase();
  applyFilters();
}

function filterByType(btn, type) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = type;
  showLoader(300);
  applyFilters();
}

/* ═══════════════════════════════════════════════════════════
   MODAL DE DETALLE — con galería manual
═══════════════════════════════════════════════════════════ */
function openModal(id) {
  const car = (typeof id === 'object') ? id : cars.find(c => c.id === id);
  if (!car) return;

  modalImages = (car.images && car.images.length) ? car.images
    : ['https://placehold.co/600x400/1a1a1a/c8a96e?text=Sin+imagen'];
  modalIdx = 0;

  // contenido textual
  document.getElementById('modal-brand').textContent = car.brand;
  document.getElementById('modal-title').textContent = car.name;
  document.getElementById('modal-desc').textContent  = car.desc;
  document.getElementById('modal-price').textContent = car.price;
  document.getElementById('modal-specs').innerHTML = `
    <div class="modal-spec"><div class="spec-val">${car.power}</div><div class="spec-label">Potencia</div></div>
    <div class="modal-spec"><div class="spec-val">${car.speed}</div><div class="spec-label">Aceleración</div></div>
    <div class="modal-spec"><div class="spec-val">${car.maxSpeed}</div><div class="spec-label">Vel. Máxima</div></div>
    <div class="modal-spec"><div class="spec-val">${car.type.charAt(0).toUpperCase()+car.type.slice(1)}</div><div class="spec-label">Categoría</div></div>`;

  buildModalGallery();

  document.getElementById('modal-bg').classList.add('open');
  document.body.style.overflow = 'hidden';

  // autoplay en modal si hay varias imágenes
  clearInterval(modalInterval);
  if (modalImages.length > 1) {
    modalInterval = setInterval(galleryNext, 4000);
  }
}

function buildModalGallery() {
  const track = document.getElementById('gallery-track');
  const dotsEl = document.getElementById('gallery-dots');
  const counter = document.getElementById('gallery-counter');

  // slides
  track.innerHTML = modalImages.map(src =>
    `<div class="gallery-slide"><img src="${src}" alt=""></div>`
  ).join('');

  // dots
  dotsEl.innerHTML = modalImages.length > 1
    ? modalImages.map((_,i) => `<button class="gallery-dot${i===0?' active':''}" onclick="galleryGoTo(${i})"></button>`).join('')
    : '';

  // contador
  counter.textContent = modalImages.length > 1 ? `1 / ${modalImages.length}` : '';
  counter.style.display = modalImages.length > 1 ? '' : 'none';

  // flechas
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  if (modalImages.length <= 1) {
    prev.style.display = 'none';
    next.style.display = 'none';
  } else {
    prev.style.display = '';
    next.style.display = '';
  }

  galleryGoTo(0);
}

function galleryGoTo(idx) {
  const count = modalImages.length;
  modalIdx = (idx + count) % count;
  document.getElementById('gallery-track').style.transform = `translateX(-${modalIdx * 100}%)`;
  // dots
  document.querySelectorAll('#gallery-dots .gallery-dot').forEach((d,i) => d.classList.toggle('active', i === modalIdx));
  // counter
  const counter = document.getElementById('gallery-counter');
  if (count > 1) counter.textContent = `${modalIdx+1} / ${count}`;
}

function galleryNext() { galleryGoTo(modalIdx + 1); }
function galleryPrev() { galleryGoTo(modalIdx - 1); }

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-bg') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('modal-bg').classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(modalInterval);
  modalInterval = null;
}

/* ═══════════════════════════════════════════════════════════
   GESTOR DE IMÁGENES (admin forms)
   prefix: 'f' = formulario agregar | 'e' = editar
═══════════════════════════════════════════════════════════ */
function getImgArray(prefix) {
  return prefix === 'f' ? formImages : editImages;
}
function setImgArray(prefix, arr) {
  if (prefix === 'f') formImages = arr;
  else editImages = arr;
}

function renderImgManager(prefix) {
  const arr    = getImgArray(prefix);
  const box    = document.getElementById(`${prefix}-img-manager`);
  const empty  = document.getElementById(`${prefix}-img-empty`);

  box.innerHTML = '';

  if (!arr.length) {
    const e = document.createElement('div');
    e.className = 'img-manager-empty';
    e.id = `${prefix}-img-empty`;
    e.textContent = 'Sin imágenes aún';
    box.appendChild(e);
    return;
  }

  arr.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'img-thumb-wrap';
    wrap.innerHTML = `
      <img src="${item.src}" alt="">
      <span class="thumb-order">${idx + 1}</span>
      <button class="thumb-del" onclick="removeImg('${prefix}',${idx})" title="Eliminar">✕</button>`;
    box.appendChild(wrap);
  });
}

function removeImg(prefix, idx) {
  const arr = getImgArray(prefix);
  arr.splice(idx, 1);
  setImgArray(prefix, arr);
  renderImgManager(prefix);
}

/* Agregar por URL */
function addImgUrl(prefix) {
  const input = document.getElementById(`${prefix}-img-url`);
  const url   = input.value.trim();
  if (!url || !url.startsWith('http')) {
    toast('Ingresa una URL válida (debe empezar con http)', 'error');
    return;
  }
  const arr = getImgArray(prefix);
  arr.push({ src: url });
  setImgArray(prefix, arr);
  renderImgManager(prefix);
  input.value = '';
}

/* Agregar desde dispositivo (File) */
function addImgFiles(input, prefix) {
  const files = Array.from(input.files);
  if (!files.length) return;

  let loaded = 0;
  const arr = getImgArray(prefix);

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      arr.push({ src: e.target.result, name: file.name });
      loaded++;
      if (loaded === files.length) {
        setImgArray(prefix, arr);
        renderImgManager(prefix);
      }
    };
    reader.readAsDataURL(file);
  });

  input.value = ''; // reset para poder volver a seleccionar los mismos archivos
}

/* ═══════════════════════════════════════════════════════════
   CONTENT LOADER
═══════════════════════════════════════════════════════════ */
function showLoader(ms) {
  const l = document.getElementById('content-loader');
  l.classList.add('show');
  setTimeout(() => l.classList.remove('show'), ms);
}

/* ═══════════════════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════════════════ */
function openLogin() {
  document.getElementById('admin-login-overlay').classList.add('open');
  setTimeout(() => document.getElementById('l-user').focus(), 300);
}
function closeLogin() {
  document.getElementById('admin-login-overlay').classList.remove('open');
  document.getElementById('l-error').textContent = '';
}
function doLogin() {
  const u = document.getElementById('l-user').value.trim();
  const p = document.getElementById('l-pass').value;
  if (u === CREDS.user && p === CREDS.pass) {
    closeLogin();
    openAdmin();
    document.getElementById('l-user').value = '';
    document.getElementById('l-pass').value = '';
  } else {
    document.getElementById('l-error').textContent = 'Usuario o contraseña incorrectos.';
    document.getElementById('l-pass').value = '';
  }
}

/* ═══════════════════════════════════════════════════════════
   PANEL ADMIN — navegación
═══════════════════════════════════════════════════════════ */
function openAdmin() {
  document.getElementById('admin-panel').classList.add('open');
  document.getElementById('client-view').style.display  = 'none';
  document.getElementById('client-nav').style.display   = 'none';
  document.getElementById('admin-user-lbl').textContent = '● ' + CREDS.user;
  renderAdminList();
  updateStats();
}
function exitAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
  document.getElementById('client-view').style.display = '';
  document.getElementById('client-nav').style.display  = '';
}
function logout() {
  exitAdmin();
  toast('Sesión cerrada correctamente', 'success');
}

/* ── Stats ── */
function updateStats() {
  document.getElementById('as-total').textContent = cars.length;
  document.getElementById('as-dep').textContent   = cars.filter(c => c.type === 'deportivo').length;
  document.getElementById('as-suv').textContent   = cars.filter(c => c.type === 'suv').length;
  document.getElementById('as-elec').textContent  = cars.filter(c => c.type === 'electrico').length;
}

/* ── Admin list ── */
function renderAdminList() {
  const list = document.getElementById('admin-list');
  list.innerHTML = '';
  if (!cars.length) {
    list.innerHTML = '<p style="color:var(--gray);text-align:center;padding:40px;">No hay vehículos en el catálogo.</p>';
    return;
  }
  cars.forEach(car => {
    const thumb = car.images && car.images[0]
      ? car.images[0]
      : 'https://placehold.co/68x46/1a1a1a/c8a96e?text=IMG';
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <img class="admin-thumb" src="${thumb}" alt="${car.name}" onerror="this.src='https://placehold.co/68x46/1a1a1a/c8a96e?text=IMG'">
      <div class="admin-row-info">
        <div class="rname">${car.brand} ${car.name}</div>
        <div class="rmeta">${car.power} · ${car.speed} · ${car.maxSpeed} · ${car.images ? car.images.length : 0} img</div>
      </div>
      <div class="admin-row-price">${car.price}</div>
      <div class="admin-row-type">${car.type}</div>
      <div class="row-actions">
        <button class="btn-edit-sm" onclick="openEdit(${car.id})">Editar</button>
        <button class="btn-del-sm"  onclick="confirmDel(${car.id},'${car.brand} ${car.name}')">Eliminar</button>
      </div>`;
    list.appendChild(row);
  });
}

/* ═══════════════════════════════════════════════════════════
   AGREGAR AUTO
═══════════════════════════════════════════════════════════ */
function addCar() {
  const brand = v('f-brand'), name = v('f-name'), price = v('f-price'), desc = v('f-desc');
  if (!brand || !name || !price || !desc || !formImages.length) {
    toast('Completa los campos obligatorios (*) y agrega al menos una imagen', 'error');
    return;
  }
  const car = {
    id:       nextId++,
    brand, name, price, desc,
    type:     document.getElementById('f-type').value,
    power:    v('f-power')    || '—',
    speed:    v('f-speed')    || '—',
    maxSpeed: v('f-maxspeed') || '—',
    badge:    v('f-badge'),
    images:   formImages.map(i => i.src)
  };
  cars.unshift(car);
  save(); applyFilters(); renderAdminList(); updateStats(); resetForm();
  toast(`${brand} ${name} agregado al catálogo`, 'success');
}

function v(id) { return document.getElementById(id).value.trim(); }

function resetForm() {
  ['f-brand','f-name','f-price','f-power','f-speed','f-maxspeed','f-badge','f-desc']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').value = 'sedan';
  formImages = [];
  renderImgManager('f');
}

/* ═══════════════════════════════════════════════════════════
   EDITAR AUTO
═══════════════════════════════════════════════════════════ */
function openEdit(id) {
  const c = cars.find(x => x.id === id);
  if (!c) return;
  editingId = id;

  document.getElementById('e-brand').value    = c.brand;
  document.getElementById('e-name').value     = c.name;
  document.getElementById('e-price').value    = c.price;
  document.getElementById('e-type').value     = c.type;
  document.getElementById('e-power').value    = c.power;
  document.getElementById('e-speed').value    = c.speed;
  document.getElementById('e-maxspeed').value = c.maxSpeed;
  document.getElementById('e-badge').value    = c.badge || '';
  document.getElementById('e-desc').value     = c.desc;

  // cargar imágenes existentes
  editImages = (c.images || []).map(src => ({ src }));
  renderImgManager('e');

  document.getElementById('edit-overlay').classList.add('open');
}

function editAddUrl() {
  const input = document.getElementById('e-img-url');
  const url   = input.value.trim();
  if (!url || !url.startsWith('http')) { toast('URL inválida', 'error'); return; }
  editImages.push({ src: url });
  renderImgManager('e');
  input.value = '';
}

function editAddFiles(input) {
  addImgFiles(input, 'e');
}

function closeEdit(e) {
  if (e && e.target !== document.getElementById('edit-overlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('edit-overlay').classList.remove('open');
  editingId = null; editImages = [];
}

function saveEdit() {
  const c = cars.find(x => x.id === editingId);
  if (!c) return;
  c.brand    = document.getElementById('e-brand').value.trim();
  c.name     = document.getElementById('e-name').value.trim();
  c.price    = document.getElementById('e-price').value.trim();
  c.type     = document.getElementById('e-type').value;
  c.power    = document.getElementById('e-power').value.trim();
  c.speed    = document.getElementById('e-speed').value.trim();
  c.maxSpeed = document.getElementById('e-maxspeed').value.trim();
  c.badge    = document.getElementById('e-badge').value.trim();
  c.desc     = document.getElementById('e-desc').value.trim();
  c.images   = editImages.map(i => i.src);
  save(); applyFilters(); renderAdminList(); updateStats();
  closeEdit(); toast(`${c.brand} ${c.name} actualizado`, 'success');
}

/* ═══════════════════════════════════════════════════════════
   ELIMINAR AUTO
═══════════════════════════════════════════════════════════ */
function confirmDel(id, label) {
  document.getElementById('confirm-msg').textContent =
    `¿Eliminar "${label}" del catálogo? Esta acción no se puede deshacer.`;
  document.getElementById('confirm-overlay').classList.add('open');
  document.getElementById('confirm-btn').onclick = () => {
    cars = cars.filter(c => c.id !== id);
    save(); applyFilters(); renderAdminList(); updateStats();
    document.getElementById('confirm-overlay').classList.remove('open');
    toast(`${label} eliminado`, 'success');
  };
}

/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('tmsg').textContent = msg;
  document.getElementById('tdot').className   = `tdot ${type}`;
  t.className = `show ${type}`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  load();
  applyFilters();
  renderImgManager('f'); // inicializa gestor vacío
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  setTimeout(() => document.getElementById('page-loader').classList.add('hidden'), 2200);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal(); closeLogin(); closeEdit();
    document.getElementById('confirm-overlay').classList.remove('open');
  }
  // flechas del teclado en el modal
  if (document.getElementById('modal-bg').classList.contains('open')) {
    if (e.key === 'ArrowRight') { clearInterval(modalInterval); galleryNext(); }
    if (e.key === 'ArrowLeft')  { clearInterval(modalInterval); galleryPrev(); }
  }
});
