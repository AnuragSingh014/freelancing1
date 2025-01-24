import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = [
  "SKU",
  "Commitment",
  "Annual Savings",
  "Savings Amount",
  "Term",
  "Lookback Period"
];

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://4.213.167.72/swagger/api/Consumption/Advisory",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Debug: Log the entire response
        console.log('Full API Response:', result);

        // Defensive mapping with optional chaining
        const filteredData = result.value.map((item) => {
          console.log('Individual Item:', item);
          return {
            sku: item.properties?.extendedProperties?.sku ?? 'N/A',
            commitment: item.properties?.extendedProperties?.commitment ?? 'N/A',
            annualSavingsAmount: item.properties?.extendedProperties?.annualSavingsAmount ?? 'N/A',
            savingsAmount: item.properties?.extendedProperties?.savingsAmount ?? 'N/A',
            term: item.properties?.extendedProperties?.term ?? 'N/A',
            lookbackPeriod: item.properties?.extendedProperties?.lookbackPeriod ?? 'N/A'
          };
        });

        setData(filteredData);
      } catch (err) {
        setError(err.message);
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
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
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const isLast = index === currentItems.length - 1;
              const classes = isLast
                ? "py-4"
                : "py-4 border-b border-gray-300";

              return (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(item).map((value, cellIndex) => (
                    <td key={cellIndex} className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {value || "N/A"}
                      </Typography>
                    </td>
                  ))}
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
            className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Previous
          </button>

          <p className="text-slate-600">
            Page <strong className="text-slate-800">{currentPage}</strong> of{" "}
            <strong className="text-slate-800">
              {Math.ceil(data.length / itemsPerPage)}
            </strong>
          </p>

          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
            className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Table;