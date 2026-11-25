/* =========================================================
   MELLOW BEAN · 동작 스크립트
   ========================================================= */

// ----- 1. 스크롤하면 상단 메뉴바 아래에 이중선 표시 -----
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ----- 2. 모바일 메뉴 (☰ 버튼) 열고 닫기 -----
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  navToggle.textContent = open ? '✕' : '☰';
};

navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

// 메뉴 링크를 누르면 메뉴 닫기
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

// 메뉴 바깥을 누르거나 Esc 키를 누르면 닫기
document.addEventListener('click', (e) => {
  if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    navToggle.focus();
  }
});

// 화면이 PC/태블릿 폭(768px 이상)으로 넓어지면 모바일 메뉴 상태 초기화 (폰을 가로로 돌릴 때 등)
window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

// ----- 3. 맨 위로 가기 (TOP) 버튼 -----
const toTop = document.getElementById('toTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 첫 화면을 지나 600px 이상 내려가면 버튼 보이기
const updateToTop = () => toTop.classList.toggle('is-visible', window.scrollY > 600);
window.addEventListener('scroll', updateToTop, { passive: true });
updateToTop();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

// ----- 4. 로고 강조 효과 -----
// 스크롤을 내려 로고가 화면 밖으로 나갔다가, 다시 올라와 로고가 보이면 도장 찍듯 강조한다
const heroLogo = document.querySelector('.hero__logo');

if (heroLogo) {
  let hasLeft = false; // 로고가 한 번이라도 화면 밖으로 완전히 나갔는지

  const checkLogo = () => {
    const r = heroLogo.getBoundingClientRect();
    // 로고가 화면에 보이는 비율 (0 = 안 보임, 1 = 전부 보임)
    const visible = (Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) / r.height;

    if (visible <= 0) {
      hasLeft = true;
    } else if (hasLeft && visible >= 0.6) {
      hasLeft = false;
      heroLogo.classList.remove('is-emphasized');
      void heroLogo.offsetWidth; // 애니메이션을 처음부터 다시 재생하기 위한 트릭
      heroLogo.classList.add('is-emphasized');
    }
  };

  window.addEventListener('scroll', checkLogo, { passive: true });
  heroLogo.addEventListener('animationend', (e) => {
    if (e.target === heroLogo) heroLogo.classList.remove('is-emphasized');
  });
}

// ----- 5. 스크롤하면 내용이 살짝 떠오르며 나타나기 -----
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 한 번 나타나면 다시 감추지 않음
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
