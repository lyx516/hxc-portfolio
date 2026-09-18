/* 由 scripts/extract-portfolio.mjs 生成，请勿手改。原始页面的内联交互脚本。 */
(function () {
  var bar = document.getElementById('bar');
  var hero = document.getElementById('top');

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        bar.classList.toggle('is-paper', !e.isIntersecting);
      });
    }, { rootMargin: '-56px 0px 0px 0px' }).observe(hero);
  } else {
    bar.classList.add('is-paper');
  }

  var dialog = document.getElementById('lb');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var count = document.getElementById('lb-count');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.w__btn'));
  var current = -1;

  // 当前位置指示：滚到哪个门类，顶栏对应链接就点亮
  var links = {};
  Array.prototype.forEach.call(document.querySelectorAll('.bar__links a[href^="#"]'), function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var cats = Object.keys(links).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var visible = {};

  function sync() {
    var bestId = null, bestTop = -Infinity;
    cats.forEach(function (c) {
      if (!visible[c.id]) { return; }
      var top = c.getBoundingClientRect().top;
      if (top > bestTop) { bestTop = top; bestId = c.id; }
    });
    Object.keys(links).forEach(function (id) {
      if (id === bestId) { links[id].setAttribute('aria-current', 'true'); }
      else { links[id].removeAttribute('aria-current'); }
    });
  }

  if ('IntersectionObserver' in window) {
    var catObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      sync();
    }, { rootMargin: '-64px 0px -55% 0px', threshold: 0 });
    cats.forEach(function (c) { catObserver.observe(c); });
  }

  function show(i) {
    if (i < 0 || i >= buttons.length) { return; }
    current = i;
    var b = buttons[i];
    img.src = b.dataset.src;
    img.alt = b.querySelector('img') ? b.querySelector('img').alt : '';
    cap.innerHTML = '';
    cap.appendChild(document.createTextNode(b.dataset.cap || ''));
    var note = document.createElement('em');
    // 直接沿用页面上那条批注的标记，换行保护（.nb）一并生效，两处文字永远一致
    var srcNote = b.closest('.w') ? b.closest('.w').querySelector('.w__note') : null;
    if (srcNote) { note.innerHTML = srcNote.innerHTML; }
    else { note.textContent = b.dataset.note || ''; }
    cap.appendChild(note);
    // 有 data-video 的作品（AE 动画）在放大视图里给一个视频入口
    if (b.dataset.video) {
      var video = document.createElement('a');
      video.className = 'lb__video';
      video.href = b.dataset.video;
      video.target = '_blank';
      video.rel = 'noopener';
      video.textContent = '▶ 观看动画视频';
      cap.appendChild(video);
    }
    count.textContent = (i + 1) + ' / ' + buttons.length;
  }

  function open(i) {
    show(i);
    if (typeof dialog.showModal === 'function') { dialog.showModal(); }
    else { dialog.setAttribute('open', ''); }
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (typeof dialog.close === 'function') { dialog.close(); }
    else { dialog.removeAttribute('open'); }
    document.body.style.overflow = '';
    img.removeAttribute('src');
  }

  buttons.forEach(function (b, i) {
    b.addEventListener('click', function () { open(i); });
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(current + 1); });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) { close(); }
  });
  dialog.addEventListener('close', function () {
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', function (e) {
    if (!dialog.hasAttribute('open')) { return; }
    if (e.key === 'Escape') { close(); }
    if (e.key === 'ArrowLeft') { show(current - 1); }
    if (e.key === 'ArrowRight') { show(current + 1); }
  });
})();
