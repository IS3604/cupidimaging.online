/* Cupid Imaging LLC — page behaviour */
document.documentElement.classList.add('js');

/* ---------- Settings: edit contact email and prices here ---------- */
const CONTACT_EMAIL = 'appointment@cupidimaging.online';

const SERVICES = [
  ['Abdominal & Pelvic', 'Complete Abdominal Ultrasound', 300],
  ['Abdominal & Pelvic', 'Limited Abdominal Ultrasound', 250],
  ['Abdominal & Pelvic', 'Complete Renal / Kidney Ultrasound', 200],
  ['Abdominal & Pelvic', 'Limited Renal / Kidney Ultrasound', 100],
  ['Abdominal & Pelvic', 'Bladder Ultrasound', 100],
  ['Abdominal & Pelvic', 'Complete Pelvic Ultrasound (Transabdominal)', 300],
  ['Abdominal & Pelvic', 'Limited Pelvic Ultrasound (Transabdominal)', 200],
  ['Abdominal & Pelvic', 'Abdominal Aortic Aneurysm (AAA) Screening', 150],
  ['Abdominal & Pelvic', 'Complete Abdominal Organ Arterial & Venous Duplex', 200],
  ['Abdominal & Pelvic', 'Scrotal / Testicular Ultrasound', 300],
  ['Vascular & Doppler', 'Bilateral Lower Extremity Venous Doppler', 300],
  ['Vascular & Doppler', 'Unilateral Lower Extremity Venous Doppler', 200],
  ['Vascular & Doppler', 'Bilateral Upper Extremity Venous Doppler', 300],
  ['Vascular & Doppler', 'Unilateral Upper Extremity Venous Doppler', 200],
  ['Vascular & Doppler', 'Bilateral Lower Extremity Arterial Doppler', 300],
  ['Vascular & Doppler', 'Unilateral Lower Extremity Arterial Doppler', 200],
  ['Vascular & Doppler', 'Bilateral Upper Extremity Arterial Doppler', 300],
  ['Vascular & Doppler', 'Unilateral Upper Extremity Arterial Doppler', 200],
  ['Vascular & Doppler', 'Complete Carotid Artery Doppler', 350],
  ['Vascular & Doppler', 'Carotid Intima-Media Thickness (CIMT)', 150],
  ['Vascular & Doppler', 'Limited Ankle-Brachial Index (ABI)', 75],
  ['Vascular & Doppler', 'Venous Reflux Ultrasound', 300],
  ['Thyroid & Soft Tissue', 'Thyroid Ultrasound', 250],
  ['Thyroid & Soft Tissue', 'Head & Neck Soft Tissue Ultrasound', 150],
  ['Thyroid & Soft Tissue', 'Chest Wall Soft Tissue Ultrasound', 150],
  ['Thyroid & Soft Tissue', 'Groin Soft Tissue Ultrasound', 150],
  ['Thyroid & Soft Tissue', 'Upper Extremity Soft Tissue Ultrasound', 150],
  ['Thyroid & Soft Tissue', 'Lower Extremity Soft Tissue Ultrasound', 150],
  ['Obstetric / Pregnancy', 'Complete Obstetric Ultrasound', 350],
  ['Obstetric / Pregnancy', 'Limited Obstetric Ultrasound', 200],
  ['Obstetric / Pregnancy', 'Follow-Up Obstetric Ultrasound', 250],
  ['Obstetric / Pregnancy', 'Fetal Biophysical Profile (BPP)', 350],
  ['Obstetric / Pregnancy', 'Detailed Fetal Anatomical Survey', 300],
  ['Obstetric / Pregnancy', 'Additional Fetus Detailed Anatomy Ultrasound', 350],
  ['Cardiac', 'Complete Thoracic Echocardiogram', 500],
];


const CATEGORIES = {
  'Abdominal & Pelvic':    { title: 'Abdominal & Pelvic',    icon: 'scan',     img: 'images/abdominal.jpg', pos: '45% 55%', alt: "Sonographer performing an abdominal ultrasound on a patient's stomach" },
  'Vascular & Doppler':    { title: 'Vascular & Doppler',    icon: 'pulse',    img: 'images/vascular.jpg', pos: '50% 40%', alt: "Ultrasound probe scanning a patient's carotid artery in the neck" },
  'Thyroid & Soft Tissue': { title: 'Thyroid & Soft Tissue', icon: 'user',     img: 'images/thyroid.jpg', pos: '50% 72%', alt: "Sonographer performing a thyroid ultrasound on a patient's neck" },
  'Obstetric / Pregnancy': { title: 'Pregnancy',             icon: 'baby',     img: 'images/pregnancy.jpg', pos: '50% 50%', alt: 'Sonographer performing a pregnancy ultrasound with the baby shown on screen' },
  'Cardiac':               { title: 'Cardiac',               icon: 'activity', img: 'images/cardiac.jpg', pos: '50% 50%', alt: 'Colour Doppler echocardiogram showing blood flow through the heart' },
};

