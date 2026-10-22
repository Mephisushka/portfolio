// Мобильное меню с контактами (по мотивам Framer Motion Overlay Menu).
// Открытие: бургер превращается в крестик, тёмный экран раскрывается кругом от кнопки,
// пункты по очереди всплывают снизу из размытия. Закрытие — в обратном порядке.
(() => {
  const menu = document.getElementById('mmenu');
  const btn = document.querySelector('.nav__burger');
  if (!menu || !btn) return;

  const ICON_WAIT = 180;  // сначала крестик возвращается в бургер, потом закрывается экран
  const CLOSE_MS = 880;   // длительность сворачивания круга
  let timer, darkTimer;

  const setOrigin = () => {
    const r = btn.getBoundingClientRect();
    menu.style.setProperty('--ox', Math.round(r.left + r.width / 2) + 'px');
    menu.style.setProperty('--oy', Math.round(r.top + r.height / 2) + 'px');
  };

  const open = () => {
    clearTimeout(timer);
    clearTimeout(darkTimer);
    setOrigin();
    menu.classList.remove('is-closing');
    document.body.classList.add('menu-open', 'menu-dark');
    btn.classList.add('is-active', 'was-active');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Закрыть меню');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    setTimeout(() => menu.focus({ preventScroll: true }), 80);
  };

  const close = () => {
    if (!menu.classList.contains('is-open')) return;
    btn.classList.remove('is-active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Открыть меню');
    timer = setTimeout(() => {
      menu.classList.add('is-closing');
      menu.classList.remove('is-open');
      // круг сворачивается в кнопку и открывает навбар ближе к концу — тогда и возвращаем его цвета
      darkTimer = setTimeout(() => document.body.classList.remove('menu-dark'), CLOSE_MS * .72);
      timer = setTimeout(() => {
        menu.classList.remove('is-closing');
        document.body.classList.remove('menu-open');
      }, CLOSE_MS);
    }, ICON_WAIT);
  };

  btn.addEventListener('click', () => (menu.classList.contains('is-open') ? close() : open()));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  // при повороте/расширении экрана до десктопа меню закрывается
  matchMedia('(min-width: 721px)').addEventListener('change', e => { if (e.matches) close(); });
})();
