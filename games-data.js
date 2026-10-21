/* Shared game registry, read by index.html (teaser grid) and games.html (full hub).
   Progress lives in localStorage only; there is no backend. */

const GAME_ICONS = {
  letters:`<svg viewBox="0 0 64 64" width="46" height="46" fill="none">
    <rect x="6" y="10" width="24" height="24" rx="6" fill="#fff"/><text x="18" y="30" font-size="18" font-weight="800" fill="#EF5C5C" text-anchor="middle" font-family="Baloo Bhaijaan 2">أ</text>
    <rect x="34" y="30" width="24" height="24" rx="6" fill="#fff"/><text x="46" y="50" font-size="18" font-weight="800" fill="#8B6DC9" text-anchor="middle" font-family="Baloo Bhaijaan 2">ب</text></svg>`,
  numbers:`<svg viewBox="0 0 64 64" width="46" height="46" fill="none">
    <rect x="6" y="10" width="24" height="24" rx="6" fill="#fff"/><text x="18" y="30" font-size="18" font-weight="800" fill="#FFC53D" text-anchor="middle" font-family="Baloo Bhaijaan 2">1</text>
    <rect x="34" y="30" width="24" height="24" rx="6" fill="#fff"/><text x="46" y="50" font-size="18" font-weight="800" fill="#4FB477" text-anchor="middle" font-family="Baloo Bhaijaan 2">2</text></svg>`,
  palette:`<svg viewBox="0 0 64 64" width="46" height="46" fill="none">
    <path d="M32 8C18 8 8 17 8 30c0 10 8 14 14 14 4 0 4-3 6-5 2-2 5-1 8-1 8 0 14-5 14-13C50 15 44 8 32 8Z" fill="#fff"/>
    <circle cx="20" cy="24" r="3.5" fill="#EF5C5C"/><circle cx="30" cy="18" r="3.5" fill="#FFC53D"/><circle cx="41" cy="22" r="3.5" fill="#4FB477"/><circle cx="43" cy="33" r="3.5" fill="#5AB6E8"/></svg>`,
  shapes:`<svg viewBox="0 0 64 64" width="46" height="46" fill="none">
    <circle cx="20" cy="22" r="10" fill="#fff"/><rect x="34" y="12" width="20" height="20" rx="4" fill="#fff"/>
    <path d="M32 38 L44 58 L20 58 Z" fill="#fff"/></svg>`,
  tap:`<svg viewBox="0 0 64 64" width="46" height="46" fill="none">
    <circle cx="32" cy="26" r="13" stroke="#fff" stroke-width="3.5" opacity=".55"/>
    <circle cx="32" cy="26" r="6" fill="#fff"/>
    <path d="M32 44v10M22 41l-6 7M42 41l6 7" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  bolt:`<svg viewBox="0 0 64 64" width="46" height="46" fill="none">
    <path d="M36 6 18 34h12l-4 24 20-30H34l2-22Z" fill="#fff"/></svg>`,
};

/* status: 'live' | 'soon'
   cat:    'learn' | 'reflex'
   stars:  score thresholds for 1/2/3 stars (live games only) */
const YOUYOU_GAMES = [
  {
    id:'houroufi-match', title:'حروفي الأولى', desc:'طابِق الحرف بالحيوان، أو العب بالذاكرة', short:'مطابقة وذاكرة',
    cat:'learn', status:'live', href:'matching-game', color:'#EF5C5C',
    ages:'3 - 6', icon:'letters', thumb:true, stars:[60,150,300],
  },
  {
    id:'numbers-match', title:'لعبة الأرقام', desc:'العدّ والمطابقة من 1 إلى 20',
    cat:'learn', status:'soon', color:'#8B6DC9', ages:'3 - 6', icon:'numbers',
  },
  {
    id:'colors-match', title:'لعبة الألوان', desc:'اعرف الألوان وطابِقها',
    cat:'learn', status:'soon', color:'#5AB6E8', ages:'2 - 5', icon:'palette',
  },
  {
    id:'shapes-match', title:'لعبة الأشكال', desc:'الدائرة والمربّع والمثلّث',
    cat:'learn', status:'soon', color:'#4FB477', ages:'2 - 5', icon:'shapes',
  },
  {
    id:'quick-tap', title:'اللمس السريع', desc:'المِس الشكل الصحيح قبل أن يختفي',
    cat:'reflex', status:'soon', color:'#FFC53D', ages:'4 - 6', icon:'tap',
  },
  {
    id:'catch-letter', title:'اصطَد الحرف', desc:'سرعة وانتباه مع الحروف',
    cat:'reflex', status:'soon', color:'#EF5C5C', ages:'4 - 6', icon:'bolt',
  },
];

const GAME_CATS = [
  {id:'all',    label:'كل الألعاب'},
  {id:'learn',  label:'تعلّم'},
  {id:'reflex', label:'سرعة وانتباه'},
];

/* ---- progress: this device only, no account, no server ---- */
const PROGRESS_KEY = 'youyou.progress.v1';

function loadProgress(){
  try{ return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch(e){ return {}; }
}

function saveGameResult(id, score){
  try{
    const all = loadProgress();
    const prev = all[id] || {best:0, plays:0};
    all[id] = {best:Math.max(prev.best||0, score), plays:(prev.plays||0)+1, at:Date.now()};
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  }catch(e){ /* private mode or storage blocked, progress just isn't kept */ }
}

function clearProgress(){
  try{ localStorage.removeItem(PROGRESS_KEY); }catch(e){}
}

function starsFor(game, best){
  if(!game.stars || !best) return 0;
  return game.stars.filter(t => best >= t).length;
}
