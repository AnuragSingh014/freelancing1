import fs from 'fs';

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync('300.json', 'utf8'));

// Function to extract hourly data from the JSON response
function extractHourlyData(data) {
  return data.value[0].timeseries[0].data
    .filter(point => point.average !== undefined)
    .map(point => ({
      timeStamp: point.timeStamp,
      average: point.average
    }));
}

// Function to calculate daily and monthly averages
function calculateAverages(hourlyData) {
  const dailyTotals = {};
  const monthlyTotals = {};

  hourlyData.forEach(entry => {
    const date = entry.timeStamp.split('T')[0];
    const month = date.substring(0, 7);

    if (!dailyTotals[date]) {
      dailyTotals[date] = { sum: 0, count: 0 };
    }
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { sum: 0, count: 0 };
    }

    dailyTotals[date].sum += entry.average;
    dailyTotals[date].count++;
    monthlyTotals[month].sum += entry.average;
    monthlyTotals[month].count++;
  });

  const dailyAverages = Object.entries(dailyTotals).reduce((acc, [date, totals]) => {
    acc[date] = totals.sum / totals.count;
    return acc;
  }, {});

  const monthlyAverages = Object.entries(monthlyTotals).reduce((acc, [month, totals]) => {
    acc[month] = totals.sum / totals.count;
    return acc;
  }, {});

  return { dailyAverages, monthlyAverages };
}

const hourlyData = extractHourlyData(jsonData);
const { dailyAverages, monthlyAverages } = calculateAverages(hourlyData);

// Display results
console.log("Daily Averages:");
Object.entries(dailyAverages).forEach(([date, average]) => {
  console.log(`${date}: ${average.toFixed(6)}%`);
});

console.log("\nMonthly Averages:");
Object.entries(monthlyAverages).forEach(([month, average]) => {
  console.log(`${month}: ${average.toFixed(6)}%`);
});
