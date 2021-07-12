function quantile(arr, q) {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
  } else {
    return Math.floor(sorted[base]);
  }
};

function prepareData(result) {
return result.data.map(item => {
  item.date = item.timestamp.split('T')[0];

  return item;
});
}

// показать значение метрики за несколько день
function showMetricByPeriod(data, page, name, dateStart, dateEnd) {
  const start = dateStart.split('-')[2];
  const end = dateEnd.split('-')[2];

  let sampleData = data
        .filter((item) => item.page == page && item.name === name 
                && (start < item.date.split('-')[2] < end))
        .map(item => item.value);

  console.log(sampleData);
}

// показать сессию пользователя
function showSession(data, requestId, date) {
  let sampleData = data
        .filter((item) => item.requestId == requestId && item.date == date)
  
  console.log(sampleData);
}

// сравнить метрику в разных срезах
function compareMetric(data, name) {
  const desktop = data
        .filter(el => el.additional.platform == 'desktop' && el.name == name)
        .map(item => item.value);
  const touch = data
        .filter(el => el.additional.platform == 'touch' && el.name == name)
        .map(item => item.value);

  console.log('desktop: ' +
  `p25=${quantile(desktop, 0.25)} p50=${quantile(desktop, 0.5)} ` +
  `p75=${quantile(desktop, 0.75)} p90=${quantile(desktop, 0.95)} ` +
  `hits=${desktop.length}`);

  console.log('touch: ' +
  `p25=${quantile(touch, 0.25)} p50=${quantile(touch, 0.5)} ` +
  `p75=${quantile(touch, 0.75)} p90=${quantile(touch, 0.95)} ` +
  `hits=${touch.length}`);
}

function calcMetricByDate(data, page, name, date) {
let sampleData = data
        .filter(item => item.page == page && item.name == name && item.date == date)
        .map(item => item.value);

console.log(`${date} ${name}: ` +
  `p25=${quantile(sampleData, 0.25)} p50=${quantile(sampleData, 0.5)} ` +
  `p75=${quantile(sampleData, 0.75)} p90=${quantile(sampleData, 0.95)} ` +
  `hits=${sampleData.length}`);
}

fetch('https://shri.yandex/hw/stat/data?counterId=5197BB22-4B9B-4445-BDA0-90EDD9456546')
.then(res => res.json())
.then(result => {
  let data = prepareData(result);

  calcMetricByDate(data, 'send test', 'ttfb', '2021-07-09');
  calcMetricByDate(data, 'send test', 'colorText', '2021-07-09');
  calcMetricByDate(data, 'send test', 'numberImg', '2021-07-09');
  calcMetricByDate(data, 'send test', 'countClick', '2021-07-09');
  calcMetricByDate(data, 'send test', 'lcp', '2021-07-09');

  // добавить свои сценарии, реализовать функции выше
  // ...

  showMetricByPeriod(data, 'send test', 'ttfb', '2021-07-09', '2021-07-11');
  showMetricByPeriod(data, 'send test', 'colorText', '2021-07-09', '2021-07-11');
  showMetricByPeriod(data, 'send test', 'numberImg', '2021-07-09', '2021-07-11');
  showMetricByPeriod(data, 'send test', 'countClick', '2021-07-09', '2021-07-11');
  showMetricByPeriod(data, 'send test', 'lcp', '2021-07-09', '2021-07-11');

  showSession(data, '994640947355', '2021-07-09');

  compareMetric(data, 'ttfb');
});
