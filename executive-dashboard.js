const executiveSchema = {
  period: "period",
  outpatientIncome: "outpatientIncome",
  inpatientIncome: "inpatientIncome",
  checkupIncome: "checkupIncome",
  outpatientPatients: "outpatientPatients",
  inpatientPatients: "inpatientPatients",
  checkupCount: "checkupCount",
  surgeryCount: "surgeryCount",
  bedOccupancyRate: "bedOccupancyRate",
  checkupItems: "checkupItems",
  departmentPerformance: "departmentPerformance"
};

const checkupItemSchema = {
  name: "name",
  count: "count",
  income: "income"
};

const departmentSchema = {
  name: "name",
  totalIncome: "totalIncome",
  previousTotalIncome: "previousTotalIncome"
};

const executiveMockData = [
  {
    period: "2025.02",
    outpatientIncome: 5280000,
    inpatientIncome: 3180000,
    checkupIncome: 560000,
    outpatientPatients: 23720,
    inpatientPatients: 6810,
    checkupCount: 1650,
    surgeryCount: 1190,
    bedOccupancyRate: 81.9,
    checkupItems: [
      { name: "종합검진", count: 390, income: 260000 },
      { name: "일반검진", count: 820, income: 145000 },
      { name: "보건대행", count: 270, income: 98000 },
      { name: "환경측정", count: 170, income: 57000 }
    ],
    departmentPerformance: []
  },
  {
    period: "2026.01",
    outpatientIncome: 7010000,
    inpatientIncome: 4140000,
    checkupIncome: 710000,
    outpatientPatients: 42180,
    inpatientPatients: 7426,
    checkupCount: 1970,
    surgeryCount: 1294,
    bedOccupancyRate: 84.3,
    checkupItems: [
      { name: "종합검진", count: 455, income: 322000 },
      { name: "일반검진", count: 1010, income: 178000 },
      { name: "보건대행", count: 305, income: 124000 },
      { name: "환경측정", count: 200, income: 86000 }
    ],
    departmentPerformance: [
      { name: "외과", totalIncome: 2480000, previousTotalIncome: 2200000 },
      { name: "내과", totalIncome: 2350000, previousTotalIncome: 2140000 },
      { name: "정형외과", totalIncome: 2050000, previousTotalIncome: 1920000 },
      { name: "응급의학과", totalIncome: 1180000, previousTotalIncome: 1110000 },
      { name: "신경외과", totalIncome: 1050000, previousTotalIncome: 1010000 },
      { name: "영상의학과", totalIncome: 1300000, previousTotalIncome: 1400000 },
      { name: "피부과", totalIncome: 760000, previousTotalIncome: 812000 },
      { name: "재활의학과", totalIncome: 920000, previousTotalIncome: 976000 },
      { name: "안과", totalIncome: 840000, previousTotalIncome: 872000 },
      { name: "가정의학과", totalIncome: 680000, previousTotalIncome: 700000 }
    ]
  },
  {
    period: "2026.02",
    outpatientIncome: 7260000,
    inpatientIncome: 5580000,
    checkupIncome: 836000,
    outpatientPatients: 43860,
    inpatientPatients: 7604,
    checkupCount: 2158,
    surgeryCount: 1284,
    bedOccupancyRate: 86.4,
    checkupItems: [
      { name: "종합검진", count: 510, income: 384000 },
      { name: "일반검진", count: 1118, income: 206000 },
      { name: "보건대행", count: 330, income: 142000 },
      { name: "환경측정", count: 200, income: 104000 }
    ],
    departmentPerformance: [
      { name: "외과", totalIncome: 2810000, previousTotalIncome: 2480000 },
      { name: "내과", totalIncome: 2580000, previousTotalIncome: 2350000 },
      { name: "정형외과", totalIncome: 2220000, previousTotalIncome: 2050000 },
      { name: "응급의학과", totalIncome: 1250000, previousTotalIncome: 1180000 },
      { name: "신경외과", totalIncome: 1090000, previousTotalIncome: 1050000 },
      { name: "영상의학과", totalIncome: 1180000, previousTotalIncome: 1300000 },
      { name: "피부과", totalIncome: 704000, previousTotalIncome: 760000 },
      { name: "재활의학과", totalIncome: 857000, previousTotalIncome: 920000 },
      { name: "안과", totalIncome: 807000, previousTotalIncome: 840000 },
      { name: "가정의학과", totalIncome: 661000, previousTotalIncome: 680000 }
    ]
  }
];

