import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = [
  "Role Name",
  "Current SKU",
  "Target SKU",
  "Savings Amount",
  "Annual Savings Amount",
  "Max CPU P95",
  "Max Network P95",
  "Max Memory P95"
];

const Table = ({ meterRegion, selectedCompany }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let url = `https://vsndirect.com/swagger/api/Consumption/Advisory?ClientId=${selectedCompany.id}`;  
        
        const response = await fetch(url);
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const transformedData = result.value.map((item) => ({
          roleName: item.properties?.extendedProperties?.roleName || "N/A",
          currentSku: item.properties?.extendedProperties?.currentSku || "N/A",
          targetSku: item.properties?.extendedProperties?.targetSku || "N/A",
          savingsAmount: `$${item.properties?.extendedProperties?.savingsAmount || "0"}`,
          annualSavingsAmount: `$${item.properties?.extendedProperties?.annualSavingsAmount || "0"}`,
          maxCpuP95: `${item.properties?.extendedProperties?.MaxCpuP95 || "0"}%`,
          maxTotalNetworkP95: `${item.properties?.extendedProperties?.MaxTotalNetworkP95 || "0"}%`,
          maxMemoryP95: `${item.properties?.extendedProperties?.MaxMemoryP95 || "0"}%`,
        }));
        
        setData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    // console.log(url)
  }, [selectedCompany]);

  const filteredData = data.filter((item) => {
    if (!meterRegion) return item.roleName !== "N/A";
    return item.roleName !== "N/A" && item.roleName.toLowerCase().includes(meterRegion.toLowerCase());
  });

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [meterRegion]);

  if (loading) {
    return (
      <Card className="h-full w-full p-6 bg-blue">
        <div className="flex items-center justify-center h-64">
          <Typography className="text-gray-600">Loading...</Typography>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-full p-6">
        <div className="flex items-center justify-center h-64">
          <Typography className="text-red-500">Error: {error}</Typography>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full overflow-hidden p-4">
      
      <div className="overflow-x-auto">
        
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10 px-6">
                  <Typography className="font-bold leading-none  text-gray-700">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const isLast = index === currentItems.length - 1;
              const classes = isLast ? "py-4 px-6" : "px-6 py-4 border-b border-gray-300";
              const rowColor = index % 2 === 0 ? "bg-blue-100" : "bg-gray-100";
              
              return (
                <tr key={index} className={`${rowColor} hover:bg-gray-50`}>
                  <td className={classes}><Typography>{item.roleName}</Typography></td>
                  <td className={classes}><Typography>{item.currentSku}</Typography></td>
                  <td className={classes}><Typography>{item.targetSku}</Typography></td>
                  <td className={classes}><Typography>{item.savingsAmount}</Typography></td>
                  <td className={classes}><Typography>{item.annualSavingsAmount}</Typography></td>
                  <td className={classes}><Typography>{item.maxCpuP95}</Typography></td>
                  <td className={classes}><Typography>{item.maxTotalNetworkP95}</Typography></td>
                  <td className={classes}><Typography>{item.maxMemoryP95}</Typography></td>
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
