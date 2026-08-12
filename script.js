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