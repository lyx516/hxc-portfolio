/* 由 scripts/extract-portfolio.mjs 生成，请勿手改。原始页面的内联交互脚本。 */
(function () {
  var bar = document.getElementById('bar');
  var hero = document.getElementById('top');

  // 顶栏实测高度回写 --barh：两行手机顶栏、系统字号放大、字体回退都不会让
  // 首屏负边距（.hero）与锚点偏移（scroll-margin-top）对不上。
  // 只在 ≤1080px 生效 —— ≥1081px 的桌面端渲染保持逐像素不变。
  function syncBarHeight() {
    if (document.documentElement.clientWidth > 1080) { return; }
    var h = Math.round(bar.getBoundingClientRect().height);
    if (h > 0) { document.documentElement.style.setProperty('--barh', h + 'px'); }
  }
  syncBarHeight();
  window.addEventListener('resize', syncBarHeight);
  if (window.ResizeObserver) { new ResizeObserver(syncBarHeight).observe(bar); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(syncBarHeight); }

  // 顶栏底色：页面一旦开始滚动就必须不透明 —— 否则正文会从透明的顶栏下面穿过去，
  // 与署名行、栏目带叠成一片。旧判据把「离开首屏」写死成 -56px，而手机两行顶栏实测 92px，
  // 于是整个首屏滚动区间（手机约 1000px）顶栏都是透明的，正文穿过它。
  var barPaper = null;
  function syncBarPaper() {
    var on = (window.pageYOffset || document.documentElement.scrollTop || 0) > 8;
    if (on !== barPaper) { barPaper = on; bar.classList.toggle('is-paper', on); }
  }
  syncBarPaper();
  window.addEventListener('scroll', syncBarPaper, { passive: true });
  window.addEventListener('resize', syncBarPaper);

  var dialog = document.getElementById('lb');
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var count = document.getElementById('lb-count');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.w__btn'));
  var current = -1;

  // 当前位置指示：滚到哪个门类，顶栏对应链接就点亮
  var links = {};
  Array.prototype.forEach.call(document.querySelectorAll('.bar a[href^="#"]'), function (a) {
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
    // 窄屏顶栏是一条可横滑的栏目带：把当前栏目滚到中间，否则高亮项常常在屏幕外。
    // 用 scrollLeft 而不是 scrollIntoView —— 老 WebView 不认 scrollIntoView 的参数对象。
    var el = bestId ? links[bestId] : null;
    if (el) {
      var strip = el.parentNode;
      if (strip && strip.scrollWidth > strip.clientWidth + 1) {
        var r = el.getBoundingClientRect(), s = strip.getBoundingClientRect();
        if (r.left < s.left + 8 || r.right > s.right - 8) {
          strip.scrollLeft += (r.left - s.left) - (s.width - r.width) / 2;
        }
      }
    } else {
      // 没有活动栏目（例如回到首屏）时把栏目带复位到开头：
      // 否则「滑到底再回顶部」会停在上次的位置，第一眼看到的是最边缘的几个门类
      var back = document.querySelector('.bar__links');
      if (back && back.scrollLeft > 0) { back.scrollLeft = 0; }
    }
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

// 国画、剪纸、马克笔三栏：排成「等高一行」——每条的宽度按各自图片的长宽比分配，
// 于是同一行里所有作品高矮一致、完整显示又不裁切，也不需要卡纸留白。
// 图片比例直接读 <img> 上的 width/height（换图时只要改这两个数字，这里会自动跟着变）。
// 没有 JS 时退回 CSS 里的等大画框网格，照样整齐。
(function () {
  var rows = Array.prototype.slice.call(document.querySelectorAll('.works--justify'));
  if (!rows.length) { return; }

  function ratio(img) {
    var w = parseFloat(img.getAttribute('width'));
    var h = parseFloat(img.getAttribute('height'));
    return (w > 0 && h > 0) ? w / h : 0;
  }

  function layout(force) {
    rows.forEach(function (row) {
      // 手机地址栏伸缩会触发 resize：容器宽度没变就不重排，
      // 免得增删 .rowbrk 让滚动中的版面抖一下
      var cw = row.clientWidth;
      if (!force && row.__lastW === cw) { return; }
      row.__lastW = cw;
      var items = Array.prototype.filter.call(row.children, function (el) {
        return el.className.indexOf('w') === 0 || /(^|\s)w(\s|$)/.test(el.className);
      });
      if (!items.length) { return; }
      var ars = items.map(function (it) {
        var img = it.querySelector('img');
        if (!img) { return 0; }
        var w = parseFloat(img.getAttribute('width'));
        var h = parseFloat(img.getAttribute('height'));
        // 顺手把比例写进样式：图片没加载完时也能先把高度占住，页面不会在滚动中「长高」跳位
        if (w > 0 && h > 0) {
          img.style.aspectRatio = w + ' / ' + h;   // 现代内核：先按比例占位
          img.style.height = '';                   // 高度统一由下面的分配循环写成 px
        }
        return (w > 0 && h > 0) ? w / h : 0;
      });
      if (ars.some(function (a) { return !a; })) { return; }   // 拿不到比例就保持原来的网格

      var vw = document.documentElement.clientWidth;
      var gap = parseFloat(getComputedStyle(row).columnGap) || 26;
      var total = row.clientWidth;
      // 行高上限：容器上的 data-rowh（不写＝不限高，每行铺满版心）。限高后整行由 CSS 居中。
      var cap = parseFloat(row.getAttribute('data-rowh')) || 0;
      row.classList.add('works--rowready');
      var i, k;
      for (i = 0; i < items.length; i += 1) { items[i].style.width = ''; }

      // 分行：桌面（>1024）按页面里用 data-rowstart 标好的显式分行（国画两幅一行、剪纸 1＋3…）；
      // 窄屏沿用自动分行（平板 2 件、手机 1 件），免得三件挤成一条。
      // 清掉上一轮插的换行占位
      Array.prototype.forEach.call(row.querySelectorAll('.rowbrk'), function (el) { el.parentNode.removeChild(el); });

      var groups = [];
      if (vw > 1024) {
        var cur = [];
        for (i = 0; i < items.length; i += 1) {
          if (i > 0 && items[i].hasAttribute('data-rowstart') && cur.length) { groups.push(cur); cur = []; }
          cur.push(i);
        }
        if (cur.length) { groups.push(cur); }
      } else {
        var per = vw > 760 ? 2 : 1;
        for (i = 0; i < items.length; i += per) {
          var g = [];
          for (k = 0; k < per && i + k < items.length; k += 1) { g.push(i + k); }
          groups.push(g);
        }
      }

      groups.forEach(function (group, gi) {
        // 真正把行断开：flex 里插一个占满整行的零高元素（否则下一行的第一件会被挤到上一行）
        if (gi > 0) {
          var brk = document.createElement('div');
          brk.className = 'rowbrk';
          brk.setAttribute('aria-hidden', 'true');
          row.insertBefore(brk, items[group[0]]);
        }
        var sum = 0;
        for (k = 0; k < group.length; k++) { sum += ars[group[k]]; }
        var avail = total - gap * (group.length - 1) - 1;   // 留 1px 余量，避免取整后换行
        var h = avail / sum;
        var capped = cap > 0 && h > cap;
        if (capped) { h = cap; }
        var used = 0;
        for (k = 0; k < group.length; k++) {
          // 铺满整行时最后一件吃掉取整误差（同高）；限高时每件按各自比例算，整行交给 CSS 居中
          var w = (capped || k < group.length - 1) ? Math.round(h * ars[group[k]]) : (avail - used);
          used += w;
          var it = items[group[k]];
          it.style.width = w + 'px';
          // 高度也写死成 px：不依赖 aspect-ratio（微信老内核可能不认），
          // 同时让图片还没解码完就已占住高度，滚动中不会「长高」（锚点与顶栏高亮才不会失准）
          var im = it.querySelector('img');
          if (im) { im.style.width = '100%'; im.style.height = Math.round(h) + 'px'; }
        }
      });
    });
  }

  layout(true);
  var timer = null;
  window.addEventListener('resize', function () {
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(layout, 150);
  });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { layout(true); }); }
})();
