/* =====================================================
   ORDAH · MAIN SCRIPT (vanilla JS, no libraries)
   ===================================================== */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. NAV: shadow on scroll + mobile menu ---------- */
const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => {   // close menu after choosing a link
  menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
}));

/* ---------- 2. SCROLL REVEAL ---------- */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, { threshold: .15 });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; revealIO.observe(el); });

/* ---------- 3. STAT COUNTERS (count up once when visible) ---------- */
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = reduced ? 0 : 1600;
    const tick = (t) => {
      const p = dur ? Math.min((t - t0) / dur, 1) : 1;
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));   // ease-out
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); countIO.unobserve(el);
  });
}, { threshold: .6 });
$$('[data-count]').forEach(el => countIO.observe(el));

/* ---------- 4. COURSE TABS ---------- */
$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab.dataset.tab));
}));

/* ---------- 5. HERO PARALLAX + CURSOR GLOW (mouse devices only) ---------- */
if (matchMedia('(pointer: fine)').matches && !reduced) {
  const cursor = $('.cursor'), cards = $$('.float-card');
  addEventListener('mousemove', (e) => {
    cursor.classList.add('on');
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    const dx = (innerWidth / 2 - e.clientX) / innerWidth, dy = (innerHeight / 2 - e.clientY) / innerHeight;
    cards.forEach(c => { const d = +c.dataset.depth; c.style.transform = `translate(${dx * d}px, ${dy * d}px)`; });
  });
  document.addEventListener('mouseleave', () => cursor.classList.remove('on'));
}

/* ---------- 6. CONTACT FORM (front-end only: connect to your backend/service) ---------- */
$('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  $('#form-note').textContent = 'Thank you! We\'ll be in touch shortly.';
  e.target.reset();
});
