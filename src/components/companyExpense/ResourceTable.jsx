import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Date", "PreTax Cost"];

export function ResourceTable({ resourceGroup, date }) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("component remounting");
        const response = await fetch(
          `http://4.213.167.72/swagger/api/Consumption/CostManagementResourceBy?ResourceGroup=${resourceGroup}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        
        const data = await response.json();
        
        // Convert all rows to proper date format
        const rows = data.properties.rows.map(([preTaxCost, usageDate]) => ({
          preTaxCost,
          usageDate: parseInt(usageDate.toString()),
          displayDate: new Date(
            usageDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          ).toLocaleDateString()
        }));

        // Filter rows if date is selected
        let filteredRows = rows;
        if (date) {
          const selectedDate = formatDateToNumber(date);
          filteredRows = rows.filter(row => row.usageDate === selectedDate);
        }

        setTableRows(filteredRows);
        console.log("Filtered rows:", filteredRows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [resourceGroup, date]); // Add date to dependency array

  // Helper function to convert Date object to YYYYMMDD number format
  const formatDateToNumber = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return parseInt(`${year}${month}${day}`);
  };

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {tableRows.length === 0 ? (
              <div className="text-center py-4">
                {date ? "No data available for selected date" : "No data for current company"}
              </div>
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
                  {tableRows.map(({ preTaxCost, displayDate }, index) => {
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
                            {displayDate}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-gray-600"
                          >
                            {` ₹${preTaxCost.toFixed(2)}`}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </Card>
    </section>
  );
}