import React, { useEffect, useState } from 'react';
import { Card, Typography } from "@material-tailwind/react";

const resourceGroupsByCompany = {
  'e4211ed5-8d3a-48ad-8d73-ba400c0af811': [
    { name: 'prod-rg', vm: 'vm-psql-prod-rg-01' },
    { name: 'uat-rg', vm: 'vm-psql-uat-rg-01' },
  ],
  '73355c15-9038-4a9d-ae15-31e232bc37e3': [
    {name: 'multiple-domain-rg', vm: 'Aicte-Help-VM1'},
    {name: 'multiple-domain-rg', vm: 'AICTEFIVM'},
    {name: 'multiple-domain-rg', vm: 'AICTEHELPVM1'},
    {name: 'internship-rg', vm: 'AICTEINTVM01'},
    {name: 'nats-portal_rg', vm: 'AICTENATSWEB01'},
    {name: 'anuvadini-rg', vm: 'Anuvadini-App-10'},
  ],
};

const TABLE_HEAD = [
  "Resource Group", "VM Name", "CPU Avg (Current)", "CPU Max",
  "3M CPU Avg", "3M CPU Max", "Memory Avg (GB)", "Memory Max (GB)",
  "3M Memory Avg (GB)", "3M Memory Max (GB)",
];

// UTC-based date calculations
const getMonthRange = (mmyy) => {
  const month = parseInt(mmyy.slice(0, 2)) - 1;
  const year = parseInt('20' + mmyy.slice(2));
  const now = new Date();
  
  const currentUTCFullYear = now.getUTCFullYear();
  const currentUTCMonth = now.getUTCMonth();
  const currentUTCDate = now.getUTCDate();

  const isCurrentMonth = currentUTCFullYear === year && currentUTCMonth === month;

  // Start date is always 1st of month in UTC
  const startDate = new Date(Date.UTC(year, month, 1));
  
  // End date logic
  let endDate;
  if (isCurrentMonth) {
    endDate = new Date(Date.UTC(year, month, currentUTCDate));
  } else {
    // Last day of month in UTC
    endDate = new Date(Date.UTC(year, month + 1, 0));
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

const getThreeMonthRange = (mmyy) => {
  const selectedMonth = parseInt(mmyy.slice(0, 2)) - 1;
  const selectedYear = parseInt('20' + mmyy.slice(2));
  const now = new Date();
  
  const currentUTCFullYear = now.getUTCFullYear();
  const currentUTCMonth = now.getUTCMonth();
  const currentUTCDate = now.getUTCDate();

  const isCurrentMonth = currentUTCFullYear === selectedYear && currentUTCMonth === selectedMonth;

  // Calculate start date (always 1st of 2 months prior in UTC)
  const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 2, 1));

  // Calculate end date
  let endDate;
  if (isCurrentMonth) {
    endDate = new Date(Date.UTC(selectedYear, selectedMonth, currentUTCDate));
  } else {
    // Last day of selected month in UTC
    endDate = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0));
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

const extractHourlyData = (apiData) => {
  if (!apiData?.value || apiData.value.length === 0) return [];
  const metric = apiData.value[0];
  if (!metric.timeseries || metric.timeseries.length === 0) return [];
  const series = metric.timeseries[0];
  return series.data
    ?.filter(point => point.average !== undefined)
    .map(point => ({
      timeStamp: point.timeStamp,
      average: point.average,
    })) || [];
};

const calculateAverages = (hourlyData) => {
  const dailyTotals = {};

  hourlyData.forEach(entry => {
    const date = entry.timeStamp.split('T')[0];
    
    if (!dailyTotals[date]) {
      dailyTotals[date] = { sum: 0, count: 0 };
    }

    dailyTotals[date].sum += entry.average;
    dailyTotals[date].count++;
  });

  console.log('Daily calculations:');
  Object.entries(dailyTotals).forEach(([date, totals]) => {
    console.log(
      `${date}: `,
      `Sum: ${totals.sum.toFixed(4)}, `,
      `Count: ${totals.count}, `,
      `Daily Avg: ${(totals.sum / totals.count).toFixed(4)}`
    );
  });

  const dailyAverages = Object.entries(dailyTotals).reduce((acc, [date, totals]) => {
    acc[date] = totals.sum / totals.count;
    return acc;
  }, {});

  const periodAverage = Object.values(dailyAverages).reduce((a, b) => a + b, 0) / Object.keys(dailyAverages).length || 0;
  const periodMax = Math.max(...Object.values(dailyAverages), 0);

  console.log('Final period calculations:', {
    periodAverage: periodAverage.toFixed(4),
    periodMax: periodMax.toFixed(4),
    numberOfDays: Object.keys(dailyAverages).length
  });

  return {
    dailyAverages,
    periodAverage,
    periodMax
  };
};