const numberOrZero = (value) => Number(value) || 0;
const parsePeriod = (period) => {
  const [year, month] = String(period).split(".").map(Number);
  return { year, month };
};
const periodKey = (period) => {
  const { year, month } = parsePeriod(period);
  return year * 100 + month;
};
const getPreviousPeriod = (period) => {
  const { year, month } = parsePeriod(period);
  return month === 1 ? `${year - 1}.12` : `${year}.${String(month - 1).padStart(2, "0")}`;
};
const getPreviousYearPeriod = (period) => {
  const { year, month } = parsePeriod(period);
  return `${year - 1}.${String(month).padStart(2, "0")}`;
};

function getLatestRecord(rows, schema) {
  return [...rows].filter((row) => row?.[schema.period]).sort((a, b) => periodKey(b[schema.period]) - periodKey(a[schema.period]))[0];
}

function findRecordByPeriod(rows, schema, period) {
  return rows.find((row) => row?.[schema.period] === period);
}

function calculateTotalIncome(row, schema) {
  if (!row) return 0;
  return numberOrZero(row[schema.outpatientIncome]) + numberOrZero(row[schema.inpatientIncome]) + numberOrZero(row[schema.checkupIncome]);
}

function calculateRate(current, base, suffix = "%") {
  if (!base) return "-";
  const value = ((current - base) / Math.abs(base)) * 100;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}${suffix}`;
}

function calculatePointChange(current, base) {
  if (base === undefined || base === null) return "-";
  const value = current - base;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%p`;
}

function formatMonth(period) {
  const { year, month } = parsePeriod(period);
  return `${year}년 ${month}월`;
}

function formatNumber(value) {
  return numberOrZero(value).toLocaleString("ko-KR");
}

function formatIncome(value) {
  return `${formatNumber(value)}천원`;
}

function formatIncomeShort(value) {
  return `${(numberOrZero(value) / 100000).toFixed(1)}억`;
}

function asRateNumber(rateText) {
  if (rateText === "-") return 0;
  return Math.min(100, Math.max(8, Math.abs(parseFloat(rateText)) * 6));
}

function renderRate(rateText) {
  const cls = rateText !== "-" && rateText.startsWith("-") ? "down" : "";
  return `<b class="${cls}">${rateText}</b>`;
}

function getComparisons(rows, schema, current, valueGetter, point = false) {
  const previous = findRecordByPeriod(rows, schema, getPreviousPeriod(current[schema.period]));
  const previousYear = findRecordByPeriod(rows, schema, getPreviousYearPeriod(current[schema.period]));
  const currentValue = valueGetter(current);
  return {
    mom: previous ? (point ? calculatePointChange(currentValue, valueGetter(previous)) : calculateRate(currentValue, valueGetter(previous))) : "-",
    yoy: previousYear ? (point ? calculatePointChange(currentValue, valueGetter(previousYear)) : calculateRate(currentValue, valueGetter(previousYear))) : "-"
  };
}

function createSubMetrics(metrics = []) {
  if (!metrics.length) return "";
  return `<div class="kpi-submetrics">${metrics.map(([label, value]) => `<span>${label} : <b>${value}</b></span>`).join("")}</div>`;
}

function createKpiMeta(comparisons) {
  return `<div class="kpi-meta"><span>전년동월 : ${renderRate(comparisons.yoy)}</span><span>전월 : ${renderRate(comparisons.mom)}</span></div>`;
}

