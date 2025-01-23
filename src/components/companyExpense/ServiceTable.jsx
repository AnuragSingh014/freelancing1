import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Expense By Service", ""];

export function ServiceTable() {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://4.213.167.72/swagger/api/Consumption/CostManagementServiceBy",
          {
            method: "GET", // Explicitly specify the HTTP method
            headers: {
              Accept: "*/*", // Capitalized 'Accept' for consistency
            },
          }
        );
        
        const data = await response.json();
        const rows = data.properties.rows.map(([preTaxCost, , serviceName]) => ({
          preTaxCost,
          serviceName,
        }));
        setTableRows(rows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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
              {tableRows.map(({ preTaxCost, serviceName }, index) => {
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
                        {`$${preTaxCost.toFixed(2)}`}
                      </Typography>
                    </td>
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
              })}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
