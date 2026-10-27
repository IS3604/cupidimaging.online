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
  ['Vascular Ultrasounds', 'Bilateral Lower Extremity Venous Doppler', 300],
  ['Vascular Ultrasounds', 'Unilateral Lower Extremity Venous Doppler', 200],
  ['Vascular Ultrasounds', 'Bilateral Upper Extremity Venous Doppler', 300],
  ['Vascular Ultrasounds', 'Unilateral Upper Extremity Venous Doppler', 200],
  ['Vascular Ultrasounds', 'Bilateral Lower Extremity Arterial Doppler', 300],
  ['Vascular Ultrasounds', 'Unilateral Lower Extremity Arterial Doppler', 200],
  ['Vascular Ultrasounds', 'Bilateral Upper Extremity Arterial Doppler', 300],
  ['Vascular Ultrasounds', 'Unilateral Upper Extremity Arterial Doppler', 200],
  ['Vascular Ultrasounds', 'Complete Carotid Artery Doppler', 350],
  ['Vascular Ultrasounds', 'Carotid Intima-Media Thickness (CIMT)', 150],
  ['Vascular Ultrasounds', 'Limited Ankle-Brachial Index (ABI)', 75],
  ['Vascular Ultrasounds', 'Venous Reflux Ultrasound', 300],
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
  ['Echocardiogram', 'Complete Thoracic Echocardiogram', 500],
];