function createUnifiedKpi({ tag = "article", href = "", className = "", title, period, primary, subMetrics, comparisons, extra = "" }) {
  const open = tag === "a" ? `<a class="kpi-card executive-kpi-card ${className}" href="${href}">` : `<article class="kpi-card executive-kpi-card ${className}">`;
  const close = tag === "a" ? "</a>" : "</article>";
  return `${open}<span>${title}</span><em class="kpi-month">${formatMonth(period)}</em><strong>${primary}</strong>${createSubMetrics(subMetrics)}<div class="kpi-divider"></div>${createKpiMeta(comparisons)}${extra}${close}`;
}

function createCheckupKpi(current, comparisons, schema, itemSchema) {
  const items = current[schema.checkupItems] || [];
  const rows = items.map((item) => `<li><span>${item[itemSchema.name]}</span><b>${formatNumber(item[itemSchema.count])}건</b><strong>${formatIncome(item[itemSchema.income])}</strong></li>`).join("");
  return createUnifiedKpi({
    title: "검진",
    period: current[schema.period],
    primary: `검진건수 : ${formatNumber(current[schema.checkupCount])}건`,
    subMetrics: [["검진수입", formatIncome(current[schema.checkupIncome])]],
    comparisons,
    className: "checkup-kpi",
    extra: `<ul class="checkup-breakdown">${rows}</ul>`
  });
}

function renderBars(containerId, metrics, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = metrics.map((metric) => {
    const rate = metric[type];
    const warningClass = rate !== "-" && rate.startsWith("-") ? " danger" : "";
    return `<div class="h-row executive-tooltip" data-tooltip="${metric.label} ${type === "mom" ? "전월" : "전년동월"} 대비 ${rate}"><span>${metric.label}</span><div class="track"><div class="fill${warningClass}" style="width:${asRateNumber(rate)}%"></div></div><strong class="${rate.startsWith("-") ? "down" : ""}">${rate}</strong></div>`;
  }).join("");
}

function renderDepartmentRanking(containerId, departments, direction) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const ranked = [...departments].map((department) => {
    const current = numberOrZero(department[departmentSchema.totalIncome]);
    const previous = numberOrZero(department[departmentSchema.previousTotalIncome]);
    const rate = previous ? ((current - previous) / Math.abs(previous)) * 100 : 0;
    return { ...department, current, previous, rate, amount: current - previous };
  }).filter((department) => direction === "up" ? department.rate > 0 : department.rate < 0)
    .sort((a, b) => {
      const rateOrder = direction === "up" ? b.rate - a.rate : a.rate - b.rate;
      return rateOrder || b.current - a.current;
    })
    .slice(0, 5);

  container.innerHTML = ranked.map((department) => {
    const rateText = `${department.rate >= 0 ? "+" : ""}${department.rate.toFixed(1)}%`;
    const amountText = `${department.amount >= 0 ? "+" : ""}${formatIncomeShort(department.amount)}`;
    const valueClass = department.rate < 0 ? "down" : "up";
    return `<li class="executive-tooltip" data-tooltip="전월 대비 ${department.name}: ${amountText}, ${rateText}"><span>${department.name}</span><strong class="${valueClass}">${amountText} / ${rateText}</strong></li>`;
  }).join("") || `<li><span>표시할 데이터가 없습니다.</span><strong>-</strong></li>`;
}

