import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Date", "Expense", "Service"]; // Adjusted column order

export function ServiceTable({ date }) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://4.213.167.72/swagger/api/Consumption/CostManagementServiceBy",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );

        const data = await response.json();

        // Process all rows
        const rows = data.properties.rows.map(
          ([preTaxCost, usageDate, serviceName]) => ({
            preTaxCost,
            usageDate,
            serviceName,
          })
        );

        // Convert the selected date to YYYYMMDD format for comparison
        const selectedDate = date ? formatDateToNumber(date) : null;

        // Filter rows only if a date is specified
        const filteredRows = selectedDate
          ? rows.filter(({ usageDate }) => usageDate === selectedDate)
          : rows;

        setTableRows(filteredRows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [date]); // Re-fetch when date changes

  // Helper function to convert Date object to YYYYMMDD number format
  const formatDateToNumber = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    return parseInt(`${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`);
  };

  // Format date number back to YYYY-MM-DD string for display
  const formatDate = (rawDate) => {
    const year = Math.floor(rawDate / 10000);
    const month = Math.floor((rawDate % 10000) / 100);
    const day = rawDate % 100;
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  };

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
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
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No data available for the selected date.
                  </td>
                </tr>
              ) : (
                tableRows.map(({ preTaxCost, usageDate, serviceName }, index) => {
                  const isLast = index === tableRows.length - 1;
                  const classes = isLast
                    ? "py-4"
                    : "py-4 border-b border-gray-300";

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      {/* Date */}
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {formatDate(usageDate)}
                        </Typography>
                      </td>
                      {/* Expense */}
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {`$${preTaxCost.toFixed(2)}`}
                        </Typography>
                      </td>
                      {/* Service */}
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal text-gray-600"
                        >
                          {serviceName}
                        </Typography>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
