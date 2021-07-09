

let counter = new Counter();
const supportsTouch = 'ontouchstart' in window;


counter.init('5197BB22-4B9B-4445-BDA0-90EDD9456546', String(Math.random()).substr(2, 12), 'send test');
counter.setAdditionalParams({
	env: 'production',
	platform: supportsTouch ? 'touch' : 'desktop'
});

counter.send('connect', performance.timing.connectEnd - performance.timing.connectStart);
counter.send('ttfb', performance.timing.responseEnd - performance.timing.requestStart); 

const inputs = document.querySelectorAll('input[type=radio]');
const buttonImg = document.getElementById('buttonImg');
const divImg = document.querySelector('.img');
const cursor = document.getElementById('cursor');
const count = document.getElementById('count');
const plus = document.getElementById('plus');
const minus = document.getElementById('minus');

let colorText = 0;
let countClick = 0;
let numberImg = 0;

inputs.forEach((el) => {
  el.addEventListener('click', (ev) => {
    colorText = +ev.target.value;
  });
});

buttonImg.addEventListener('click', () => {
  numberImg = Math.round(Math.random() * 2 + 1);
  divImg.textContent = '';
  const img = document.createElement('img');
  const imgSrc = `assets/${numberImg}.png`;
  img.src = imgSrc;
  divImg.append(img);
});

plus.addEventListener('click', () => {
  countClick+=13;
  count.textContent = countClick;
});

minus.addEventListener('click', () => {
  countClick-=5;
  count.textContent = countClick;
});

const lcp = new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    counter.send('lcp', entry.loadTime);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});

cursor.addEventListener('click', (ev) => {
  counter.send('countClick', countClick);
  counter.send('colorText', colorText);
  counter.send('numberImg', numberImg);
});