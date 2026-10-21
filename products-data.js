/* Shared product registry, read by index.html (homepage grid) and products.html.
   Every collection follows the same formula: physical book + cards + a QR-linked digital game. */

const PRODUCT_FACE = {
  numbers:'<span style="font-size:78px;font-weight:800;color:#fff">1</span>',
  shapes:'<svg viewBox="0 0 100 100" width="96" height="96"><circle cx="34" cy="40" r="20" fill="#fff"/><rect x="52" y="22" width="34" height="34" rx="6" fill="#fff" opacity=".85"/><path d="M50 62 L70 92 L30 92 Z" fill="#fff" opacity=".7"/></svg>',
};

/* status: 'live' | 'soon' */
const YOUYOU_PRODUCTS = [
  {
    id:'houroufi', title:'حروفي الأولى', status:'live',
    tag:'متوفر الآن', tagColor:'#4FB477', bg:'#FFF7E9', face:'cover',
    href:'product-houroufi', game:'matching-game', ages:'3 - 6',
    photo:'houroufi-pack.jpg',
    desc:'كتاب حروف يُكتب ويُمسح، كتيّب أنشطة، بطاقات تقوّي الذاكرة تُلعب أيضًا على الشاشة، ومفاجأة صغيرة.',
    includes:[
      'كتاب الحروف: يكتب طفلك ويمسح ويعيد قدر ما يحب',
      'كتيّب أنشطة يناسب عمره ويقوّي تركيزه',
      'بطاقات تقوّي الذاكرة، ويلعبها أيضًا على الهاتف أو اللوحي',
      'مفاجأة صغيرة تزيد فرحته',
    ],
  },
  {
    id:'numbers', title:'الأرقام', status:'soon',
    tag:'قريبًا', tagColor:'#FFC53D', bg:'#8B6DC9', face:'numbers', ages:'3 - 6',
    desc:'تعلّم الأرقام من 1 إلى 20 بالعدّ والتتبّع والمطابقة.',
    includes:['كتاب تتبّع الأرقام', 'بطاقات مطابقة', 'لعبة رقمية تُفتح برمز QR'],
  },
  {
    id:'colors-shapes', title:'الألوان والأشكال', status:'soon',
    tag:'قريبًا', tagColor:'#FFC53D', bg:'#5AB6E8', face:'shapes', ages:'2 - 5',
    desc:'مطابقة الألوان والأشكال الأساسية بطريقة ممتعة.',
    includes:['كتاب الألوان والأشكال', 'بطاقات مطابقة', 'لعبة رقمية تُفتح برمز QR'],
  },
];
