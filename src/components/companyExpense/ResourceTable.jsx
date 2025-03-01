import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Resource", "Total Cost"];

export function ResourceTable({ resourceGroup, selectedCompany }) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!resourceGroup) return;

    const fetchData = async () => {
      setLoading(true);
      let retryCount = 0;
      const maxRetries = 10;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          const response = await fetch(
            `https://vsndirect.com/swagger/api/Consumption/CostManagementResourceBy?ResourceGroup=${resourceGroup}&ClientId=${selectedCompany.id}`,
            { headers: { accept: "*/*" } }
          );

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          const rows = data.properties.rows.map(([preTaxCost]) => ({ preTaxCost }));
          const total = rows.reduce((sum, { preTaxCost }) => sum + preTaxCost, 0);
            console.log(data.properties.rows)
          setTableRows([{ resourceName: resourceGroup, totalCost: total }]);
          setTotalCost(total);
          success = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [resourceGroup, selectedCompany.id]);

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6 flex flex-col">
        {loading ? (
          <div className="text-center py-4 flex-grow">Loading...</div>
        ) : (
          <div className="flex flex-col flex-grow">
            {/* Table Header */}
            <div className="flex justify-between border-b border-gray-300 pb-4 pt-10 px-4">
              {TABLE_HEAD.map((head) => (
                <Typography 
                  key={head}
                  variant="small" 
                  color="blue-gray" 
                  className="font-bold leading-none"
                >
                  {head}
                </Typography>
              ))}
            </div>

            {/* Single Data Row */}
            {tableRows[0] && (
              <div className="flex justify-between hover:bg-gray-50 border-b border-gray-300 py-4 px-4">
                <Typography 
                  variant="small" 
                  color="blue-gray" 
                  className="font-normal truncate"
                >
                  {tableRows[0].resourceName}
                </Typography>
                <Typography 
                  variant="small" 
                  color="blue-gray" 
                  className="font-bold"
                >
                  ₹{typeof tableRows[0].totalCost === "number" 
                    ? tableRows[0].totalCost.toFixed(2) 
                    : "N/A"}
                </Typography>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-4 text-red-500">
                Error loading data: {error.message}
              </div>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}
