/* ════════════════════════════════════════
   PREMIUM ANIMATION ENGINE — Local Grow
   ════════════════════════════════════════ */

// ── 0. THEME TOGGLE (light / dark, remembers choice) ──
(function() {
  const stored = localStorage.getItem('lg-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (systemPrefersDark ? 'dark' : 'light');
  if (initial === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('lg-theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('lg-theme', 'dark');
        }
      });
    });
  });
})();

// ── reduced-motion flag, used to skip heavy decorative effects below ──
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. PAGE LOADER ──────────────────────
(function() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-logo">
      <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="llg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#8c6d1f"/>
            <stop offset="100%" stop-color="#d4aa50"/>
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="17" fill="url(#llg)"/>
        <path d="M18 8 C18 8 26 13 26 20 C26 25 22.5 28 18 28 C13.5 28 10 25 10 20 C10 13 18 8 18 8Z" fill="rgba(255,255,255,0.28)"/>
        <line x1="18" y1="28" x2="18" y2="32" stroke="rgba(255,255,255,.6)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M18 14 C14 19 13 23 13 23" stroke="rgba(255,255,255,.5)" stroke-width="1" stroke-linecap="round" fill="none"/>
        <circle cx="22" cy="10" r="1.2" fill="rgba(255,255,255,.7)"/>
      </svg>
      <span class="loader-logo-text">Local Grow</span>
    </div>
    <div class="loader-bar-wrap"><div class="loader-bar"></div></div>
  `;
  document.body.prepend(loader);
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, 900);
  });
})();

// ── 2. SCROLL PROGRESS BAR ──────────────
const progress = document.createElement('div');
progress.id = 'scroll-progress';
document.body.prepend(progress);
window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / max * 100) + '%';
}, { passive: true });

// ── 3. FLOATING CANVAS PARTICLES ────────
(function() {
  if (prefersReducedMotion) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const GOLD = [
    'rgba(184,146,42,',
    'rgba(212,170,80,',
    'rgba(140,109,31,',
  ];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 2.5 + .5;
      this.vx = (Math.random() - .5) * .4;
      this.vy = -(Math.random() * .6 + .2);
      this.alpha = Math.random() * .5 + .15;
      this.color = GOLD[Math.floor(Math.random() * GOLD.length)];
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * .03 + .01;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.twinkle += this.twinkleSpeed;
      this.currentAlpha = this.alpha * (.7 + .3 * Math.sin(this.twinkle));
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentAlpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 55; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── 4. SCROLL REVEAL ────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-flip');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── 5. SECTION TITLE LETTER SPLIT ───────
document.querySelectorAll('.section-title').forEach(title => {
  const html = title.innerHTML;
  const lines = html.split('<br>');
  title.innerHTML = lines.map(line =>
    line.split('').map((ch, i) =>
      ch === ' ' ? ' ' : `<span class="split-char" style="transition-delay:${i * 0.04}s">${ch}</span>`
    ).join('')
  ).join('<br>');

  const chars = title.querySelectorAll('.split-char');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        chars.forEach(c => c.classList.add('visible'));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(title);
});

// ── 6. ANIMATED NUMBER COUNTER ──────────
function animateCount(el, target, prefix='', suffix='', duration=1800) {
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = prefix + Math.floor(eased * target).toLocaleString('en-IN') + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent.trim();
    if (text === '20+')    animateCount(el, 20, '', '+');
    if (text === '₹1,000') animateCount(el, 1000, '₹', '');
    if (text === '40%')    animateCount(el, 40, '', '%');
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

// ── 7. MAGNETIC BUTTONS ─────────────────
if (!prefersReducedMotion)
document.querySelectorAll('.btn-gold, .btn-outline, .nav-cta, .btn-white').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * .18}px, ${y * .18}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── 8. 3D CARD TILT ─────────────────────
if (!prefersReducedMotion)
document.querySelectorAll('.service-card, .project-card, .perk, .step-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-5px) scale(1.02)`;
    card.style.transition = 'transform .08s linear, border-color .3s, box-shadow .3s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1), border-color .3s, box-shadow .3s';
  });
});

