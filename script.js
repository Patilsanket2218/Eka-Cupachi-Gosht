const nav = document.getElementById('siteNav');
const preloader = document.getElementById('preloader');
const parallaxEls = document.querySelectorAll('[data-speed]');
const heroLayers = document.querySelectorAll('.hero-layer');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('hide');
    document.body.classList.add('loaded');
  }, 1600);
});

document.querySelector('.hero').addEventListener('mousemove', e => {
  const { innerWidth: w, innerHeight: h } = window;
  const nx = (e.clientX / w - 0.5) * 2;
  const ny = (e.clientY / h - 0.5) * 2;
  heroLayers.forEach(el => {
    const depth = parseFloat(el.getAttribute('data-speed')) || 0.1;
    const mx = nx * depth * 18;
    const my = ny * depth * 18;
    el.style.setProperty('--mx', `${mx}px`);
    el.style.setProperty('--my', `${my}px`);
  });
});

function onScroll(){
  const y = window.scrollY;

  if(y > 40){ nav.classList.add('scrolled'); }
  else{ nav.classList.remove('scrolled'); }

  parallaxEls.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed')) || 0;
    const offset = y * speed * -1;
    const centered = el.classList.contains('hero-watermark') || el.classList.contains('hero-steam') || el.classList.contains('hero-kettle');
    const base = centered ? 'translateX(-50%) ' : '';
    el.style.transform = `${base}translate3d(var(--mx,0px), calc(${offset}px + var(--my,0px)), 0)`;
  });
}

window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// SCROLL-REVEAL for gallery items (safe-by-default: elements are visible in CSS
// already; JS only ADDS the hidden starting class, so if this script fails to
// run on a live host, nothing stays invisible).
const revealEls = document.querySelectorAll('.reveal-tilt');
revealEls.forEach((el, i) => {
  el.style.setProperty('--rd', `${(i % 6) * 0.08}s`);
  el.classList.add('pre-reveal');
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.classList.remove('pre-reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.remove('pre-reveal'));
}
// Safety net: force-reveal everything after 2.5s no matter what, in case the
// observer never fires (odd layouts, hash-jump to #gallery, etc.)
setTimeout(() => {
  revealEls.forEach(el => { el.classList.remove('pre-reveal'); el.classList.add('in-view'); });
}, 2500);

// PARALLAX (on scroll) + TILT (on hover) for gallery images, combined into
// a single transform per image so the two effects never fight each other.
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryState = new Map();

galleryItems.forEach(item => {
  const img = item.querySelector('img');
  if (!img) return;
  galleryState.set(img, { ty: 0, rx: 0, ry: 0 });

  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const state = galleryState.get(img);
    state.rx = (py * -8).toFixed(2);
    state.ry = (px * 8).toFixed(2);
    applyGalleryTransform(img, state);
  });

  item.addEventListener('mouseleave', () => {
    const state = galleryState.get(img);
    state.rx = 0;
    state.ry = 0;
    applyGalleryTransform(img, state);
  });
});

function applyGalleryTransform(img, state) {
  img.style.transform = `scale(1.08) translateY(${state.ty}px) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`;
}

function updateGalleryParallax() {
  const vh = window.innerHeight;
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    const rect = item.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > vh + 100) return; // skip offscreen items
    const centerOffset = (rect.top + rect.height / 2) - vh / 2;
    const ty = (centerOffset / vh) * 24; // gentle drift, ~±12px each way
    const state = galleryState.get(img);
    state.ty = ty.toFixed(2);
    applyGalleryTransform(img, state);
  });
}

let galleryTicking = false;
window.addEventListener('scroll', () => {
  if (!galleryTicking) {
    requestAnimationFrame(() => { updateGalleryParallax(); galleryTicking = false; });
    galleryTicking = true;
  }
}, { passive: true });
updateGalleryParallax();



document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click', e=>{
    const target = document.querySelector(link.getAttribute('href'));
    if(target){
      e.preventDefault();
      window.scrollTo({top: target.offsetTop - 70, behavior:'smooth'});
      const collapse = document.getElementById('navMenu');
      if(collapse.classList.contains('show')){
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }
    }
  });
});