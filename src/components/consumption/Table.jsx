import React, { useEffect, useState } from 'react';
import { Card, Typography } from "@material-tailwind/react";

// Helper: Format a Date object as "yyyy-mm-dd"
const formatDate = (date) => {
  const year = date.getFullYear();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${monthStr}-${day}`;
};

// Get date range for a month from an mmyy string (e.g., "0225")
// If the month is the current month (incomplete), end date is today's date.
const getMonthRange = (mmyy) => {
  const monthPart = mmyy.substring(0, 2);
  const yearPart = '20' + mmyy.substring(2, 4);
  const startDate = `${yearPart}-${monthPart}-01`;

  const now = new Date();
  const requestedMonth = parseInt(monthPart, 10);
  const requestedYear = parseInt(yearPart, 10);

  let endDate;
  if (now.getFullYear() === requestedYear && (now.getMonth() + 1) === requestedMonth) {
    endDate = formatDate(now);
  } else {
    const endDay = new Date(requestedYear, requestedMonth, 0).getDate();
    endDate = `${yearPart}-${monthPart}-${endDay.toString().padStart(2, '0')}`;
  }
  return { startDate, endDate };
};

// Get the range for the past three months (current month plus the two previous months).
// If the current month is incomplete, its end date is set to today's date.
const getThreeMonthRange = (mmyy) => {
  const currentMonth = parseInt(mmyy.substring(0, 2), 10);
  const currentYear = parseInt('20' + mmyy.substring(2, 4), 10);

  let startMonth = currentMonth - 2;
  let startYear = currentYear;
  if (startMonth < 1) {
    startMonth += 12;
    startYear -= 1;
  }
  const startMonthStr = startMonth.toString().padStart(2, '0');
  const startDate = `${startYear}-${startMonthStr}-01`;

  const now = new Date();
  let endDate;
  if (now.getFullYear() === currentYear && (now.getMonth() + 1) === currentMonth) {
    endDate = formatDate(now);
  } else {
    const endDay = new Date(currentYear, currentMonth, 0).getDate();
    const currentMonthStr = currentMonth.toString().padStart(2, '0');
    endDate = `${currentYear}-${currentMonthStr}-${endDay.toString().padStart(2, '0')}`;
  }
  return { startDate, endDate };
};

// Sum all timeseries.average values in the API response.
const sumTimeseries = (apiData) => {
  let total = 0;
  if (apiData && Array.isArray(apiData.value)) {
    apiData.value.forEach((metric) => {
      if (metric.timeseries && Array.isArray(metric.timeseries)) {
        metric.timeseries.forEach((series) => {
          if (series.data && Array.isArray(series.data)) {
            series.data.forEach((point) => {
              if (point.average !== undefined && point.average !== null) {
                total += point.average;
              }
            });
          }
        });
      }
    });
  }
  return total;
};

// Return the maximum data.average value from the API response.
const maxTimeseries = (apiData) => {
  let maxValue = -Infinity;
  if (apiData && Array.isArray(apiData.value)) {
    apiData.value.forEach((metric) => {
      if (metric.timeseries && Array.isArray(metric.timeseries)) {
        metric.timeseries.forEach((series) => {
          if (series.data && Array.isArray(series.data)) {
            series.data.forEach((point) => {
              if (
                point.average !== undefined &&
                point.average !== null &&
                point.average > maxValue
              ) {
                maxValue = point.average;
              }
            });
          }
        });
      }
    });
  }
  return maxValue === -Infinity ? 0 : maxValue;
};

// Updated table headers: Added cost columns.
const TABLE_HEAD = [
  "Resource Group",
  "VM Name",
  "CPU Avg",
  "CPU Max",
  "CPU Cost",
  "Memory Avg",
  "Memory Max",
  "Memory Cost",
];

const Table = ({ selectedCompany, month, onAggregateData }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define resource groups as an array of objects.
  const resourceGroupList = [
    { name: 'prod-rg', vm: 'vm-psql-prod-rg-01' },
    // You can add more resource groups here.
  ];

  useEffect(() => {
    async function fetchDataForGroup(group) {
      const { name, vm } = group;
      const currentRange = getMonthRange(month);
      const threeMonthRange = getThreeMonthRange(month);
      const baseUrl = 'https://vsndirect.com/swagger/api/Consumption/AzureMonitor';
      const clientId = selectedCompany.id;

      // Build URL helper using the provided parameters.
      const buildUrl = (resourceData, fromDate, toDate) =>
        `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=${resourceData}&fromDate=${fromDate}&todate=${toDate}`;

      const urls = {
        cpuCurrent: buildUrl('CPU', currentRange.startDate, currentRange.endDate),
        cpuThree: buildUrl('CPU', threeMonthRange.startDate, threeMonthRange.endDate),
        memoryCurrent: buildUrl('Memory', currentRange.startDate, currentRange.endDate),
        memoryThree: buildUrl('Memory', threeMonthRange.startDate, threeMonthRange.endDate),
      };

      try {
        // Fetch all four API calls in parallel.
        const [
          resCpuCurrent,
          resCpuThree,
          resMemoryCurrent,
          resMemoryThree,
        ] = await Promise.all([
          fetch(urls.cpuCurrent, { headers: { accept: '*/*' } }),
          fetch(urls.cpuThree, { headers: { accept: '*/*' } }),
          fetch(urls.memoryCurrent, { headers: { accept: '*/*' } }),
          fetch(urls.memoryThree, { headers: { accept: '*/*' } }),
        ]);

        const [
          dataCpuCurrent,
          dataCpuThree,
          dataMemoryCurrent,
          dataMemoryThree,
        ] = await Promise.all([
          resCpuCurrent.json(),
          resCpuThree.json(),
          resMemoryCurrent.json(),
          resMemoryThree.json(),
        ]);

        // Calculate number of days in the current month (from currentRange.endDate)
        const currentDaysCount = new Date(currentRange.endDate).getDate();

        // Calculate number of days in the three-month period.
        const startThree = new Date(threeMonthRange.startDate);
        const endThree = new Date(threeMonthRange.endDate);
        const threeMonthDaysCount = Math.floor((endThree - startThree) / (1000 * 60 * 60 * 24)) + 1;

        const avgCpuCurrent = sumTimeseries(dataCpuCurrent) / currentDaysCount;
        const avgMemoryCurrent = sumTimeseries(dataMemoryCurrent) / currentDaysCount;
        const maxCpuCurrent = maxTimeseries(dataCpuCurrent);
        const maxMemoryCurrent = maxTimeseries(dataMemoryCurrent);

        // Extract cost from the API response for current month.
        const costCpu = dataCpuCurrent.cost;
        const costMemory = dataMemoryCurrent.cost;

        // For three-month aggregates, return the sum of averages divided by the total days in the period.
        const threeMonthCpuAvg = sumTimeseries(dataCpuThree) / threeMonthDaysCount;
        const threeMonthMemoryAvg = sumTimeseries(dataMemoryThree) / threeMonthDaysCount;

        return {
          resourceGroup: name,
          vm: vm,
          currentCpu: avgCpuCurrent,      // Average per day for CPU (current month)
          maxCpuCurrent: maxCpuCurrent,     // Maximum CPU average (current month)
          costCpu: costCpu,                // Cost for CPU (current month)
          currentMemory: avgMemoryCurrent,  // Average per day for Memory (current month)
          maxMemoryCurrent: maxMemoryCurrent, // Maximum Memory average (current month)
          costMemory: costMemory,          // Cost for Memory (current month)
          threeMonthCpu: threeMonthCpuAvg, // Three-month aggregate (average daily CPU)
          threeMonthMemory: threeMonthMemoryAvg, // Three-month aggregate (average daily Memory)
          // The following remain for higher component requirements.
          maxCpuThree: maxTimeseries(dataCpuThree),
          maxMemoryThree: maxTimeseries(dataMemoryThree),
        };
      } catch (error) {
        console.error(`Error fetching data for ${name}:`, error);
        return {
          resourceGroup: name,
          vm: vm,
          currentCpu: 0,
          maxCpuCurrent: 0,
          costCpu: 0,
          currentMemory: 0,
          maxMemoryCurrent: 0,
          costMemory: 0,
          threeMonthCpu: 0,
          threeMonthMemory: 0,
          maxCpuThree: 0,
          maxMemoryThree: 0,
        };
      }
    }

    async function fetchAllData() {
      setLoading(true);
      try {
        const results = await Promise.all(
          resourceGroupList.map((group) => fetchDataForGroup(group))
        );
        setTableData(results);

        // Compute aggregates for three-month data, using the averaged values.
        const aggregates = results.reduce(
          (acc, item) => {
            acc.sumCpuThree += item.threeMonthCpu;
            acc.sumMemoryThree += item.threeMonthMemory;
            acc.maxCpuThree = Math.max(acc.maxCpuThree, item.maxCpuThree);
            acc.maxMemoryThree = Math.max(acc.maxMemoryThree, item.maxMemoryThree);
            return acc;
          },
          { sumCpuThree: 0, sumMemoryThree: 0, maxCpuThree: 0, maxMemoryThree: 0 }
        );
        if (onAggregateData) {
          onAggregateData(aggregates);
        }
      } catch (error) {
        console.error('Error fetching consumption data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [month, selectedCompany, onAggregateData]);

  if (loading) {
    return (
      <Card className="h-full w-full p-6">
        <div className="flex items-center justify-center h-64">
          <Typography className="text-gray-600">Loading data...</Typography>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full overflow-hidden px-6 p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10 px-6">
                  <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => {
              const isLast = index === tableData.length - 1;
              const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";
              const rowColor = index % 2 === 0 ? "bg-blue-100" : "bg-gray-100";
              return (
                <tr key={row.resourceGroup} className={`${rowColor} hover:bg-gray-50`}>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.resourceGroup}
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.vm}
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.currentCpu.toFixed(2)}%
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.maxCpuCurrent}%
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.costCpu}
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.currentMemory.toFixed(2)}
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.maxMemoryCurrent}
                    </Typography>
                  </td>
                  <td className={`${classes} px-6`}>
                    <Typography variant="small" className="font-normal text-gray-600">
                      {row.costMemory}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Table;
