import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Service", "Total Cost"];

export function ServiceTable({ selectedCompany, date }) { 
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  // Convert MMYY to YYYY-MM-DD format with correct month end dates
  const getFormattedDates = (dateStr) => {
    const inputMonth = dateStr.slice(0, 2);
    const inputYear = dateStr.slice(2, 4);
    const month = parseInt(inputMonth, 10) - 1; // Convert to 0-based index
    const year = 2000 + parseInt(inputYear, 10);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const fromMonth = String(month + 1).padStart(2, '0');
    const from = `${year}-${fromMonth}-01`;

    const toMonth = String(month + 1).padStart(2, '0');
    const toDay = String(lastDay.getDate()).padStart(2, '0');
    const to = `${year}-${toMonth}-${toDay}`;

    return { from, to };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { from, to } = getFormattedDates(date);
        
        const response = await fetch(
          `https://vsndirect.com/swagger/api/Consumption/CostManagementServiceBy?ClientId=${selectedCompany.id}&from=${from}&to=${to}`,
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

        const rows = data.properties.rows.map(
          ([preTaxCost, usageDate, serviceName, currency]) => ({
            preTaxCost,
            usageDate,
            serviceName,
            currency
          })
        );

        const uniqueServiceNames = [...new Set(rows.map(row => row.serviceName))];

        const aggregatedData = uniqueServiceNames.map((service) => {
          const total = rows
            .filter(({ serviceName }) => serviceName === service)
            .reduce((sum, { preTaxCost }) => sum + parseFloat(preTaxCost), 0);
            
          return { 
            serviceName: service, 
            totalCost: total 
          };
        });

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
  }, [selectedCompany, date]);

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