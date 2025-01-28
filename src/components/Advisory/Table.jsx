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

const Table = ({ meterRegion }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://4.213.167.72/swagger/api/Consumption/Advisory", {
          headers: { accept: "*/*" },
        });

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
  }, []);

  const filteredData = data.filter((item) => {
    if (!meterRegion) return true;
    return item.roleName.toLowerCase().includes(meterRegion.toLowerCase());
  });

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [meterRegion]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <Card className="h-full w-full p-6">
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
    <Card className="h-full w-full overflow-hidden px-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10">
                  <Typography className="font-bold leading-none text-center text-gray-700">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const isLast = index === currentItems.length - 1;
              const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className={classes}>
                    <Typography className="font-normal">
                      {item.roleName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-normal">
                      {item.currentSku}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-normal">
                      {item.targetSku}
                    </Typography>
                  </td>
                  <td className={`${classes} text-right`}>
                    <Typography className="font-normal">
                      {item.savingsAmount}
                    </Typography>
                  </td>
                  <td className={`${classes} text-right`}>
                    <Typography className="font-normal">
                      {item.annualSavingsAmount}
                    </Typography>
                  </td>
                  <td className={`${classes} text-center`}>
                    <Typography className="font-normal">
                      {item.maxCpuP95}
                    </Typography>
                  </td>
                  <td className={`${classes} text-center`}>
                    <Typography className="font-normal">
                      {item.maxTotalNetworkP95}
                    </Typography>
                  </td>
                  <td className={`${classes} text-center`}>
                    <Typography className="font-normal">
                      {item.maxMemoryP95}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="w-full flex items-center justify-center my-4">
        <div className="flex items-center gap-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm transition-all hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
          </p>

          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm transition-all hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Table;