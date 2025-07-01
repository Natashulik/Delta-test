const data = [
  {
    name: "Выручка, руб",
    currentDay: 500521,
    yesterday: 480521,
    sameDay: 4805121,
    chartData: [400000, 465000, 483000, 495000, 490000, 480521, 500521],
  },
  {
    name: "Наличные",
    currentDay: 300000,
    yesterday: 300000,
    sameDay: 300000,
    chartData: [290000, 295000, 300000, 300000, 300000, 300000, 300000],
  },
  {
    name: "Безналичный расчет",
    currentDay: 100000,
    yesterday: 100000,
    sameDay: 100000,
    chartData: [95000, 98000, 100000, 100000, 100000, 100000, 100000],
  },
  {
    name: "Кредитные карты",
    currentDay: 100521,
    yesterday: 100521,
    sameDay: 100521,
    chartData: [98000, 99000, 100000, 100500, 100520, 100521, 100521],
  },
  {
    name: "Средний чек, руб",
    currentDay: 1300,
    yesterday: 900,
    sameDay: 900,
    chartData: [850, 880, 900, 950, 1100, 900, 1300],
  },
  {
    name: "Средний гость, руб",
    currentDay: 1200,
    yesterday: 800,
    sameDay: 800,
    chartData: [850, 880, 900, 950, 1100, 800, 1200],
  },
  {
    name: "Удаления из чека (после оплаты), руб",
    currentDay: 1000,
    yesterday: 1100,
    sameDay: 900,
    chartData: [850, 880, 900, 950, 1100, 1100, 1000],
  },
  {
    name: "Удаления из чека (до оплаты), руб",
    currentDay: 1300,
    yesterday: 1300,
    sameDay: 900,
    chartData: [850, 880, 900, 950, 1100, 1300, 1300],
  },
  {
    name: "Количество чеков",
    currentDay: 34,
    yesterday: 36,
    sameDay: 34,
    chartData: [34, 34, 39, 34, 34, 36, 34],
  },
  {
    name: "Количество гостей",
    currentDay: 34,
    yesterday: 36,
    sameDay: 32,
    chartData: [34, 34, 39, 34, 34, 36, 34],
  },
];

document.addEventListener("DOMContentLoaded", init);

function formatNumber(num) {
  return num.toLocaleString("ru-RU");
}

function calculateTrend(current, previous) {
  if (previous === 0) return "0%";

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change);

  return (rounded > 0 ? "+" : "") + rounded + "%";
}

function createTableRow(rowData) {
  const row = document.createElement("div");
  row.className = "table__row";

  const trend = calculateTrend(rowData.currentDay, rowData.yesterday);
  const trendClass = getTrendClass(trend);

  const trendValue = parseFloat(trend);
  let trendCellClass = "trend-cell_neutral";
  if (trendValue > 0) trendCellClass = "trend-cell_positive";
  if (trendValue < 0) trendCellClass = "trend-cell_negative";

  let sameDayCellClass = "same-day-cell_neutral";
  if (rowData.currentDay > rowData.sameDay) {
    sameDayCellClass = "same-day-cell_positive";
  } else if (rowData.currentDay < rowData.sameDay) {
    sameDayCellClass = "same-day-cell_negative";
  }

  row.innerHTML = `
      <div class="table__cell">${rowData.name}</div>
      <div class="table__cell">${formatNumber(rowData.currentDay)}</div>
      <div class="table__cell ${trendCellClass}">
        ${formatNumber(rowData.yesterday)} 
        <span class="trend ${trendClass}">${trend}</span>
      </div>
      <div class="table__cell ${sameDayCellClass}">${formatNumber(
    rowData.sameDay
  )}</div>
    `;

  return row;
}

function getTrendClass(trend) {
  const value = parseFloat(trend);
  if (value > 0) {
    return "trend_positive";
  } else if (value < 0) {
    return "trend_negative";
  } else {
    return "trend_neutral";
  }
}

function initChart(containerId, rowData) {
  Highcharts.chart(containerId, {
    title: { text: rowData.name },
    series: [
      {
        name: rowData.name,
        data: rowData.chartData,
        color: "#4CAF50",
      },
    ],
    yAxis: {
      lineWidth: 1,
    },
    xAxis: {
      categories: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    },
    chart: {
      type: "line",
    },
  });
}

function createChartContainer(row) {
  const container = document.createElement("div");
  container.className = "chart-container";

  const chartId = `chart-${Math.random().toString(36).slice(2, 11)}`;
  container.id = chartId;

  row.insertAdjacentElement("afterend", container);

  return { container, chartId };
}

function init() {
  const tableBody = document.querySelector(".table__body");

  if (!tableBody) return;

  function removeAllCharts() {
    document.querySelectorAll(".chart-container").forEach(el => el.remove());
  }

  data.forEach(rowData => {
    const row = createTableRow(rowData);
    row.addEventListener("click", () => {
      removeAllCharts();

      document.querySelectorAll(".table__row").forEach(r => {
        r.classList.remove("table__row_active");
      });

      row.classList.add("table__row_active");

      const { chartId } = createChartContainer(row);

      initChart(chartId, rowData);
    });

    tableBody.appendChild(row);
  });
}
