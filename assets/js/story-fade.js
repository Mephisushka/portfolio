// Блок истории на телефоне (по мотивам Framer ScrollTextFade):
// пункт в центре экрана яркий и в полный размер,
// соседние пункты бледнеют и чуть уменьшаются по мере удаления от центра.
(() => {
  const stories = document.querySelectorAll('.story');
  if (!stories.length) return;
  const mq = matchMedia('(max-width: 720px)');
  const rows = [...document.querySelectorAll('.story__row')];
  let raf = 0;

  const update = () => {
    raf = 0;
    const vh = innerHeight;
    const center = vh / 2;
    const step = vh * .35; // расстояние «одного пункта» от центра
    rows.forEach(row => {
      const r = row.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - center) / step;
      row.style.opacity = Math.max(.12, 1 - dist * .9).toFixed(3);
      row.style.transform = `scale(${Math.max(.95, 1 - dist * .025).toFixed(4)})`;
    });
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

  const apply = () => {
    if (mq.matches) {
      stories.forEach(s => s.classList.add('is-fading'));
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      update();
    } else {
      stories.forEach(s => s.classList.remove('is-fading'));
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      rows.forEach(row => { row.style.opacity = ''; row.style.transform = ''; });
    }
  };

  mq.addEventListener('change', apply);
  apply();
})();
