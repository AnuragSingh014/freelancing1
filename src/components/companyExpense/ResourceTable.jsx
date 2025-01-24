import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const TABLE_HEAD = ["Date", "PreTax Cost"];

export function ResourceTable({ resourceGroup }) {
  // console.log(resourceGroup);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("component remounting")
        const response = await fetch(
          `http://4.213.167.72/swagger/api/Consumption/CostManagementResourceBy?ResourceGroup=${resourceGroup}`,
          {
            method: "GET", // Explicitly specify the HTTP method for clarity
            headers: {
              Accept: "*/*",
            },
          }
        );
        
        const data = await response.json();
        const rows = data.properties.rows.map(([preTaxCost, usageDate]) => ({
          preTaxCost,
          usageDate: new Date(
            usageDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
          ).toLocaleDateString(),
        }));
        setTableRows(rows);
        console.log(rows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [resourceGroup]);

  return (
    <section className="bg-white">
      <Card className="h-96 overflow-y-auto border border-gray-300 px-6">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {tableRows.length === 0 ? (
              <div className="text-center py-4">No data for current company</div>
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
                  {tableRows.map(({ preTaxCost, usageDate }, index) => {
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
                            {usageDate}
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