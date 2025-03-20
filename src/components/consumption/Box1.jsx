import React, { useEffect, useState } from "react";

// Resource group data based on company ID (unchanged)
const resourceGroupsByCompany = {
  'e4211ed5-8d3a-48ad-8d73-ba400c0af811': [
    { name: 'prod-rg', vm: 'vm-psql-prod-rg-01' },
    { name: 'uat-rg', vm: 'vm-psql-uat-rg-01' },
  ],
  '73355c15-9038-4a9d-ae15-31e232bc37e3': [
    {name: 'multiple-domain-rg', vm: 'Aicte-Help-VM1'},
    {name: 'multiple-domain-rg', vm: 'AICTEFIVM'},
    {name: 'multiple-domain-rg', vm: 'AICTEHELPVM1'},
    {name: 'internship-rg', vm: 'AICTEINTVM01'},
    {name: 'nats-portal_rg', vm: 'AICTENATSWEB01'},
    {name: 'anuvadini-rg', vm: 'Anuvadini-App-10'},
  ],
};

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

  // Use resource groups based on selected company
  const resourceGroupList = resourceGroupsByCompany[selectedCompany?.id] || [];

  const getDateRange = (mmyy, isThreeMonth = false) => {
    if (!mmyy || mmyy.length !== 4) {
      console.error("Invalid month format", mmyy);
      return null;
    }

    const currentMonth = parseInt(mmyy.substring(0, 2), 10);
    const currentYear = parseInt("20" + mmyy.substring(2, 4), 10);

    // Validate month value
    if (currentMonth < 1 || currentMonth > 12) {
      console.error("Invalid month value", currentMonth);
      return null;
    }

    if (isThreeMonth) {
      let startMonth = currentMonth - 2;
      let startYear = currentYear;
      if (startMonth < 1) {
        startMonth += 12;
        startYear -= 1;
      }
      return {
        startDate: `${startYear}-${startMonth.toString().padStart(2, "0")}-01`,
        endDate: formatDate(new Date(currentYear, currentMonth, 0))
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
      endDate = formatDate(new Date(currentYear, currentMonth, 0)); // Last day of the month
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
          const threeMonthRange = getDateRange(month, true);

          if (!selectedRange || !threeMonthRange) {
            console.error("Invalid date range");
            return { selected: 0, threeMonth: 0 };
          }

          // Properly encode URL parameters
          const encodedResourceGroup = encodeURIComponent(name);
          const encodedVM = encodeURIComponent(vm);

          const urlSelected = `${baseUrl}?resourceGroups=${encodedResourceGroup}&virtualMachines=${encodedVM}&ClientId=${clientId}&resourceData=CPU&fromDate=${selectedRange.startDate}&toDate=${selectedRange.endDate}`;
          const urlThreeMonth = `${baseUrl}?resourceGroups=${encodedResourceGroup}&virtualMachines=${encodedVM}&ClientId=${clientId}&resourceData=CPU&fromDate=${threeMonthRange.startDate}&toDate=${threeMonthRange.endDate}`;

          try {
            const [resSelected, resThreeMonth] = await Promise.all([
              fetch(urlSelected, { headers: { Accept: "*/*" } }),
              fetch(urlThreeMonth, { headers: { Accept: "*/*" } })
            ]);

            // Handle HTTP error responses
            if (!resSelected.ok) {
              console.error(`Selected month request failed: ${resSelected.status}`);
              return { selected: 0, threeMonth: 0 };
            }
            
            if (!resThreeMonth.ok) {
              console.error(`Three month request failed: ${resThreeMonth.status}`);
              return { selected: 0, threeMonth: 0 };
            }

            const dataSelected = await resSelected.json();
            const dataThreeMonth = await resThreeMonth.json();

            // Safely access cost property with fallbacks
            const selectedCost = dataSelected && typeof dataSelected.cost === 'number' ? dataSelected.cost : 0;
            const threeMonthCost = dataThreeMonth && typeof dataThreeMonth.cost === 'number' ? dataThreeMonth.cost : 0;

            return {
              selected: selectedCost,
              threeMonth: threeMonthCost
            };
          } catch (err) {
            console.error(`Error fetching costs for ${name}/${vm}:`, err);
            return { selected: 0, threeMonth: 0 };
          }
        };

        // Use Promise.allSettled instead of Promise.all to handle individual failures
        const results = await Promise.allSettled(resourceGroupList.map(fetchCosts));
        
        // Process results, handling both fulfilled and rejected promises
        const validResults = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);
        
        const totalSelected = validResults.reduce((sum, r) => sum + r.selected, 0);
        const totalThreeMonth = validResults.reduce((sum, r) => sum + r.threeMonth, 0);

        setSelectedMonthCost(totalSelected);
        setThreeMonthCost(totalThreeMonth);

      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany, month, resourceGroupList]);

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
