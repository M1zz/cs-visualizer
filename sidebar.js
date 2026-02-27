(function () {
  // 챕터 색상 가져오기
  const navTitle = document.querySelector('.nav-chapter-title');
  const chColor = navTitle ? getComputedStyle(navTitle).color : '#00ffaa';

  // 페이지의 모든 section[id] 수집
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;

  // 사이드바 생성
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  let html = '<div class="sidebar-title">목차</div>';
  sections.forEach((sec, i) => {
    const h2 = sec.querySelector('h2');
    const rawText = h2 ? h2.textContent.trim() : sec.id;
    // 괄호 이하 부분 제거해서 짧게 표시
    const label = rawText.replace(/\s*\(.*\)$/, '').replace(/\s*—.*$/, '').trim();
    html += `<a class="sidebar-link" href="#${sec.id}" data-id="${sec.id}">
      <span class="sidebar-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="sidebar-label">${label}</span>
    </a>`;
  });

  sidebar.innerHTML = html;
  document.body.prepend(sidebar);
  document.body.classList.add('has-sidebar');

  // 상단 nav의 .nav-sections 숨기기 (사이드바로 대체)
  const navSections = document.querySelector('.nav-sections');
  if (navSections) navSections.style.display = 'none';

  // 오버레이 (모바일)
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  // 토글 버튼 (모바일)
  const toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.setAttribute('aria-label', '목차 열기');
  toggle.innerHTML = '≡';
  document.body.appendChild(toggle);

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    toggle.innerHTML = '✕';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    toggle.innerHTML = '≡';
  }

  toggle.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  overlay.addEventListener('click', closeSidebar);

  // 링크 클릭 시 모바일에서 닫기
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 820) closeSidebar();
    });
  });

  // IntersectionObserver: 현재 섹션 하이라이트
  const links = sidebar.querySelectorAll('.sidebar-link');

  function setActive(id) {
    links.forEach(l => {
      const isActive = l.dataset.id === id;
      l.classList.toggle('active', isActive);
      l.style.color = isActive ? chColor : '';
      l.style.borderLeftColor = isActive ? chColor : '';
    });
  }

  const observer = new IntersectionObserver(entries => {
    // 화면에 보이는 섹션 중 가장 위에 있는 것을 활성화
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) setActive(visible[0].target.id);
  }, {
    rootMargin: '-54px 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));

  // 초기 활성화
  if (sections[0]) setActive(sections[0].id);
})();
