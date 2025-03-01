import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const TABLE_HEAD = ["Month", "Total Cost"];

export function AccountTable({selectedCompany}) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchMonthData = async (from, to, month) => {
          const fromFormatted = encodeURIComponent(dayjs(from).format("YYYY-MM-DD"));
          const toFormatted = encodeURIComponent(dayjs(to).format("YYYY-MM-DD"));
        
          console.log("Fetching data for:", month, fromFormatted, toFormatted); // Debugging
        
          const url = `https://vsndirect.com/swagger/api/Consumption/TotalCost?from=${fromFormatted}&to=${toFormatted}&ClientId=${selectedCompany.id}`;
        
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Accept: "*/*",
            },
          });
        
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        
          const data = await response.json();
          console.log(`API Response for ${month}:`, data); // Debugging
        
          if (!data.properties || !data.properties.rows) {
            throw new Error(`Invalid response format for ${month}`);
          }
        
          const rows = data.properties.rows;
          const totalCost = rows.reduce((sum, [preTaxCost]) => sum + preTaxCost, 0);
        
          return { month, totalCost };
        };
        

        const calculateLast5Months = () => {
          const today = dayjs();
          const months = [];

          for (let i = 5; i >= 1; i--) {
            const startOfMonth = today.subtract(i, "month").startOf("month");
            const endOfMonth = today.subtract(i, "month").endOf("month");
            months.push({
              from: startOfMonth.format("YYYY/MM/DD"),
              to: endOfMonth.format("YYYY/MM/DD"),
              month: startOfMonth.format("MMMM YYYY"),
            });
          }

          return months;
        };

        // Get last 5 months
        const monthsData = calculateLast5Months();

        // Add December 2024 manually (for given API date range)
        // monthsData.push({
        //   from: "2024/12/01",
        //   to: "2024/12/03",
        //   month: "December 2024",
        // });

        const allRows = [];

        // Retry up to 10 times for each month
        for (const { from, to, month } of monthsData) {
          let attempt = 0;
          let monthData = null;

          // Retry logic
          while (attempt < 10 && !monthData) {
            try {
              monthData = await fetchMonthData(from, to, month);
              allRows.push(monthData); // Only add if data is valid
            } catch (err) {
              console.error(`Error fetching data for ${month} (Attempt ${attempt + 1}): ${err.message}`);
              attempt++;
              if (attempt === 10) {
                console.log(`Skipping ${month} after 10 failed attempts.`);
              }
              // Wait for a short period before retrying (optional, can be adjusted)
              await new Promise((resolve) => setTimeout(resolve, 1000)); 
            }
          }
        }

        setTableRows(allRows);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
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
              {tableRows.map(({ month, totalCost }, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 border-b border-gray-300">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      {month}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-gray-300">
                    <Typography variant="small" className="font-normal text-gray-600">
                      ₹{totalCost.toFixed(2)}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
