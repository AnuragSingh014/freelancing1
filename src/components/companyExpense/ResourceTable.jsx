import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Resource", "Total Cost"];

export function ResourceTable({ resourceGroup }) {
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
          console.log("Fetching data for resourceGroup:", resourceGroup);

          const response = await fetch(
            `https://vsndirect.com/swagger/api/Consumption/CostManagementResourceBy?ResourceGroup=${resourceGroup}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const rows = data.properties.rows.map(([preTaxCost]) => ({
            preTaxCost,
          }));

          const total = rows.reduce((sum, { preTaxCost }) => sum + preTaxCost, 0);

          setTableRows([{ resourceName: resourceGroup, totalCost: total }]);
          setTotalCost(total);
          setLoading(false);
          success = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error);
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Retrying... attempt ${retryCount + 1}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, [resourceGroup]);

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6 flex flex-col">
        {loading ? (
          <div className="text-center py-4 flex-grow">Loading...</div>
        ) : (
          <div className="flex flex-col flex-grow">
            <table className="w-full min-w-max table-auto text-left flex-grow">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-b border-gray-300 pb-4 pt-10">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ resourceName, totalCost }, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 border-b border-gray-300">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {resourceName}
                      </Typography>
                    </td>
                    <td className="py-4 border-b border-gray-300">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        ₹{typeof totalCost === "number" ? totalCost.toFixed(2) : "Error Fetching Data"}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
