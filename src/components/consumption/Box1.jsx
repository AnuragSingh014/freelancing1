import React, { useEffect, useState } from "react";

// Helper: Format a Date object as "yyyy-mm-dd"
const formatDate = (date) => {
  const year = date.getFullYear();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${monthStr}-${day}`;
};

const Box1 = ({ selectedCompany, month }) => {
  const [loading, setLoading] = useState(false);
  const [totalCpuCost, setTotalCpuCost] = useState(0);
  const [totalMemoryCost, setTotalMemoryCost] = useState(0);
  const [avgCpuCost, setAvgCpuCost] = useState(0);
  const [avgMemoryCost, setAvgMemoryCost] = useState(0);
  const [error, setError] = useState(null);

  // Use the same resource group list as in your table component.
  const resourceGroupList = [
    { name: "prod-rg", vm: "vm-psql-prod-rg-01" },
    // You can add more resource groups here.
  ];

  // Get three-month range based on a passed month (in "mmyy" format).
  // The range starts from the first day of (currentMonth - 2) and ends:
  //   • at yesterday if the passed month is the current month,
  //   • or at the last day of the passed month otherwise.
  const getThreeMonthRange = (mmyy) => {
    const currentMonth = parseInt(mmyy.substring(0, 2), 10);
    const currentYear = parseInt("20" + mmyy.substring(2, 4), 10);

    let startMonth = currentMonth - 2;
    let startYear = currentYear;
    if (startMonth < 1) {
      startMonth += 12;
      startYear -= 1;
    }
    const startMonthStr = startMonth.toString().padStart(2, "0");
    const startDate = `${startYear}-${startMonthStr}-01`;

    const now = new Date();
    let endDate;
    if (now.getFullYear() === currentYear && (now.getMonth() + 1) === currentMonth) {
      // For the current month, use yesterday's date.
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      endDate = formatDate(yesterday);
    } else {
      // Otherwise, use the last day of the passed month.
      const endDay = new Date(currentYear, currentMonth, 0).getDate();
      const currentMonthStr = currentMonth.toString().padStart(2, "0");
      endDate = `${currentYear}-${currentMonthStr}-${endDay.toString().padStart(2, "0")}`;
    }
    // (daysCount is no longer used for averaging per month.)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return { startDate, endDate, daysCount };
  };

  useEffect(() => {
    if (!selectedCompany || !selectedCompany.id || !month) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { startDate, endDate } = getThreeMonthRange(month);
        const baseUrl = "https://vsndirect.com/swagger/api/Consumption/AzureMonitor";
        const clientId = selectedCompany.id;

        // Build URL helper using the provided parameters.
        // "name" and "vm" come from each resource group.
        const buildUrl = (name, vm, resourceData, fromDate, toDate) =>
          `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=${resourceData}&fromDate=${fromDate}&todate=${toDate}`;

        // For each resource group, fetch cost for CPU and Memory.
        const fetchGroupCost = async (group) => {
          const { name, vm } = group;
          const urlCpu = buildUrl(name, vm, "CPU", startDate, endDate);
          const urlMemory = buildUrl(name, vm, "Memory", startDate, endDate);
          const [resCpu, resMemory] = await Promise.all([
            fetch(urlCpu, { headers: { Accept: "*/*" } }),
            fetch(urlMemory, { headers: { Accept: "*/*" } }),
          ]);

          if (!resCpu.ok || !resMemory.ok) {
            throw new Error(
              `HTTP error for ${name}: CPU status: ${resCpu.status}, Memory status: ${resMemory.status}`
            );
          }

          const dataCpu = await resCpu.json();
          const dataMemory = await resMemory.json();

          return {
            cpuCost: dataCpu.cost || 0,
            memoryCost: dataMemory.cost || 0,
          };
        };

        // Fetch cost for all resource groups in parallel.
        const results = await Promise.all(
          resourceGroupList.map((group) => fetchGroupCost(group))
        );
        let totalCpu = 0;
        let totalMemory = 0;
        results.forEach((result) => {
          totalCpu += result.cpuCost;
          totalMemory += result.memoryCost;
        });

        setTotalCpuCost(totalCpu);
        setTotalMemoryCost(totalMemory);
        // Average per month (over 3 months)
        setAvgCpuCost(totalCpu / 3);
        setAvgMemoryCost(totalMemory / 3);
      } catch (err) {
        console.error("Error fetching consumption cost data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany, month]);

  return (
    <div className="w-full mt-8 flex flex-wrap">
      {loading ? (
        <div className="w-full text-center py-4">Loading...</div>
      ) : error ? (
        <div className="w-full text-center py-4 text-red-500">
          Error loading data: {error.message}
        </div>
      ) : (
        <>
          <div className="text-center w-full md:w-1/4 flex flex-col items-center justify-center py-4 bg-blue-100 border border-gray-300">
            <div>Total CPU Cost</div>
            <div>(Past 3 Months)</div>
            <div className="text-2xl font-semibold">₹{totalCpuCost.toFixed(2)}</div>
          </div>
          <div className="text-center w-full md:w-1/4 flex flex-col items-center justify-center py-4 bg-gray-100 border border-gray-300">
            <div>Total Memory Cost</div>
            <div>(Past 3 Months)</div>
            <div className="text-2xl font-semibold">₹{totalMemoryCost.toFixed(2)}</div>
          </div>
          <div className="text-center w-full md:w-1/4 flex flex-col items-center justify-center py-4 bg-blue-100 border border-gray-300">
            <div>Average CPU Cost per Month</div>
            <div>(Past 3 Months)</div>
            <div className="text-2xl font-semibold">₹{avgCpuCost.toFixed(2)}</div>
          </div>
          <div className="text-center w-full md:w-1/4 flex flex-col items-center justify-center py-4 bg-gray-100 border border-gray-300">
            <div>Average Memory Cost per Month (Past 3 Months) </div>
            <div className="text-2xl font-semibold">₹{avgMemoryCost.toFixed(2)}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Box1;
