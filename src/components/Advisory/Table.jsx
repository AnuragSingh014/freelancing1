import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = [
  "Deployment ID",
  "Role Name",
  "Current SKU",
  "Target SKU",
  "Recommendation Message",
  "Region ID",
  "Subscription ID",
  "Duration",
  "Recommendation Type ID",
  "Problem",
  "Solution",
  "Savings Amount",
  "Annual Savings Amount",
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
        const response = await fetch("/api/api/Consumption/Advisory", {
          headers: { accept: "*/*" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Transform the API response to match the required format
        const transformedData = result.value.map((item) => ({
          deploymentId: item.name,
          roleName:
            item.properties?.resourceMetadata?.resourceId?.split("/").pop() ||
            "N/A",
          currentSku: item.properties?.extendedProperties?.sku || "N/A",
          targetSku: item.properties?.extendedProperties?.commitment || "N/A",
          recommendationMessage:
            item.properties?.shortDescription?.recommendationMessage || "N/A",
          regionId: item.properties?.extendedProperties?.scope || "N/A",
          subscriptionId: item.properties?.subscriptionId || "N/A",
          duration: item.properties?.extendedProperties?.duration || "N/A",
          recommendationTypeId:
            item.properties?.recommendationTypeId || "N/A",
          problem: item.properties?.shortDescription?.problem || "N/A",
          solution: item.properties?.shortDescription?.solution || "N/A",
          savingsAmount:
            item.properties?.extendedProperties?.savingsAmount || "0",
          annualSavingsAmount:
            item.properties?.extendedProperties?.annualSavingsAmount || "0",
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
    return item.regionId.toLowerCase().includes(meterRegion.toLowerCase());
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

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

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
                    className="font-bold leading-none text-center"
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
              const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";

              return (
                <tr key={item.deploymentId} className="hover:bg-gray-50">
                  {Object.values(item).map((value, idx) => (
                    <td
                      key={idx}
                      className={`${classes} max-w-[200px] truncate`}
                      title={value}
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {truncateText(value, 20)}
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
              {Math.ceil(filteredData.length / itemsPerPage)}
            </strong>
          </p>

          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
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
