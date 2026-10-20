const ppGrid = document.getElementById('ppGrid');

if (ppGrid) {
  const CHECK = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

  function faceHTML(p) {
    if (p.face === 'cover' && typeof BOOK_THUMB !== 'undefined') {
      return `<img class="cover-thumb" src="${BOOK_THUMB}" alt="${p.title}">`;
    }
    return PRODUCT_FACE[p.face] || '';
  }

  ppGrid.innerHTML = YOUYOU_PRODUCTS.map(p => {
    const cta = p.status === 'live'
      ? `<div class="pp-ctas">
           <a class="btn btn-primary pp-btn" href="${p.href}">عرض المنتج</a>
           <a class="btn btn-ghost pp-btn" href="${p.game}">العب اللعبة</a>
         </div>`
      : `<div class="pp-ctas"><span class="pp-soon">قريبًا</span></div>`;

    return `<article class="pp-card${p.status === 'live' ? ' live' : ''}">
      <div class="pp-media" style="background:${p.bg}">${faceHTML(p)}</div>
      <div class="pp-body">
        <span class="pp-tag" style="background:${p.tagColor}22;color:${p.tagColor}">${p.tag}</span>
        <h3>${p.title}</h3>
        <span class="hub-pill">${p.ages} سنوات</span>
        <p class="pp-desc">${p.desc}</p>
        <ul class="pp-includes">
          ${p.includes.map(i => `<li>${CHECK}<span>${i}</span></li>`).join('')}
        </ul>
        ${cta}
      </div>
    </article>`;
  }).join('');
}