// ── 9. GOLD CURSOR TRAIL ────────────────
(function() {
  if (prefersReducedMotion) return;
  const TRAIL = 14;
  const dots = [];
  for (let i = 0; i < TRAIL; i++) {
    const d = document.createElement('div');
    const size = 7 - i * 0.42;
    d.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:${size}px; height:${size}px; border-radius:50%;
      background:radial-gradient(circle, rgba(212,170,80,${.75 - i*.04}), rgba(184,146,42,${.3 - i*.02}));
      transform:translate(-50%,-50%);
      top:0; left:0; will-change:left,top;
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(d);
    dots.push({ el: d, x: -100, y: -100 });
  }

  let mx = -100, my = -100;
  let isMoving = false, moveTimer;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    isMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => isMoving = false, 150);
  });

  (function loop() {
    let lx = mx, ly = my;
    dots.forEach((d, i) => {
      d.el.style.left = lx + 'px';
      d.el.style.top  = ly + 'px';
      d.el.style.opacity = isMoving ? 1 : Math.max(0, 1 - i * .07);
      const prev = dots[i - 1];
      if (prev) { lx += (prev.x - lx) * .38; ly += (prev.y - ly) * .38; }
      d.x = lx; d.y = ly;
    });
    requestAnimationFrame(loop);
  })();

  // sparkle burst on click
  document.addEventListener('click', e => {
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('div');
      const angle = (i / 8) * Math.PI * 2;
      const dist  = 30 + Math.random() * 30;
      spark.style.cssText = `
        position:fixed; pointer-events:none; z-index:10000;
        width:5px; height:5px; border-radius:50%;
        background:rgba(212,170,80,.9);
        left:${e.clientX}px; top:${e.clientY}px;
        transform:translate(-50%,-50%);
        transition: all .55s cubic-bezier(.16,1,.3,1);
      `;
      document.body.appendChild(spark);
      requestAnimationFrame(() => {
        spark.style.left   = (e.clientX + Math.cos(angle) * dist) + 'px';
        spark.style.top    = (e.clientY + Math.sin(angle) * dist) + 'px';
        spark.style.opacity = '0';
        spark.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      setTimeout(() => spark.remove(), 600);
    }
  });
})();

// ── 10. NAVBAR SCROLL SHRINK ────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── 11. PERK ICON BOUNCE ─────────────────
document.querySelectorAll('.perk').forEach(perk => {
  perk.addEventListener('mouseenter', () => {
    const icon = perk.querySelector('.perk-icon');
    icon.style.animation = 'none';
    requestAnimationFrame(() => {
      icon.style.animation = 'icon-bounce .65s cubic-bezier(.34,1.56,.64,1)';
    });
  });
});

// ── 12. SERVICE ICON SPIN ────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.service-icon');
    icon.style.transform  = 'rotate(20deg) scale(1.25)';
    icon.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
    icon.style.display    = 'inline-block';
  });
  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.service-icon');
    icon.style.transform = 'rotate(0deg) scale(1)';
  });
});

// ── 13. PARALLAX HERO VISUAL ─────────────
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-visual');
  if (!hero) return;
  const offset = window.scrollY;
  hero.style.transform = `translateY(${offset * .07}px)`;
}, { passive: true });

// ── 14. ACTIVE NAV LINK (multi-page site) ──
// Highlights the nav link matching the current page URL, both desktop and mobile menus.
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-links-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// ── 15. CTA BANNER PARALLAX TEXT ─────────
const ctaBanner = document.querySelector('.cta-banner');
if (ctaBanner) {
  window.addEventListener('scroll', () => {
    const r = ctaBanner.getBoundingClientRect();
    const center = r.top + r.height / 2 - window.innerHeight / 2;
    ctaBanner.querySelector('.cta-title').style.transform = `translateX(${center * -.04}px)`;
  }, { passive: true });
}

// ── 16. MOBILE NAVIGATION MENU ───────────
// Toggles the slide-in nav panel + dim overlay, and closes on link click or overlay click.
(function() {
  const toggle  = document.getElementById('nav-toggle');
  const panel   = document.getElementById('nav-links-mobile');
  const overlay = document.getElementById('nav-overlay');
  if (!toggle || !panel || !overlay) return;

  function openMenu() {
    toggle.classList.add('open');
    panel.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll while menu is open
  }
  function closeMenu() {
    toggle.classList.remove('open');
    panel.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // close menu automatically if the viewport is resized back to desktop width
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
})();

// ── 17. FAQ ACCORDION ────────────────────
// Expands/collapses one FAQ answer at a time; clicking an open item closes it.
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── 18. CONTACT FORM (client-side only, no backend) ──
// Validates required fields with the browser's built-in validation, then shows
// a success message instead of actually sending anything (no backend exists yet).
(function() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    success.classList.add('visible');
    form.reset();
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // hide the success message again after a while if the user keeps interacting with the page
    clearTimeout(form._successTimer);
    form._successTimer = setTimeout(() => success.classList.remove('visible'), 8000);
  });
})();

// ── 19. BACK TO TOP BUTTON ───────────────
(function() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
