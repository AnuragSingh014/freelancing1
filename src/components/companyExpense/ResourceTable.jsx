import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Resource", "Total Cost"];

export function ResourceTable({ resourceGroup, selectedCompany }) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    // Reset states when resource group changes
    setError(null);
    
    if (!resourceGroup || resourceGroup === "") return;

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors
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

          setTableRows([{ resourceName: resourceGroup, totalCost: total }]);
          setTotalCost(total);
          setError(null); // Ensure error is cleared on success
          success = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } finally {
          if (retryCount >= maxRetries && !success) {
            // If we've exhausted all retries and still failed
            setLoading(false);
          } else if (success) {
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, [resourceGroup, selectedCompany.id]);

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6 flex flex-col">
        {resourceGroup === "" ? (
          <div className="flex-1 flex items-center justify-center">
            <Typography variant="h6" color="gray" className="text-center">
              Please select a resource group
            </Typography>
          </div>
        ) : loading ? (
          <div className="text-center py-4 flex-grow">Loading...</div>
        ) : error ? (
          // Dedicated error display section with better visibility
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4 text-red-500 border border-red-200 rounded bg-red-50 max-w-xs">
              <Typography variant="small" className="font-medium">
                Error loading data: {error.message}
              </Typography>
            </div>
          </div>
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
          </div>
        )}
      </Card>
    </section>
  );
}
