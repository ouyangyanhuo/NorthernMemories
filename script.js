let cnt = parseInt(localStorage.getItem('langCnt')) || 0; // 语言计数器，默认0(zh)
let langMap = ['zh', 'ru', 'en', 'de']; // 语言映射数组
let lang = langMap[cnt]; // 当前语言
let content = {}; // 存储语言内容
let flowerCount = 0; // 当前花的数量

// 加载语言文件
fetch('languages.json')
  .then(response => response.json())
  .then(data => {
    content = data;
    updateContent();
    // 首次加载时获取花的数量
    fetch('flower.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getCount' })
    })
    .then(res => res.json())
    .then(data => {
      flowerCount = data.count || 0;
      updateFlowerCount();
    })
    .catch(err => console.error("获取花数量失败:", err));
  })
  .catch(err => console.error("语言文件加载失败:", err));

// 更新页面内容
function updateContent() {
  if (!content[lang]) return;

  document.title = content[lang].title;
  document.querySelector('.mytitle').textContent = content[lang].title;
  document.querySelector('.lang-toggle').textContent = content[lang].langBtn;
  document.querySelector('.flower-btn').textContent = content[lang].flowerBtn;

  const cards = document.querySelectorAll('.card');
  content[lang].cards.forEach((cardData, i) => {
    if (cards[i]) {
      cards[i].querySelector('h2').textContent = cardData.title;
      cards[i].querySelector('p').textContent = cardData.desc;
    }
  });

  document.getElementById('footer-text').textContent = content[lang].footer;
  updateFlowerCount();
}

// 切换语言
function toggleLang() {
  cnt = (cnt + 1) % 4; // 循环0-3
  lang = langMap[cnt];
  localStorage.setItem('langCnt', cnt); // 保存计数器
  localStorage.setItem('lang', lang); // 保存当前语言
  updateContent();
  updateFlowerCount();
}

// 默哀献花
function offerFlower() {
  fetch('flower.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: '献花' })
  })
  .then(res => res.json())
  .then(data => {
    flowerCount = data.count;
    updateFlowerCount();
  })
  .catch(err => alert(content[lang].connectionFail));
}

// 更新花的数量显示
function updateFlowerCount() {
  if (content[lang]) {
    document.getElementById('flower-count').textContent = 
      `${content[lang].flowerSuccessMsg}${flowerCount}`;
  }
}