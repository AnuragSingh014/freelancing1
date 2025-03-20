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

const getMonthRange = (mmyy) => {
  const [month, year] = [mmyy.slice(0, 2), '20' + mmyy.slice(2)];
  const startDate = `${year}-${month}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  return { startDate, endDate };
};

const getThreeMonthRange = (mmyy) => {
  const [month, year] = [parseInt(mmyy.slice(0, 2)), parseInt('20' + mmyy.slice(2))];
  const startMonth = (month - 2 + 11) % 12 + 1;
  const startYear = month < 3 ? year - 1 : year;
  const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  return { startDate, endDate };
};

const extractDataPoints = (apiData) => {
  return apiData?.value?.flatMap(metric => 
    metric.timeseries?.flatMap(series => 
      series.data?.filter(point => typeof point.average === 'number' && point.timeStamp)
        .map(point => ({
          date: point.timeStamp.split('T')[0],
          value: point.average
        }))
    ) ?? []
  ) ?? [];
};

const calculateAverage = (apiData) => {
  const dataPoints = extractDataPoints(apiData);
  return dataPoints.length ? dataPoints.reduce((sum, point) => sum + point.value, 0) / dataPoints.length : 0;
};

const calculateMax = (apiData) => {
  const dataPoints = extractDataPoints(apiData);
  const dailySums = dataPoints.reduce((acc, point) => {
    acc[point.date] = (acc[point.date] || 0) + point.value;
    return acc;
  }, {});
  return Math.max(...Object.values(dailySums), 0);
};

const bytesToGB = (bytes) => bytes / 1e9;

const TABLE_HEAD = [
  "Resource Group", "VM Name", "CPU Avg (Current)", "CPU Max",
  "3M CPU Avg", "3M CPU Max", "Memory Avg (GB)", "Memory Max (GB)",
  "3M Memory Avg (GB)", "3M Memory Max (GB)",
];

const Table = ({ selectedCompany, month, onAggregateData }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const resourceGroupList = resourceGroupsByCompany[selectedCompany?.id] || [];

  useEffect(() => {
    const fetchDataForGroup = async (group) => {
      const { name, vm } = group;
      const currentRange = getMonthRange(month);
      const threeMonthRange = getThreeMonthRange(month);
      
      const baseUrl = 'https://vsndirect.com/swagger/api/Consumption/AzureMonitor';
      const clientId = selectedCompany.id;

      const buildUrl = (resourceData, fromDate, toDate) => 
        `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=${resourceData}&fromDate=${fromDate}&toDate=${toDate}`;

      const urls = {
        cpuCurrent: buildUrl('CPU', currentRange.startDate, currentRange.endDate),
        cpuThree: buildUrl('CPU', threeMonthRange.startDate, threeMonthRange.endDate),
        memoryCurrent: buildUrl('Memory', currentRange.startDate, currentRange.endDate),
        memoryThree: buildUrl('Memory', threeMonthRange.startDate, threeMonthRange.endDate),
      };

      try {
        const data = await Promise.all(
          Object.entries(urls).map(async ([key, url]) => {
            const response = await fetch(url, { headers: { accept: '*/*' } });
            return [key, await response.json()];
          })
        ).then(Object.fromEntries);

        return {
          resourceGroup: name,
          vm: vm,
          cpuCurrentAvg: calculateAverage(data.cpuCurrent),
          cpuCurrentMax: calculateMax(data.cpuCurrent),
          cpuThreeAvg: calculateAverage(data.cpuThree),
          cpuThreeMax: calculateMax(data.cpuThree),
          memoryCurrentAvg: bytesToGB(calculateAverage(data.memoryCurrent)),
          memoryCurrentMax: bytesToGB(calculateMax(data.memoryCurrent)),
          memoryThreeAvg: bytesToGB(calculateAverage(data.memoryThree)),
          memoryThreeMax: bytesToGB(calculateMax(data.memoryThree))
        };
      } catch (error) {
        console.error(`Error fetching data for ${name}:`, error);
        return {
          resourceGroup: name, vm: vm,
          cpuCurrentAvg: 0, cpuCurrentMax: 0, cpuThreeAvg: 0, cpuThreeMax: 0,
          memoryCurrentAvg: 0, memoryCurrentMax: 0, memoryThreeAvg: 0, memoryThreeMax: 0,
          error: error.message
        };
      }
    };

    const fetchAllData = async () => {
      if (!selectedCompany?.id || !month) return;
      
      setLoading(true);
      try {
        const results = await Promise.all(resourceGroupList.map(fetchDataForGroup));
        setTableData(results);
        
        if (onAggregateData) {
          const aggregates = results.reduce((acc, item) => ({
            sumCpuThree: acc.sumCpuThree + item.cpuThreeAvg,
            sumMemoryThree: acc.sumMemoryThree + item.memoryThreeAvg,
            maxCpuThree: Math.max(acc.maxCpuThree, item.cpuThreeMax),
            maxMemoryThree: Math.max(acc.maxMemoryThree, item.memoryThreeMax)
          }), { sumCpuThree: 0, sumMemoryThree: 0, maxCpuThree: 0, maxMemoryThree: 0 });
          
          onAggregateData(aggregates);
        }
      } catch (error) {
        console.error('Error fetching consumption data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [month, selectedCompany, onAggregateData, resourceGroupList]);

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
