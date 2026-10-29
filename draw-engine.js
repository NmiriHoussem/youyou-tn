/* ارسم ولوّن
   Trace phase runs on SVG (so the line is sampled exactly), colouring runs on
   canvas with a paint bucket. The bucket is what lets any artwork drop in:
   nothing has to be pre-cut into separate fillable shapes. */

const COLORS = ['#EF5C5C','#FFC53D','#8B6DC9','#4FB477','#5AB6E8','#F5833C','#8B5E3C','#F2A0C0','#3E3730','#FFFFFF'];
const KEY = 'youyou.draw.v1';
const PROGRESS_KEY = 'youyou.progress.v1';
const INK = '#3E3730';
const CW = 560;        // canvas working size
const TOL = 14;        // finger tolerance while tracing, in viewBox units
const NEEDED = 0.82;   // share of the line that must be covered

/* ---------- storage ---------- */
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function save(all){ try{ localStorage.setItem(KEY, JSON.stringify(all)); }catch(e){} }

function pushProgress(count){
  try{
    const all = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    const prev = all['draw-color'] || {};
    all['draw-color'] = {best:Math.max(prev.best||0, count*20), plays:prev.plays||0, at:Date.now()};
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  }catch(e){}
}

/* ---------- artwork helpers ---------- */
function svgString(a, fill, size){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${a.vb}" preserveAspectRatio="xMidYMid meet"><path d="${a.d}" fill="${fill}"/></svg>`;
}
function dataURL(a, fill, size){
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString(a, fill, size));
}
function loadArt(a, size, fill){
  return new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.src = dataURL(a, fill || INK, size);
  });
}

/* Build the wall mask: dark pixels are lines the paint cannot cross.
   The threshold sits above pure black so anti-aliased edges count as wall
   and the fill does not creep under the line leaving a pale halo. */
function buildWall(img, size){
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d', {willReadFrequently:true});
  x.fillStyle = '#fff'; x.fillRect(0, 0, size, size);
  x.drawImage(img, 0, 0, size, size);
  const d = x.getImageData(0, 0, size, size).data;
  const wall = new Uint8Array(size * size);
  for (let i = 0; i < wall.length; i++){
    const l = 0.299*d[i*4] + 0.587*d[i*4+1] + 0.114*d[i*4+2];
    wall[i] = l < 150 ? 1 : 0;
  }
  return wall;
}

/* Treat everything outside the animal as wall too. Without this a tap beside
   the drawing floods the whole square, which reads as a coloured box rather
   than a coloured animal. */
function sealOutside(wall, size){
  const out = Uint8Array.from(wall);
  const stack = [];
  for (let i = 0; i < size; i++){
    stack.push([i, 0], [i, size-1], [0, i], [size-1, i]);
  }
  while (stack.length){
    const [x, y] = stack.pop();
    const i = y * size + x;
    if (out[i]) continue;
    out[i] = 1;
    if (x > 0) stack.push([x-1, y]);
    if (x < size-1) stack.push([x+1, y]);
    if (y > 0) stack.push([x, y-1]);
    if (y < size-1) stack.push([x, y+1]);
  }
  return out;
}

/* scanline flood fill, bounded by the wall mask */
function bucket(buf, wall, size, sx, sy, rgb){
  const i0 = sy * size + sx;
  if (sx < 0 || sy < 0 || sx >= size || sy >= size || wall[i0]) return false;
  const seen = new Uint8Array(size * size);
  const d = buf.data;
  const stack = [[sx, sy]];
  while (stack.length){
    const [x, y] = stack.pop();
    const row = y * size;
    if (seen[row + x] || wall[row + x]) continue;
    let l = x; while (l > 0 && !wall[row + l - 1] && !seen[row + l - 1]) l--;
    let r = x; while (r < size - 1 && !wall[row + r + 1] && !seen[row + r + 1]) r++;
    for (let xx = l; xx <= r; xx++){
      const i = row + xx;
      seen[i] = 1;
      d[i*4] = rgb[0]; d[i*4+1] = rgb[1]; d[i*4+2] = rgb[2]; d[i*4+3] = 255;
      if (y > 0 && !wall[i - size] && !seen[i - size]) stack.push([xx, y - 1]);
      if (y < size - 1 && !wall[i + size] && !seen[i + size]) stack.push([xx, y + 1]);
    }
  }
  return true;
}

const hex2rgb = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];

/* Replay a saved list of taps. Coordinates are stored 0..1 so a drawing can be
   re-rendered at any size, which the picker and gallery thumbnails rely on. */
async function renderSaved(a, ops, size){
  const img = await loadArt(a, size);
  const wall = sealOutside(buildWall(img, size), size);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d', {willReadFrequently:true});
  // left transparent so unpainted areas show the page behind, cream on the
  // stage and white on a picker card, instead of a hard white square
  const buf = x.getImageData(0, 0, size, size);
  (ops || []).forEach(o => {
    bucket(buf, wall, size, Math.round(o.x * size), Math.round(o.y * size), hex2rgb(o.c));
  });
  x.putImageData(buf, 0, 0);
  x.drawImage(img, 0, 0, size, size);
  return c;
}