const CATEGORIES = {
  'Abdominal & Pelvic':    { title: 'Abdominal & Pelvic',    icon: 'scan',     img: 'images/abdominal.jpg', pos: '45% 55%', alt: "Sonographer performing an abdominal ultrasound on a patient's stomach" },
  'Vascular Ultrasounds':    { title: 'Vascular Ultrasounds',    icon: 'pulse',    img: 'images/vascular.jpg', pos: '50% 40%', alt: "Ultrasound probe scanning a patient's carotid artery in the neck" },
  'Thyroid & Soft Tissue': { title: 'Thyroid & Soft Tissue', icon: 'user',     img: 'images/thyroid.jpg', pos: '50% 72%', alt: "Sonographer performing a thyroid ultrasound on a patient's neck" },
  'Obstetric / Pregnancy': { title: 'Obstetric Ultrasounds', icon: 'baby',     img: 'images/pregnancy.jpg', pos: '50% 50%', alt: 'Sonographer performing a pregnancy ultrasound with the baby shown on screen' },
  'Echocardiogram':        { title: 'Echocardiogram',        icon: 'activity', img: 'images/cardiac.jpg', pos: '50% 50%', alt: 'Colour Doppler echocardiogram showing blood flow through the heart' },
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
        <figcaption><h3>${c.title}</h3><span>${items.length} exam${items.length === 1 ? '' : 's'}</span></figcaption>
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
  const examSelect = $('#fExam');
  const groups = [...new Set(SERVICES.map(([group]) => group))];
  groups.forEach((g) => {
    const og = document.createElement('optgroup');
    og.label = CATEGORIES[g].title;
    SERVICES.filter(([group]) => group === g).forEach(([, name, price]) => og.append(new Option(`${name} ($${price})`, name)));
    examSelect.append(og);
  });

  const inputs = [...form.querySelectorAll('input, select')];
  const status = $('#formMessage');
  const isValid = (i) => i.value.trim() !== '' && i.checkValidity();

  function update() {
    inputs.forEach((i) => i.closest('.field').classList.toggle('valid', isValid(i)));
  }

  inputs.forEach((i) => { i.addEventListener('input', update); i.addEventListener('change', update); });
  update();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = inputs.find((i) => !isValid(i));
    if (bad) {
      status.textContent = bad === examSelect ? 'Please choose an exam.' : `Please enter a valid ${bad.closest('.field').querySelector('label').textContent.toLowerCase()}.`;
      status.className = 'form-message warning';
      bad.focus();
      return;
    }
    const d = new FormData(form);
    const body = `Appointment request: Cupid Imaging LLC\n\nName: ${d.get('name')}\nEmail: ${d.get('email')}\nPhone: ${d.get('phone')}\nCity / ZIP: ${d.get('location')}
Exam: ${d.get('exam')}
Details: ${d.get('details').trim() || '-'}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Mobile ultrasound appointment request')}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email app should open with the request. Send that email and we will call to confirm.';
    status.className = 'form-message success';
  });
})();

/* ---------- Exam dropdown: custom list that fits the screen (bottom sheet on phones) ---------- */
(function examDropdown() {
  const select = $('#fExam');
  if (!select) return;
  const phone = window.matchMedia('(max-width: 600px)');
  const placeholder = select.options[0].text;
  const label = document.querySelector('label[for="fExam"]');
  label.id = 'fExamLabel';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.id = 'fExamBtn';
  trigger.className = 'dd-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'examList');
  trigger.setAttribute('aria-labelledby', 'fExamLabel fExamValue');
  trigger.innerHTML = '<span class="dd-value" id="fExamValue"></span>';
  const valueEl = trigger.firstChild;
  label.htmlFor = 'fExamBtn';
  select.classList.add('is-enhanced');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  select.after(trigger);
  // The form's validation focuses the select when no exam is chosen; send that focus to the button.
  select.addEventListener('focus', () => trigger.focus());

  const backdrop = document.createElement('div');
  backdrop.className = 'dd-backdrop';
  const panel = document.createElement('div');
  panel.className = 'dd-panel';
  panel.innerHTML = `<div class="dd-head"><strong>${placeholder}</strong><button type="button" class="dd-close" aria-label="Close">${icon('x')}</button></div>
    <div class="dd-list" id="examList" role="listbox" tabindex="-1" aria-labelledby="fExamLabel"></div>`;
  const list = panel.querySelector('.dd-list');

  const opts = [];
  [...select.querySelectorAll('optgroup')].forEach((og, gi) => {
    const group = document.createElement('div');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-labelledby', `examGrp${gi}`);
    const head = document.createElement('div');
    head.className = 'dd-group';
    head.id = `examGrp${gi}`;
    head.textContent = og.label;
    group.append(head);
    [...og.children].forEach((o) => {
      const m = o.text.match(/^(.*) \((\$\d+)\)$/);
      const opt = document.createElement('div');
      opt.className = 'dd-opt';
      opt.id = `examOpt${opts.length}`;
      opt.setAttribute('role', 'option');
      opt.dataset.value = o.value;
      const name = document.createElement('span');
      name.textContent = m ? m[1] : o.text;
      const price = document.createElement('b');
      price.textContent = m ? m[2] : '';
      opt.append(name, price);
      opt.addEventListener('click', () => choose(opt));
      opt.addEventListener('mousemove', () => { if (opts[active] !== opt) setActive(opts.indexOf(opt), false); });
      group.append(opt);
      opts.push(opt);
    });
    list.append(group);
  });
  document.body.append(backdrop, panel);

  let active = -1;
  let isOpen = false;

  function setActive(i, scroll = true) {
    if (opts[active]) opts[active].classList.remove('active');
    active = Math.max(0, Math.min(opts.length - 1, i));
    const o = opts[active];
    o.classList.add('active');
    list.setAttribute('aria-activedescendant', o.id);
    if (scroll) o.scrollIntoView({ block: 'nearest' });
  }

  function render() {
    const has = select.value !== '';
    valueEl.textContent = has ? select.selectedOptions[0].text : placeholder;
    trigger.classList.toggle('placeholder', !has);
    opts.forEach((o) => o.setAttribute('aria-selected', String(has && o.dataset.value === select.value)));
  }

  // Desktop: sit under the field (or above it if there is more room), same width, never past the screen edge.
  // Phone: CSS turns the panel into a bottom sheet.
  function layout() {
    const sheet = phone.matches;
    backdrop.classList.toggle('open', sheet);
    document.documentElement.classList.toggle('dd-lock', sheet);
    if (sheet) { panel.style.cssText = ''; return; }
    const r = trigger.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { close(false); return; }
    const gap = 6;
    const edge = 12;
    const below = innerHeight - r.bottom - gap - edge;
    const above = r.top - gap - edge;
    const up = below < 240 && above > below;
    panel.style.left = `${r.left}px`;
    panel.style.width = `${r.width}px`;
    panel.style.maxHeight = `${Math.max(160, Math.min(360, up ? above : below))}px`;
    panel.style.top = up ? '' : `${r.bottom + gap}px`;
    panel.style.bottom = up ? `${innerHeight - r.top + gap}px` : '';
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    panel.classList.add('open');
    layout();
    trigger.setAttribute('aria-expanded', 'true');
    list.focus({ preventScroll: true });
    const cur = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
    if (cur >= 0) {
      setActive(cur, false);
      opts[cur].scrollIntoView({ block: 'center' });
    } else {
      if (opts[active]) opts[active].classList.remove('active');
      active = -1;
      list.removeAttribute('aria-activedescendant');
      list.scrollTop = 0;
    }
  }

  function close(refocus = true) {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    document.documentElement.classList.remove('dd-lock');
    trigger.setAttribute('aria-expanded', 'false');
    if (refocus) trigger.focus({ preventScroll: true });
  }

  function choose(opt) {
    select.value = opt.dataset.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    render();
    close();
  }

  trigger.addEventListener('click', () => (isOpen ? close() : open()));
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
  });

  let typed = '';
  let typedTimer;
  list.addEventListener('keydown', (e) => {
    const keys = {
      ArrowDown: () => setActive(active + 1),
      ArrowUp: () => setActive(active < 0 ? opts.length - 1 : active - 1),
      Home: () => setActive(0),
      End: () => setActive(opts.length - 1),
      PageDown: () => setActive(active + 8),
      PageUp: () => setActive(active - 8),
      Enter: () => { if (active >= 0) choose(opts[active]); },
      ' ': () => { if (active >= 0) choose(opts[active]); },
      Escape: () => close(),
      Tab: () => close(),
    };
    if (keys[e.key]) { e.preventDefault(); keys[e.key](); return; }
    // Type a few letters to jump to a matching exam.
    if (e.key.length === 1 && e.key.trim()) {
      clearTimeout(typedTimer);
      typed += e.key.toLowerCase();
      typedTimer = setTimeout(() => { typed = ''; }, 600);
      const start = typed.length === 1 ? active + 1 : Math.max(active, 0);
      const order = [...opts.slice(start), ...opts.slice(0, start)];
      const hit = order.find((o) => o.firstChild.textContent.toLowerCase().startsWith(typed));
      if (hit) setActive(opts.indexOf(hit));
    }
  });

  backdrop.addEventListener('click', () => close());
  panel.querySelector('.dd-close').addEventListener('click', () => close());
  document.addEventListener('pointerdown', (e) => {
    if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) close(false);
  });
  window.addEventListener('resize', () => { if (isOpen) layout(); });
  window.addEventListener('scroll', () => { if (isOpen && !phone.matches) layout(); }, { passive: true });
  select.addEventListener('change', render);
  render();
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
