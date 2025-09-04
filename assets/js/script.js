// Init AOS
AOS.init({
  once: true,
  offset: 80,
  duration: 700,
  easing: 'ease-out-cubic'
});

// Init Swipers
const heroSwiper = new Swiper('.hero-swiper', {
  loop: true,
  autoplay: { delay: 3000, disableOnInteraction: false },
  pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
});

const mediaSwiper = new Swiper('.media-swiper', {
  loop: true,
  navigation: { nextEl: '.media-swiper .swiper-button-next', prevEl: '.media-swiper .swiper-button-prev' },
});



// Navbar active link on scroll (Bootstrap scrollspy already helps; we add shrink effect)
const nav = document.getElementById('mainNav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll); onScroll();

// Smooth scroll for internal links (fallback to CSS behavior)
[...document.querySelectorAll('a[href^="#"]')].forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance('#navContent');
      bsCollapse.hide();
    }
  });
});

// Toggle hero video
const heroVideo = document.getElementById('heroVideo');
const toggleBtn = document.getElementById('toggleVideo');
if (toggleBtn && heroVideo) {
  toggleBtn.addEventListener('click', () => {
    if (heroVideo.paused) { heroVideo.play(); toggleBtn.innerHTML = '<i class="bi bi-pause-circle"></i> Pausar video'; }
    else { heroVideo.pause(); toggleBtn.innerHTML = '<i class="bi bi-play-circle"></i> Reproducir video'; }
  });
}



// tsParticles background in hero
(async () => {
  if (window.tsParticles) {
    await tsParticles.load({
      id: 'particles', options: {
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        particles: {
          number: { value: 40 },
          color: { value: ['#00f7ff', '#7c4dff'] },
          opacity: { value: 0.6 },
          size: { value: { min: 1, max: 3 } },
          links: { enable: true, color: '#6ecbff', opacity: .25, distance: 130 },
          move: { enable: true, speed: 1.2 }
        },
        interactivity: { events: { onHover: { enable: true, mode: 'repulse' } }, modes: { repulse: { distance: 120 } } }
      }
    });
  }
})();

// Modal: switch between Login / Register / Forgot with subtle GSAP
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const authTitle = document.getElementById('authTitle');
const goRegister = document.getElementById('goRegister');
const goLogin = document.getElementById('goLogin');
const forgotLink = document.getElementById('forgotLink');
const backToLogin = document.getElementById('backToLogin');

function showForm(target) {
  const forms = [loginForm, registerForm, forgotForm];
  forms.forEach(f => f.classList.remove('show'));
  target.classList.add('show');
  // Fancy title morph
  const title = target === loginForm ? 'Iniciar sesión' : target === registerForm ? 'Crear cuenta' : 'Recuperar clave';
  gsap.fromTo(authTitle, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .25 });
  authTitle.textContent = title;
}

if (goRegister) goRegister.addEventListener('click', (e) => { e.preventDefault(); showForm(registerForm); });
if (goLogin) goLogin.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });
if (forgotLink) forgotLink.addEventListener('click', (e) => { e.preventDefault(); showForm(forgotForm); });
if (backToLogin) backToLogin.addEventListener('click', (e) => { e.preventDefault(); showForm(loginForm); });



// When opening modal default to Login
authModal?.addEventListener('show.bs.modal', () => showForm(loginForm));

// Show/hide password
function wirePasswordToggles(scope = document) {
  scope.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.position-relative').querySelector('.password-field');
      if (!input) return;
      const isPass = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPass ? 'text' : 'password');
      btn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });
  });
}
wirePasswordToggles();

// Optional: basic form validation feedback (HTML5 does most)
[loginForm, registerForm].forEach(form => {
  if (!form) return;
  form.addEventListener('submit', () => {
    // you can add loading state here
  });
});


// Trailer opener (simple example)
window.openTrailer = () => {
  const yt = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // replace with real trailer
  window.open(yt, '_blank');
};