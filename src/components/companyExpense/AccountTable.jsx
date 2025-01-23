import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const TABLE_HEAD = ["Month", "Total Cost (INR)"];

export function AccountTable() {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchMonthData = async (from, to) => {
          const response = await fetch(
            `http://4.213.167.72/swagger/api/Consumption/TotalCost?from=${from}&to=${to}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "*/*",
              },
              body: JSON.stringify({}), // Send an empty JSON object if the body is required
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          if (!data.properties || !data.properties.rows) {
            throw new Error("Invalid response format");
          }

          return data.properties.rows;
        };

        const calculateLast8Months = () => {
          const today = dayjs();
          const months = [];
          for (let i = 4; i >= 1; i--) {
            const startOfMonth = today.subtract(i, "month").startOf("month");
            const endOfMonth = today.subtract(i, "month").endOf("month");
            months.push({
              from: startOfMonth.format("YYYY-MM-DD"),
              to: endOfMonth.format("YYYY-MM-DD"),
              month: startOfMonth.format("MMMM YYYY"),
            });
          }
          return months;
        };

        const monthsData = calculateLast8Months();
        const allRows = await Promise.all(
          monthsData.map(async ({ from, to, month }) => {
            const rows = await fetchMonthData(from, to);
            const totalCost = rows.reduce(
              (sum, [preTaxCost]) => sum + preTaxCost,
              0
            );
            return { month, totalCost };
          })
        );

        setTableRows(allRows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
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
              {tableRows.map(({ month, totalCost }, index) => {
                const isLast = index === tableRows.length - 1;
                const classes = isLast
                  ? "py-4"
                  : "py-4 border-b border-gray-300";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {month}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        ₹{totalCost.toFixed(2)}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
