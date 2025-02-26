import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

export default function CompanyChart({selectedCompany}) {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchMonthData = async (from, to, month) => {
          const fromFormatted = encodeURIComponent(dayjs(from).format("YYYY/MM/DD"));
          const toFormatted = encodeURIComponent(dayjs(to).format("YYYY/MM/DD"));

          console.log("Fetching data for:", month, fromFormatted, toFormatted);

          const response = await fetch(
            `https://vsndirect.com/swagger/api/Consumption/TotalCost?from=${fromFormatted}&to=${toFormatted}?ClientId=${selectedCompany.id}`,
            {
              method: "POST",
              headers: { Accept: "*/*" },
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          console.log(`API Response for ${month}:`, data);

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

          for (let i = 3; i >= 1; i--) {
            const startOfMonth = today.subtract(i, "month").startOf("month");
            const endOfMonth = today.subtract(i, "month").endOf("month");
            months.push({
              from: startOfMonth.format("YYYY/MM/DD"),
              to: endOfMonth.format("YYYY/MM/DD"),
              month: startOfMonth.format("MMM"), // Short month format for x-axis
            });
          }

          return months;
        };

        const monthsData = calculateLast5Months();
        const allRows = [];

        for (const { from, to, month } of monthsData) {
          let attempt = 0;
          let monthData = null;

          while (attempt < 10 && !monthData) {
            try {
              monthData = await fetchMonthData(from, to, month);
              allRows.push(monthData);
            } catch (err) {
              console.error(`Error fetching data for ${month} (Attempt ${attempt + 1}): ${err.message}`);
              attempt++;
              if (attempt === 10) {
                console.log(`Skipping ${month} after 10 failed attempts.`);
              }
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        // Sort by month order
        allRows.sort((a, b) => dayjs(a.month, "MMM").isBefore(dayjs(b.month, "MMM")) ? -1 : 1);

        setChartData(allRows.map((item) => item.totalCost));
        setCategories(allRows.map((item) => item.month));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Total Cost",
        data: chartData,
      },
    ],
    options: {
      chart: { toolbar: { show: false } },
      dataLabels: { enabled: false },
      colors: ["#020617"],
      plotOptions: { bar: { columnWidth: "40%", borderRadius: 2 } },
      xaxis: {
        categories,
        labels: {
          style: { colors: "#616161", fontSize: "12px", fontFamily: "inherit", fontWeight: 400 },
        },
      },
      yaxis: {
        labels: {
          style: { colors: "#616161", fontSize: "12px", fontFamily: "inherit", fontWeight: 400 },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        padding: { top: 5, right: 20 },
      },
      fill: { opacity: 0.8 },
      tooltip: { theme: "dark" },
    },
  };

  return (
    <Card>
      {/* <CardHeader floated={false} shadow={false} color="transparent" className="flex flex-col gap-4 rounded-none md:flex-row md:items-center">
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <Square3Stack3DIcon className="h-6 w-6" />
        </div>
        <div>
          
        </div>
      </CardHeader> */}
      <CardBody className="px-2 pb-0">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
}
