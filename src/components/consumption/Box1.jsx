import React, { useEffect, useState } from "react";

const formatDate = (date) => {
  const year = date.getFullYear();
  const monthStr = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${monthStr}-${day}`;
};

const Box1 = ({ selectedCompany, month }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMonthCost, setSelectedMonthCost] = useState(0);
  const [threeMonthCost, setThreeMonthCost] = useState(0);
  const [error, setError] = useState(null);

  const resourceGroupList = [{ name: "prod-rg", vm: "vm-psql-prod-rg-01" }];

  const getDateRange = (mmyy, isThreeMonth = false) => {
    const currentMonth = parseInt(mmyy.substring(0, 2), 10);
    const currentYear = parseInt("20" + mmyy.substring(2, 4), 10);

    if (isThreeMonth) {
      let startMonth = currentMonth - 2;
      let startYear = currentYear;
      if (startMonth < 1) {
        startMonth += 12;
        startYear -= 1;
      }
      return {
        startDate: `${startYear}-${startMonth.toString().padStart(2, "0")}-01`,
        endDate: formatDate(new Date(currentYear, currentMonth - 1, 0))
      };
    }

    // For selected month
    const startDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`;
    const now = new Date();
    let endDate;
    
    if (now.getFullYear() === currentYear && now.getMonth() + 1 === currentMonth) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      endDate = formatDate(yesterday);
    } else {
      endDate = formatDate(new Date(currentYear, currentMonth, 0));
    }

    return { startDate, endDate };
  };

  useEffect(() => {
    if (!selectedCompany?.id || !month) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = "https://vsndirect.com/swagger/api/Consumption/AzureMonitor";
        const clientId = selectedCompany.id;

        const fetchCosts = async (group) => {
          const { name, vm } = group;
          
          // Selected month range
          const selectedRange = getDateRange(month);
          const urlSelected = `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=CPU&fromDate=${selectedRange.startDate}&todate=${selectedRange.endDate}`;

          // 3-month range
          const threeMonthRange = getDateRange(month, true);
          const urlThreeMonth = `${baseUrl}?resourceGroups=${name}&virtualMachines=${vm}&ClientId=${clientId}&resourceData=CPU&fromDate=${threeMonthRange.startDate}&todate=${threeMonthRange.endDate}`;

          const [resSelected, resThreeMonth] = await Promise.all([
            fetch(urlSelected, { headers: { Accept: "*/*" } }),
            fetch(urlThreeMonth, { headers: { Accept: "*/*" } })
          ]);

          if (!resSelected.ok || !resThreeMonth.ok) {
            throw new Error(`HTTP error! Statuses: ${resSelected.status}, ${resThreeMonth.status}`);
          }

          const dataSelected = await resSelected.json();
          const dataThreeMonth = await resThreeMonth.json();

          return {
            selected: dataSelected.cost || 0,
            threeMonth: dataThreeMonth.cost || 0
          };
        };

        const results = await Promise.all(resourceGroupList.map(fetchCosts));
        
        const totalSelected = results.reduce((sum, r) => sum + r.selected, 0);
        const totalThreeMonth = results.reduce((sum, r) => sum + r.threeMonth, 0);

        setSelectedMonthCost(totalSelected);
        setThreeMonthCost(totalThreeMonth);

      } catch (err) {
        console.error("Error fetching costs:", err);
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
          <div className="text-center w-full md:w-1/2 flex flex-col items-center justify-center py-4 bg-blue-100 border border-gray-300">
            <div>CPU Cost</div>
            <div>(Selected Month)</div>
            <div className="text-2xl font-semibold">₹{selectedMonthCost.toFixed(2)}</div>
          </div>
          <div className="text-center w-full md:w-1/2 flex flex-col items-center justify-center py-4 bg-gray-100 border border-gray-300">
            <div>Total CPU Cost</div>
            <div>(Past 3 Months)</div>
            <div className="text-2xl font-semibold">₹{threeMonthCost.toFixed(2)}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Box1;
