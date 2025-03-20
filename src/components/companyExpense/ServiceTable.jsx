import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Service", "Total Cost"];

export function ServiceTable({selectedCompany }) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://vsndirect.com/swagger/api/Consumption/CostManagementServiceBy?ClientId=${selectedCompany.id}`,
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
  
        const data = await response.json();
        
        // Extract rows from the properties object
        const rows = data.properties.rows.map(
          ([preTaxCost, usageDate, serviceName, currency]) => ({
            preTaxCost,
            usageDate,
            serviceName,
            currency
          })
        );
  
        // Extract unique service names
        const uniqueServiceNames = [...new Set(rows.map(row => row.serviceName))];
        console.log("Unique Service Names:", uniqueServiceNames);
  
        // Aggregate costs for each service
        const aggregatedData = uniqueServiceNames.map((service) => {
          const total = rows
            .filter(({ serviceName }) => serviceName === service)
            .reduce((sum, { preTaxCost }) => sum + parseFloat(preTaxCost), 0);
            
          return { 
            serviceName: service, 
            totalCost: total 
          };
        });
  
        // Calculate grand total
        const grandTotal = aggregatedData.reduce(
          (sum, { totalCost }) => sum + totalCost,
          0
        );
  
        setTableRows(aggregatedData);
        setTotalCost(grandTotal);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedCompany]);
  

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6 flex flex-col">
        {loading ? (
          <div className="text-center py-4 flex-grow">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Error loading data: {error.message}
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="p-4 border-b">
              <Typography variant="h6" className="font-bold">
                Total Cost: ₹{totalCost.toFixed(2)}
              </Typography>
            </div>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th 
                      key={head} 
                      className="border-b border-gray-300 pb-4 pt-4 px-6"
                    >
                      <Typography 
                        variant="small" 
                        className="font-bold leading-none"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows
                  .filter(({ totalCost }) => totalCost > 0)
                  .map(({ serviceName, totalCost }, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 even:bg-gray-50"
                    >
                      <td className="py-3 px-6">
                        <Typography className="font-normal">
                          {serviceName}
                        </Typography>
                      </td>
                      <td className="py-3 px-6">
                        <Typography className="font-bold">
                          ₹{totalCost.toFixed(2)}
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
