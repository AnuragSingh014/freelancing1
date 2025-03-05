import React, { useEffect, useState } from 'react';
import { Card, Typography } from "@material-tailwind/react";

const formatDate = (date) => {
  const year = date.getFullYear();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${monthStr}-${day}`;
};

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

const sumTimeseries = (apiData) => {
  let total = 0;
  if (apiData?.value) {
    apiData.value.forEach((metric) => {
      metric.timeseries?.forEach((series) => {
        series.data?.forEach((point) => {
          if (typeof point.average === 'number') total += point.average;
        });
      });
    });
  }
  return total;
};

const maxTimeseries = (apiData) => {
  let maxValue = -Infinity;
  if (apiData?.value) {
    apiData.value.forEach((metric) => {
      metric.timeseries?.forEach((series) => {
        series.data?.forEach((point) => {
          if (point.average > maxValue) maxValue = point.average;
        });
      });
    });
  }
  return maxValue === -Infinity ? 0 : maxValue;
};

const TABLE_HEAD = [
  "Resource Group",
  "VM Name",
  // CPU Metrics
  "CPU Avg (Current)",
  // "CPU Sum",
  "CPU Max",
  "3M CPU Avg",
  "3M CPU Max",
  "CPU Cost (Current)",
  "3M CPU Cost",
  // Memory Metrics
  "Memory Avg",
  // "Memory Sum",
  "Memory Max",
  "3M Memory Avg",
  "3M Memory Max",
  // "Memory Cost",
  // "3M Memory Cost"
];

const Table = ({ selectedCompany, month, onAggregateData }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const resourceGroupList = [
    { name: 'prod-rg', vm: 'vm-psql-prod-rg-01' },
  ];

  useEffect(() => {
    async function fetchDataForGroup(group) {
      const { name, vm } = group;
      const currentRange = getMonthRange(month);
      const threeMonthRange = getThreeMonthRange(month);
      const baseUrl = 'https://vsndirect.com/swagger/api/Consumption/AzureMonitor';
      const clientId = selectedCompany.id;

      const buildUrl = (resourceData, fromDate, toDate) =>
        `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=${resourceData}&fromDate=${fromDate}&todate=${toDate}`;

      const urls = {
        cpuCurrent: buildUrl('CPU', currentRange.startDate, currentRange.endDate),
        cpuThree: buildUrl('CPU', threeMonthRange.startDate, threeMonthRange.endDate),
        memoryCurrent: buildUrl('Memory', currentRange.startDate, currentRange.endDate),
        memoryThree: buildUrl('Memory', threeMonthRange.startDate, threeMonthRange.endDate),
      };

      try {
        const [
          resCpuCurrent,
          resCpuThree,
          resMemoryCurrent,
          resMemoryThree,
        ] = await Promise.all(Object.values(urls).map(url => 
          fetch(url, { headers: { accept: '*/*' } })
        ));

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

        // Current month calculations
        const currentDaysCount = new Date(currentRange.endDate).getDate();
        const sumCpuCurrent = sumTimeseries(dataCpuCurrent);
        const sumMemoryCurrent = sumTimeseries(dataMemoryCurrent);

        // Three-month calculations
        const threeMonthCpuAvg = sumTimeseries(dataCpuThree) / 3;
        const threeMonthMemoryAvg = sumTimeseries(dataMemoryThree) / 3;

        return {
          resourceGroup: name,
          vm: vm,
          // CPU Metrics
          currentCpu: sumCpuCurrent / currentDaysCount,
          sumCpuCurrent,
          maxCpuCurrent: maxTimeseries(dataCpuCurrent),
          threeMonthCpuAvg,
          maxCpuThree: maxTimeseries(dataCpuThree),
          costCpu: dataCpuCurrent.cost || 0,
          costCpuThree: dataCpuThree.cost || 0,
          
          // Memory Metrics
          currentMemory: sumMemoryCurrent / currentDaysCount,
          sumMemoryCurrent,
          maxMemoryCurrent: maxTimeseries(dataMemoryCurrent),
          threeMonthMemoryAvg,
          maxMemoryThree: maxTimeseries(dataMemoryThree),
          costMemory: dataMemoryCurrent.cost || 0,
          costMemoryThree: dataMemoryThree.cost || 0
        };
      } catch (error) {
        console.error(`Error fetching data for ${name}:`, error);
        return {
          resourceGroup: name,
          vm: vm,
          currentCpu: 0, sumCpuCurrent: 0, maxCpuCurrent: 0,
          threeMonthCpuAvg: 0, maxCpuThree: 0, costCpu: 0, costCpuThree: 0,
          currentMemory: 0, sumMemoryCurrent: 0, maxMemoryCurrent: 0,
          threeMonthMemoryAvg: 0, maxMemoryThree: 0, costMemory: 0, costMemoryThree: 0
        };
      }
    }

    async function fetchAllData() {
      setLoading(true);
      try {
        const results = await Promise.all(resourceGroupList.map(fetchDataForGroup));
        setTableData(results);
        
        if (onAggregateData) {
          const aggregates = results.reduce((acc, item) => ({
            sumCpuThree: acc.sumCpuThree + item.threeMonthCpuAvg,
            sumMemoryThree: acc.sumMemoryThree + item.threeMonthMemoryAvg,
            maxCpuThree: Math.max(acc.maxCpuThree, item.maxCpuThree),
            maxMemoryThree: Math.max(acc.maxMemoryThree, item.maxMemoryThree)
          }), { sumCpuThree: 0, sumMemoryThree: 0, maxCpuThree: 0, maxMemoryThree: 0 });
          
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
                  <Typography variant="small" className="font-bold leading-none">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row.resourceGroup} className={`${index % 2 ? 'bg-gray-100' : 'bg-blue-100'} hover:bg-gray-50`}>
                <td className="py-4 px-6">{row.resourceGroup}</td>
                <td className="py-4 px-6">{row.vm}</td>
                
                {/* CPU Columns */}
                <td className="py-4 px-6">{row.currentCpu.toFixed(2)}%</td>
                {/* <td className="py-4 px-6">{row.sumCpuCurrent.toFixed(2)}%</td> */}
                <td className="py-4 px-6">{row.maxCpuCurrent.toFixed(2)}%</td>
                <td className="py-4 px-6">{row.threeMonthCpuAvg.toFixed(2)}%</td>
                <td className="py-4 px-6">{row.maxCpuThree.toFixed(2)}%</td>
                <td className="py-4 px-6">₹{row.costCpu.toFixed(2)}</td>
                <td className="py-4 px-6">₹{row.costCpuThree.toFixed(2)}</td>
                
                {/* Memory Columns */}
                <td className="py-4 px-6">{((row.currentMemory)/1e9).toFixed(2)}GB</td>
                {/* <td className="py-4 px-6">{((row.sumMemoryCurrent)/1e9).toFixed(2)}GB</td> */}
                <td className="py-4 px-6">{((row.maxMemoryCurrent)/1e9).toFixed(2)}GB</td>
                <td className="py-4 px-6">{((row.threeMonthMemoryAvg)/1e9).toFixed(2)}GB</td>
                <td className="py-4 px-6">{((row.maxMemoryThree)/1e9).toFixed(2)}GB</td>
                {/* <td className="py-4 px-6">₹{row.costMemory.toFixed(2)}</td>
                <td className="py-4 px-6">₹{row.costMemoryThree.toFixed(2)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default Table;
