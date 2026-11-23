// ===== 결혼식 날짜 설정 =====
const WEDDING_DATE = new Date(2027, 3, 17, 13, 0, 0); // 월은 0부터 시작 (3 = 4월)

// ===== 달력 그리기 =====
function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const year = WEDDING_DATE.getFullYear();
  const month = WEDDING_DATE.getMonth();
  const weddingDay = WEDDING_DATE.getDate();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  dayNames.forEach((name, i) => {
    const el = document.createElement('div');
    el.className = 'day-name' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '');
    el.textContent = name;
    calendar.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement('div'));
  }

  for (let d = 1; d <= lastDate; d++) {
    const el = document.createElement('div');
    const weekday = (firstDay + d - 1) % 7;
    el.className = 'day';
    if (weekday === 0) el.classList.add('sun');
    if (weekday === 6) el.classList.add('sat');
    if (d === weddingDay) el.classList.add('wedding');
    el.textContent = d;
    calendar.appendChild(el);
  }
}

// ===== 카운트다운 =====
function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const ddayText = document.getElementById('dday-text');

  if (diff <= 0) {
    document.getElementById('countdown').style.display = 'none';
    ddayText.innerHTML = '민준 ♥ 서연의 결혼식이 <b>진행되었습니다</b>. 감사합니다!';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = hours;
  document.getElementById('cd-mins').textContent = mins;
  document.getElementById('cd-secs').textContent = secs;

  ddayText.innerHTML = `민준 ♥ 서연의 결혼식이 <b>${days}일</b> 남았습니다.`;
}

// ===== 스크롤 등장 애니메이션 =====
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

// ===== 갤러리 모달 =====
function initGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');
  let current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    // 실제 사진을 쓸 경우 items[current]의 이미지 경로를 사용하면 됩니다.
    content.style.background = getComputedStyle(items[current]).backgroundImage;
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      show(i);
      modal.classList.add('open');
    });
  });

  document.getElementById('modal-close').addEventListener('click', () => modal.classList.remove('open'));
  document.getElementById('modal-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('modal-next').addEventListener('click', () => show(current + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') modal.classList.remove('open');
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

// ===== 계좌 아코디언 =====
function initAccordion() {
  document.querySelectorAll('.accordion').forEach((acc) => {
    const header = acc.querySelector('.accordion-header');
    const body = acc.querySelector('.accordion-body');

    header.addEventListener('click', () => {
      const isOpen = acc.classList.toggle('open');
      body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0';
    });
  });
}

// ===== 복사 기능 =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2000);
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 로컬 파일(file://) 등 clipboard API가 막힌 환경 대비
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  }
  showToast(message);
}

function initCopy() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => copyText(btn.dataset.account, '계좌번호가 복사되었습니다'));
  });

  document.getElementById('share-btn').addEventListener('click', () => {
    copyText(window.location.href, '청첩장 링크가 복사되었습니다');
  });
}

// ===== 실행 =====
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initFadeIn();
  initGallery();
  initAccordion();
  initCopy();
});
