import React, { useState, useEffect } from "react";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = [
  "Instance ID",
  "Name",
  "Resource Group",
  "Quantity",
  "Cost",
  "INR",
  "Unit of Measure",
  "Unit Price",
];

const Table = ({ meterRegion,selectedCompany }) => {
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
          `https://vsndirect.com/swagger/api/Consumption/usage-details?ClientId=${selectedCompany.id}`,
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
        setData(result.value || []);
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
    return (
      item.properties.meterRegion &&
      item.properties.meterRegion.toLowerCase().includes(meterRegion.toLowerCase())
    );
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
    <Card className="h-full w-full overflow-hidden  py-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 pb-4 pt-10 px-2">
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
    const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";
    const rowColor = index % 2 === 0 ? "bg-blue-100" : "bg-gray-100";

    return (
      <tr key={item.id} className={`${rowColor} hover:bg-gray-50`}>
        <td className={classes}>
          <Typography variant="small" color="blue-gray" className="px-2 text-left *:font-bold">
            {item.properties.meterId}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" color="blue-gray" className="px-2 font-bold">
            {item.properties.meterCategory}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" className="px-2 font-normal text-gray-600">
            {item.properties.resourceGroup}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" className="px-2 font-normal text-gray-600">
            {item.properties.quantity}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" className="px-2 font-normal text-gray-600">
            {item.properties.paygCostInBillingCurrency}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" className="px-2 font-normal text-gray-600">
            {item.properties.billingCurrencyCode}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" className="px-2 font-normal text-gray-600">
            {item.properties.unitOfMeasure}
          </Typography>
        </td>
        <td className={classes}>
          <Typography variant="small" className="px-2 font-normal text-gray-600">
            {item.properties.unitPrice}
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
          {/* Pagination Buttons */}
        </div>
      </div>
    </Card>
  );
};

export default Table;