function renderExecutiveDashboard(rows = executiveMockData, schema = executiveSchema) {
  const kpiContainer = document.getElementById("executiveKpis");
  if (!rows.length) {
    kpiContainer.innerHTML = `<article class="kpi-card empty-state">데이터가 없습니다.</article>`;
    return;
  }

  const current = getLatestRecord(rows, schema);
  const period = current[schema.period];
  const comparisons = {
    totalIncome: getComparisons(rows, schema, current, (row) => calculateTotalIncome(row, schema)),
    outpatient: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.outpatientPatients])),
    inpatient: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.inpatientPatients])),
    checkup: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.checkupCount])),
    outpatientIncome: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.outpatientIncome])),
    inpatientIncome: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.inpatientIncome])),
    checkupIncome: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.checkupIncome])),
    surgery: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.surgeryCount])),
    bed: getComparisons(rows, schema, current, (row) => numberOrZero(row[schema.bedOccupancyRate]), true)
  };

  document.getElementById("latestMonthLabel").textContent = `${formatMonth(period)} 기준`;
  document.getElementById("executiveSummary").textContent = `총수입은 ${formatIncome(calculateTotalIncome(current, schema))}이며, 검진수입을 포함한 최신 월 기준으로 병원 전체 경영현황을 표시합니다.`;

  kpiContainer.innerHTML = [
    createUnifiedKpi({
      title: "총수입",
      period,
      primary: formatIncome(calculateTotalIncome(current, schema)),
      subMetrics: [
        ["외래수입", formatIncome(current[schema.outpatientIncome])],
        ["입원수입", formatIncome(current[schema.inpatientIncome])],
        ["검진수입", formatIncome(current[schema.checkupIncome])]
      ],
      comparisons: comparisons.totalIncome
    }),
    createUnifiedKpi({
      title: "외래환자",
      period,
      primary: `외래환자 : ${formatNumber(current[schema.outpatientPatients])}명`,
      subMetrics: [["외래수입", formatIncome(current[schema.outpatientIncome])]],
      comparisons: comparisons.outpatient
    }),
    createUnifiedKpi({
      title: "입원환자",
      period,
      primary: `입원환자 : ${formatNumber(current[schema.inpatientPatients])}명`,
      subMetrics: [["입원수입", formatIncome(current[schema.inpatientIncome])]],
      comparisons: comparisons.inpatient
    }),
    createCheckupKpi(current, comparisons.checkup, schema, checkupItemSchema),
    createUnifiedKpi({
      title: "수술",
      period,
      primary: `수술건수 : ${formatNumber(current[schema.surgeryCount])}건`,
      comparisons: comparisons.surgery
    })
  ].join("");

  const previous = findRecordByPeriod(rows, schema, getPreviousPeriod(period));
  const previousYear = findRecordByPeriod(rows, schema, getPreviousYearPeriod(period));
  const momAmount = previous ? calculateTotalIncome(current, schema) - calculateTotalIncome(previous, schema) : 0;
  const yoyAmount = previousYear ? calculateTotalIncome(current, schema) - calculateTotalIncome(previousYear, schema) : 0;

  document.getElementById("executiveSubKpis").innerHTML = [
    createUnifiedKpi({
      title: "병상가동률",
      period,
      primary: `${numberOrZero(current[schema.bedOccupancyRate]).toFixed(1)}%`,
      comparisons: comparisons.bed
    }),
    createUnifiedKpi({
      title: "전년동월 대비 총 변화",
      period,
      primary: `<span class="kpi-major-lines"><b>${previousYear ? formatIncomeShort(yoyAmount) : "-"}</b><i>전월 대비 총 변화</i><b>${previous ? formatIncomeShort(momAmount) : "-"}</b></span>`,
      comparisons: comparisons.totalIncome
    }),
    createUnifiedKpi({
      tag: "a",
      href: "./key-management-indicators.html",
      className: "risk-card",
      title: "위험신호",
      period,
      primary: "5건",
      comparisons: { yoy: "-", mom: "-" },
      extra: `<ul class="risk-details"><li>영상의학과 3개월 연속 감소</li><li>피부과 환자수 감소</li><li>재활의학과 수입 감소</li><li>정형외과 수술건수 감소</li><li>특정 교수 실적 하락</li></ul>`
    })
  ].join("");

  const chartMetrics = [
    { label: "총수입", ...comparisons.totalIncome },
    { label: "외래수입", ...comparisons.outpatientIncome },
    { label: "입원수입", ...comparisons.inpatientIncome },
    { label: "검진수입", ...comparisons.checkupIncome },
    { label: "수술건수", ...comparisons.surgery },
    { label: "병상가동률", ...comparisons.bed }
  ];
  renderBars("momBars", chartMetrics, "mom");
  renderBars("yoyBars", chartMetrics, "yoy");
  renderDepartmentRanking("topIncreaseDepartments", current[schema.departmentPerformance] || [], "up");
  renderDepartmentRanking("topDecreaseDepartments", current[schema.departmentPerformance] || [], "down");
}

renderExecutiveDashboard();
