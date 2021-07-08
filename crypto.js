const cryptoURL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD&CMC_PRO_API_KEY=b9bba246-7f75-441e-8b4c-aa444dbc480c";

function renderLineGraph(coins) {
  const ctx = document.getElementById("myChart");
  const price = coins[0].quote.USD.price;
  const [ninetyAgoPrice] = getHistoricPrices(coins[0]);

  const timeAgo = ["90d", "60d", "30d", "7d", "24h", "1h", "Current"];
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeAgo,
      datasets: [
        {
          label: "Bitcoin",
          borderWidth: 1,
          data: getHistoricPrices(coins[0]),
          borderColor: "rgba(116, 242, 0, 1)",
          backgroundColor: "rgba(116, 242, 0, 0.2)",
        },
        {
          label: "Etherum",
          borderWidth: 1,
          data: getHistoricPrices(coins[1]),
          borderColor: "rgba(255, 146, 255, 1)",
          backgroundColor: "rgba(255, 146, 255, 0.2)",
        },
        {
          label: "Tether",
          borderWidth: 1,
          data: getHistoricPrices(coins[2]),
          borderColor: "rgba(214, 24, 30, 1)",
          backgroundColor: "rgba(214, 24, 30, 0.2)",
        },
        {
          label: "Binance Coin",
          borderWidth: 1,
          data: getHistoricPrices(coins[3]),
          borderColor: "rgba(154, 18, 179, 1)",
          backgroundColor: "rgba(213, 184, 255, .2)", //final rgba value of .2 to enable semi-transparency
        },
        {
          label: "Cardano",
          borderWidth: 1,
          data: getHistoricPrices(coins[4]),
          borderColor: "rgba(249, 105, 14, 1)",
          backgroundColor: "rgba(235, 149, 50, .2)",
        },
      ],
    },
    options: {
      tooltips: {
        enabled: true,
        mode: "nearest",
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || "";

            if (label) {
              label += ": ";
            }
            label += formatter.format(
              Math.round(tooltipItem.yLabel * 100) / 100
            );
            return label;
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              suggestedMin: ninetyAgoPrice,
              suggestedMax: 60,
            },
          },
        ],
      },
    },
  });
}

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function calculatePriceFromPercentageChange(currentPrice, percentageChange) {
  let denominator;
  let historicPrice;
  if (percentageChange >= 100) {
    percentageChange = percentageChange + 100;
    denominator = percentageChange * 0.01;
    historicPrice = currentPrice / denominator;
  }

  if (percentageChange < 100 && percentageChange > 0) {
    denominator = 1 + percentageChange / 100;
    historicPrice = currentPrice / denominator;
  }

  if (percentageChange < 0) {
    const original = (currentPrice / (100 + percentageChange)) * 100;
    historicPrice = original;
  }
  return historicPrice;
}

function getHistoricPrices(coin) {
  const {
    percent_change_90d,
    percent_change_60d,
    percent_change_30d,
    percent_change_7d,
    percent_change_24h,
    percent_change_1h,
    price,
  } = coin.quote.USD;

  const ninetyAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_90d
  );
  const sixtyAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_60d
  );
  const thirtyAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_30d
  );
  const sevenAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_7d
  );
  const dayAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_24h
  );
  const hourAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_1h
  );

  return [
    ninetyAgoPrice,
    sixtyAgoPrice,
    thirtyAgoPrice,
    sevenAgoPrice,
    dayAgoPrice,
    hourAgoPrice,
    price,
  ];
}

function getDayAgoDates() {
  const ninetyAgo = new Date();
  ninetyAgo.setDate(ninetyAgo.getDate() - 90);
  const sixtyAgo = new Date();
  sixtyAgo.setDate(sixtyAgo.getDate() - 60);
  const thirtyAgo = new Date();
  thirtyAgo.setDate(thirtyAgo.getDate() - 30);
  const sevenAgo = new Date();
  sevenAgo.setDate(sevenAgo.getDate() - 7);
  return [
    ninetyAgo.toLocaleString(),
    sixtyAgo.toLocaleString(),
    thirtyAgo.toLocaleString(),
    sevenAgo.toLocaleString(),
  ];
}

async function getCryptoPrices() {
  const response = await fetch(cryptoURL);
  const jsonData = await response.json();
  renderLineGraph(jsonData.data);
}

getCryptoPrices();