const icon = (name) => `<svg class="ic"><use href="#i-${name}"/></svg>`;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/* ---------- Services: filter, search, collapse ---------- */
(function services() {
  const list = $('#serviceList');
  const search = $('#serviceSearch');
  const buttons = $$('[data-filter]');
  let active = 'all';

  function card(group, items, searching) {
    const c = CATEGORIES[group];
    const art = document.createElement('article');
    art.className = 'cat';
    art.innerHTML = `
      <figure>
        <img src="${c.img}" alt="${c.alt}" loading="lazy" style="object-position:${c.pos}">
        <figcaption><h3><i>${icon(c.icon)}</i>${c.title}</h3><span>${items.length} exam${items.length === 1 ? '' : 's'}</span></figcaption>
      </figure>
      <div class="rows">${items.map(([, name, price]) => `<div class="row"><span>${name}</span><strong>$${price}</strong></div>`).join('')}</div>`;

    if (items.length > 4 && !searching) {
      art.classList.add('collapsible');
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'more';
      const label = () => (art.classList.contains('expanded') ? 'Show fewer' : `Show all ${items.length} exams`);
      more.textContent = label();
      more.addEventListener('click', () => { art.classList.toggle('expanded'); more.textContent = label(); });
      art.append(more);
    }
    return art;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const filtered = SERVICES.filter(([group, name]) => (active === 'all' || group === active) && name.toLowerCase().includes(q));
    const groups = [...new Set(filtered.map(([group]) => group))];

    list.replaceChildren(...groups.map((g) => card(g, filtered.filter(([group]) => group === g), !!q)));
    if (!filtered.length) {
      list.innerHTML = '<p class="empty">No exams match that search. Try another word, or call (478) 312-5966.</p>';
    }
    $('#resultsCount').textContent = `Showing ${filtered.length} exam${filtered.length === 1 ? '' : 's'}`;
  }

  buttons.forEach((b) => b.addEventListener('click', () => {
    active = b.dataset.filter;
    buttons.forEach((x) => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    render();
  }));
  search.addEventListener('input', render);
  render();
})();

/* ---------- Appointment form ---------- */
(function form() {
  const form = $('#appointmentForm');
  const inputs = [...form.querySelectorAll('input')];
  const status = $('#formMessage');
  const isValid = (i) => i.value.trim() !== '' && i.checkValidity();

  function update() {
    inputs.forEach((i) => i.closest('.field').classList.toggle('valid', isValid(i)));
  }

  inputs.forEach((i) => i.addEventListener('input', update));
  update();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = inputs.find((i) => !isValid(i));
    if (bad) {
      status.textContent = `Please enter a valid ${bad.closest('.field').querySelector('label').textContent.toLowerCase()}.`;
      status.className = 'form-message warning';
      bad.focus();
      return;
    }
    const d = new FormData(form);
    const body = `Appointment request: Cupid Imaging LLC\n\nName: ${d.get('name')}\nEmail: ${d.get('email')}\nPhone: ${d.get('phone')}\nCity / ZIP: ${d.get('location')}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Mobile ultrasound appointment request')}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email app should open with the request. Send that email and we will call to confirm.';
    status.className = 'form-message success';
  });
})();

/* ---------- "What to expect" tabs (phones only) ---------- */
(function tabs() {
  const tabs = $$('.tabs [role=tab]');
  const phone = matchMedia('(max-width: 600px)');

  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = phone.matches && !on;
    });
  }
  const current = () => tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];

  tabs.forEach((t) => t.addEventListener('click', () => select(t)));
  phone.addEventListener('change', () => select(current()));
  select(current());
})();

/* ---------- Mobile menu ---------- */
(function menu() {
  const btn = $('#menuBtn');
  const close = $('#menuClose');
  const nav = $('#navLinks');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('menu-lock', open);
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', () => setMenu(true));
  close.addEventListener('click', () => { setMenu(false); btn.focus(); });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });
})();

/* ---------- Mobile quick bar: hidden over hero, form and footer ---------- */
(function quickBar() {
  const bar = $('.m-bar');
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    bar.classList.toggle('show', visible.size === 0);
  });
  [$('#home'), $('#appointment'), $('footer')].forEach((el) => io.observe(el));
})();

/* ---------- Subtle scroll reveal ---------- */
(function reveal() {
  const els = $$('.rv');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  els.forEach((el) => io.observe(el));
})();

$('#year').textContent = new Date().getFullYear();
