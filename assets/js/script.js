// assets/js/script.js
// JS optimizado: AOS, Swipers, nav, hero video, tsParticles, auth modal, toggles y AJAX.

document.addEventListener('DOMContentLoaded', () => {

  /* ====================
     AOS init
     ==================== */
  if (window.AOS) {
    try {
      AOS.init({ once: true, offset: 80, duration: 700, easing: 'ease-out-cubic' });
    } catch (err) { console.warn('AOS init error', err); }
  }

  /* ====================
     Swipers init
     ==================== */
  if (window.Swiper) {
    try {
      new Swiper('.hero-swiper', {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
        a11y: true
      });
      new Swiper('.media-swiper', {
        loop: true,
        navigation: { nextEl: '.media-swiper .swiper-button-next', prevEl: '.media-swiper .swiper-button-prev' },
        slidesPerView: 1,
        a11y: true
      });
    } catch (err) { console.warn('Swiper init error', err); }
  }

  /* ====================
     Navbar shrink on scroll
     ==================== */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ====================
     Smooth internal links
     ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { bootstrap.Collapse.getOrCreateInstance('#navContent').hide(); } catch {}
      }
    });
  });

  /* ====================
     Hero video control
     ==================== */
  (function () {
    const heroVideo = document.getElementById('heroVideo');
    const toggleBtn = document.getElementById('toggleVideo');
    if (!heroVideo) return;

    // Auto pause/play with IntersectionObserver
    if ('IntersectionObserver' in window) {
      try {
        const io = new IntersectionObserver(entries => {
          entries.forEach(en => {
            if (en.isIntersecting) {
              if (heroVideo.paused && heroVideo.dataset.manualPause !== 'true') {
                heroVideo.play().catch(() => {});
              }
            } else if (!heroVideo.paused) {
              heroVideo.pause();
            }
          });
        }, { threshold: 0.25 });
        io.observe(document.querySelector('.hero') || document.querySelector('.hero-media') || document.body);
      } catch (err) { console.warn('Hero IO error', err); }
    }

    // Manual toggle
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play().catch(() => {});
          heroVideo.removeAttribute('data-manual-pause');
          toggleBtn.setAttribute('aria-pressed', 'false');
          toggleBtn.innerHTML = '<i class="bi bi-pause-circle"></i> Pausar video';
        } else {
          heroVideo.pause();
          heroVideo.dataset.manualPause = 'true';
          toggleBtn.setAttribute('aria-pressed', 'true');
          toggleBtn.innerHTML = '<i class="bi bi-play-circle"></i> Reproducir video';
        }
      });
    }
  })();

  /* ====================
     tsParticles
     ==================== */
  (async () => {
    if (!window.tsParticles) return;
    try {
      const isSmall = window.matchMedia('(max-width:700px)').matches;
      await tsParticles.load({
        id: 'particles',
        options: {
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          particles: {
            number: { value: isSmall ? 18 : 40 },
            color: { value: ['#00f7ff', '#7c4dff'] },
            opacity: { value: 0.55 },
            size: { value: { min: 1, max: 3 } },
            links: { enable: true, color: '#6ecbff', opacity: .22, distance: isSmall ? 90 : 130 },
            move: { enable: true, speed: 1.2 }
          },
          interactivity: {
            events: { onHover: { enable: true, mode: 'repulse' } },
            modes: { repulse: { distance: 120 } }
          }
        }
      });
    } catch (err) { console.warn('tsParticles load error', err); }
  })();

  /* ====================
     Auth Modal (tabs, toggles, pw meter, AJAX)
     ==================== */
  (function () {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');
    const tabBtns = authModal.querySelectorAll('.tab-btn');
    const switchers = authModal.querySelectorAll('.switch-to');
    const togglePassBtns = authModal.querySelectorAll('.toggle-pass');
    const pwFill = authModal.querySelector('.pw-fill');
    const oauthDiscord = authModal.querySelector('#oauthDiscord');
    const oauthTwitch = authModal.querySelector('#oauthTwitch');

    // Toast util
    function createMicroToast(msg, isError = false) {
      const el = document.createElement('div');
      el.className = 'auth-toast';
      el.style.background = isError ? 'linear-gradient(90deg,#ffb5b5,#ff7a45)' : 'linear-gradient(90deg,#b8ffda,#00f7ff)';
      Object.assign(el.style, {
        color: '#021417', padding: '10px 14px', borderRadius: '10px',
        position: 'fixed', right: '20px', bottom: '24px',
        zIndex: 99999, fontWeight: '700', opacity: '0'
      });
      el.textContent = msg;
      document.body.appendChild(el);
      requestAnimationFrame(() => el.style.opacity = '1');
      setTimeout(() => { try { el.remove(); } catch {} }, 3000);
    }

    // Show form by id + sync tabs
    function showForm(id) {
      [loginForm, registerForm, forgotForm].forEach(f => f?.classList.remove('show'));
      document.getElementById(id)?.classList.add('show');
      tabBtns.forEach(btn => {
        const active = btn.dataset.target === id;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', active);
      });
      setTimeout(() => document.getElementById(id)?.querySelector('input,button')?.focus(), 120);
    }

    tabBtns.forEach(btn => btn.addEventListener('click', () => showForm(btn.dataset.target)));
    switchers.forEach(link => link.addEventListener('click', e => {
      e.preventDefault(); if (link.dataset.target) showForm(link.dataset.target);
    }));

    togglePassBtns.forEach(btn => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = '1';
      btn.addEventListener('click', () => {
        const input = btn.closest('.position-relative')?.querySelector('.password-field');
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    });

    // Password strength (register)
    if (registerForm && pwFill) {
      const pw = registerForm.querySelector('input[name="password"]');
      pw?.addEventListener('input', () => {
        const v = pw.value || '';
        let s = 0;
        if (v.length >= 8) s += 30;
        if (/[A-Z]/.test(v)) s += 20;
        if (/[0-9]/.test(v)) s += 20;
        if (/[^A-Za-z0-9]/.test(v)) s += 20;
        if (v.length >= 12) s += 10;
        s = Math.min(100, s);
        pwFill.style.width = s + '%';
        pwFill.style.background = s < 40
          ? 'linear-gradient(90deg,#ff4d4f,#ff7a45)'
          : s < 75
            ? 'linear-gradient(90deg,#ffd54f,#ff7a45)'
            : 'linear-gradient(90deg,#4af77a,#00f7ff)';
      });
    }

    // Bootstrap modal events
    authModal.addEventListener('show.bs.modal', () => {
      if (loginForm) showForm('loginForm');
      if (window.gsap) {
        const dialog = authModal.querySelector('.modal-content');
        gsap.fromTo(dialog, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .36, ease: 'power3.out' });
      }
    });
    authModal.addEventListener('shown.bs.modal', () => {
      authModal.querySelector('.auth-form.show input, .auth-form.show button')?.focus();
    });
    authModal.addEventListener('hide.bs.modal', () => {
      if (window.gsap) {
        const dialog = authModal.querySelector('.modal-content');
        gsap.to(dialog, { y: 10, opacity: 0, duration: .22, ease: 'power1.in' });
      }
    });

    // AJAX form submit
    [loginForm, registerForm, forgotForm].forEach(form => {
      if (!form || form.dataset.bound) return;
      form.dataset.bound = '1';
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          if (window.gsap) gsap.fromTo(form, { x: -6 }, { x: 0, duration: .18, ease: 'elastic.out(1,.6)' });
          return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        const origHtml = submitBtn?.innerHTML;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin me-2"></i>Procesando...';
        }
        try {
          const res = await fetch(form.getAttribute('action') || window.location.href, { method: 'POST', body: new FormData(form) });
          if (res.ok) {
            createMicroToast('Operación realizada con éxito');
            if (form === registerForm) form.reset();
            bootstrap.Modal.getInstance(authModal)?.hide();
          } else {
            createMicroToast(await res.text().catch(() => 'Error del servidor'), true);
          }
        } catch (err) {
          console.error(err);
          createMicroToast('No se pudo conectar con el servidor', true);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origHtml; }
        }
      });
    });

    // OAuth placeholders
    oauthDiscord?.addEventListener('click', e => { e.preventDefault(); createMicroToast('Redirigiendo a Discord...'); });
    oauthTwitch?.addEventListener('click', e => { e.preventDefault(); createMicroToast('Twitch OAuth próximamente', true); });
  })();

  /* ====================
     Misc
     ==================== */
  (function preloadImages() {
    ['https://picsum.photos/id/1015/800/600','https://picsum.photos/id/1016/800/600','https://picsum.photos/id/1019/800/600']
      .forEach(s => { const i = new Image(); i.src = s; });
  })();

  window.openTrailer = function () {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener');
  };

}); // DOMContentLoaded end

document.querySelectorAll(".link-switch").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = e.target.dataset.target;

    document.querySelectorAll(".auth-form").forEach(f => {
      f.classList.add("d-none");
      f.classList.remove("animate__fadeIn"); 
      f.style.pointerEvents = 'none'; // bloquear temporal
    });

    const active = document.getElementById(target);
    active.classList.remove("d-none");
    void active.offsetWidth; // reinicia animación
    active.classList.add("animate__fadeIn");
    active.style.pointerEvents = 'auto'; // habilitar interacción
  });
});