const bytesToGB = (bytes) => bytes / 1e9;

const Table = ({ selectedCompany, month }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const resourceGroupList = resourceGroupsByCompany[selectedCompany?.id] || [];

  useEffect(() => {
    const fetchDataForGroup = async (group) => {
      const { name, vm } = group;
      const currentRange = getMonthRange(month);
      const threeMonthRange = getThreeMonthRange(month);

      console.log(`Date ranges for ${vm}:`, {
        current: currentRange,
        threeMonth: threeMonthRange
      });

      const baseUrl = 'https://vsndirect.com/swagger/api/Consumption/AzureMonitor';
      const clientId = selectedCompany.id;

      const buildUrl = (resourceData, fromDate, toDate) => 
        `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=${resourceData}&fromDate=${fromDate}&toDate=${toDate}`;

      try {
        const [cpuCurrentRes, cpuThreeRes, memoryCurrentRes, memoryThreeRes] = await Promise.all([
          fetch(buildUrl('CPU', currentRange.startDate, currentRange.endDate)),
          fetch(buildUrl('CPU', threeMonthRange.startDate, threeMonthRange.endDate)),
          fetch(buildUrl('Memory', currentRange.startDate, currentRange.endDate)),
          fetch(buildUrl('Memory', threeMonthRange.startDate, threeMonthRange.endDate)),
        ]);

        const [cpuCurrent, cpuThree, memoryCurrent, memoryThree] = await Promise.all([
          cpuCurrentRes.json(),
          cpuThreeRes.json(),
          memoryCurrentRes.json(),
          memoryThreeRes.json(),
        ]);

        const processMetric = (data) => {
          const hourlyData = extractHourlyData(data);
          return calculateAverages(hourlyData);
        };

        const cpuCurrentStats = processMetric(cpuCurrent);
        const cpuThreeStats = processMetric(cpuThree);
        const memoryCurrentStats = processMetric(memoryCurrent);
        const memoryThreeStats = processMetric(memoryThree);

        return {
          resourceGroup: name,
          vm: vm,
          cpuCurrentAvg: cpuCurrentStats.periodAverage,
          cpuCurrentMax: cpuCurrentStats.periodMax,
          cpuThreeAvg: cpuThreeStats.periodAverage,
          cpuThreeMax: cpuThreeStats.periodMax,
          memoryCurrentAvg: bytesToGB(memoryCurrentStats.periodAverage),
          memoryCurrentMax: bytesToGB(memoryCurrentStats.periodMax),
          memoryThreeAvg: bytesToGB(memoryThreeStats.periodAverage),
          memoryThreeMax: bytesToGB(memoryThreeStats.periodMax),
        };
      } catch (error) {
        console.error(`Error fetching data for ${name}:`, error);
        return null;
      }
    };

    const fetchAllData = async () => {
      if (!selectedCompany?.id || !month) return;
      
      setLoading(true);
      try {
        const results = await Promise.all(resourceGroupList.map(fetchDataForGroup));
        setTableData(results.filter(Boolean));
      } catch (error) {
        console.error('Error fetching consumption data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [month, selectedCompany, resourceGroupList]);

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
      <div className="mb-4 px-6">
        <Typography variant="small" className="text-gray-600">
          Current selected month: {month}
        </Typography>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10 px-6">
                  <Typography variant="small" className="font-bold leading-none">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={`${row.resourceGroup}-${row.vm}-${index}`} className={`${index % 2 ? 'bg-gray-100' : 'bg-blue-100'} hover:bg-gray-50`}>
                <td className="py-4 px-6">{row.resourceGroup}</td>
                <td className="py-4 px-6">{row.vm}</td>
                <td className="py-4 px-6">{row.cpuCurrentAvg.toFixed(2)}%</td>
                <td className="py-4 px-6">{row.cpuCurrentMax.toFixed(2)}%</td>
                <td className="py-4 px-6">{row.cpuThreeAvg.toFixed(2)}%</td>
                <td className="py-4 px-6">{row.cpuThreeMax.toFixed(2)}%</td>
                <td className="py-4 px-6">{row.memoryCurrentAvg.toFixed(2)} GB</td>
                <td className="py-4 px-6">{row.memoryCurrentMax.toFixed(2)} GB</td>
                <td className="py-4 px-6">{row.memoryThreeAvg.toFixed(2)} GB</td>
                <td className="py-4 px-6">{row.memoryThreeMax.toFixed(2)} GB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Table;