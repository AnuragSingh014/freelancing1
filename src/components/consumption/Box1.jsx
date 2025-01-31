import React, { useEffect, useState } from "react";

const Box1 = () => {
  const [loading, setLoading] = useState(false);
  const [instanceSpend, setInstanceSpend] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://vsndirect.com/swagger/api/Consumption/Advisory",
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Assuming the response is an object with a key containing the array of items
        const items = data.value || data.items || []; // Adjust based on actual response structure

        let totalSavingsAmount = 0;
        let totalAnnualSavingsAmount = 0;

        items.forEach((item) => {
          const { savingsAmount, annualSavingsAmount } =
            item.properties?.extendedProperties || {};

          totalSavingsAmount += parseFloat(savingsAmount) || 0;
          totalAnnualSavingsAmount += parseFloat(annualSavingsAmount) || 0;
        });

        setInstanceSpend(totalSavingsAmount);
        setPotentialSavings(totalAnnualSavingsAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="w-full border-gray-300 mt-8 flex py-4"
      style={{ borderWidth: "0.25px" }}
    >
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div>Instances Current spend</div>
        <div className="text-2xl font-semibold">
          {loading ? "Loading..." : `₹${83*instanceSpend.toFixed(2)}`}
        </div>
      </div>
      <div className="border-gray-200" style={{ borderWidth: "0.25px" }}></div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="w-1/2 text-center">Potential savings per year</div>
        <div className="text-2xl font-semibold">
          {loading ? "Loading..." : `₹${83*potentialSavings.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
};

export default Box1;
