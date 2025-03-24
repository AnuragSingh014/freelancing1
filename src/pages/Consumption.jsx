import React, { useState,useEffect } from "react";
import SearchBox from "../components/consumption/SearchBox";
import Box1 from "../components/consumption/Box1";
import Savings from "../components/consumption/Savings";
import Table from "../components/consumption/Table";

const monthsData = [
  { display: "Aug 24", value: "0824" },
  { display: "Sep 24", value: "0924" },
  { display: "Oct 24", value: "1024" },
  { display: "Nov 24", value: "1124" },
  { display: "Dec 24", value: "1224" },
  { display: "Jan 25", value: "0125" },
  { display: "Feb 25", value: "0225" },
  { display: "Mar 25", value: "0325" },
  { display: "Apr 25", value: "0425" },
  { display: "May 25", value: "0525" },
  { display: "Jun 25", value: "0625" },
  { display: "Jul 25", value: "0725" },
  { display: "Aug 25", value: "0825" },
];

const Consumption = ({selectedCompany}) => {
  const [meterRegion, setMeterRegion] = useState("");

  const handleMeterRegionChange = (e) => {
    setMeterRegion(e.target.value);
  };
  const getInitialDate = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    return month + year; // "0325" for March 2025
  };


  const [selectedMenuItem, setSelectedMenuItem] = useState("mis-uat");
  const [selectedMonthYear, setSelectedMonthYear] = useState(getInitialDate());

  const handleMenuItemChange = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const handleMonthYearChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedMonthYear(selectedValue);
  };

  const handleApply = () => {
    console.log("Applying filter for:", selectedMenuItem);
    console.log("Selected Month-Year:", selectedMonthYear);
  };

  useEffect(() => {
    console.log("Selected Menu Item:", selectedMenuItem);
    console.log("Selected Month-Year:", selectedMonthYear);
  }, [selectedMenuItem, selectedMonthYear]);

  const [aggregates, setAggregates] = useState({
    maxMemoryThree: 0,
    maxCpuThree: 0,
    sumMemoryThree: 0,
    sumCpuThree: 0,
  });

  return (
    <div className="p-4 w-full">
      {/* heading */}
      <div className="flex flex-row items-center justify-between">
        <div className="text-3xl">Consumption</div>

        <div className="flex flex-row gap-1.5 items-end">
          <div>
            <div className="text-sm">Time Filter</div>
            <select
              value={selectedMonthYear}
              onChange={handleMonthYearChange}
              className="p-2 border rounded-md"
            >
              {monthsData.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.display}
                </option>
              ))}
            </select>
          </div>
          {/* <button className="bg-green-400 py-2 px-3 rounded-md" onClick={handleApply}>
            Apply
          </button>
          <button className="bg-green-500 py-2 px-3 rounded-md">Snooze all</button> */}
        </div>
      </div>

      {/* box 1 */}
      <Box1 selectedCompany={selectedCompany} month={selectedMonthYear}/>
      {/* savings */}
      {/* <Savings /> */}

      {/* table */}
      <div className="flex flex-col md:flex-row items-start gap-0 mt-5">
      {/* Left side: your table */}
      <div className="w-full">
        <Table
          meterRegion={meterRegion}
          month={selectedMonthYear}
          selectedCompany={selectedCompany}
          onAggregateData={setAggregates}
        />
      </div>

      {/* Right side: stat boxes */}
{/*       
      <div className="flex flex-col gap-4 ml-2">
       
        <div className="border border-gray-300 rounded p-4 w-72 text-center">
          <div className="text-sm text-gray-600 uppercase mb-1">3 Month Max Memory</div>
          <div className="text-2xl font-bold text-gray-800">
            {aggregates.maxMemoryThree.toLocaleString()}
          </div>
        </div>

        
        <div className="border border-gray-300 rounded p-4 w-72 text-center">
          <div className="text-sm text-gray-600 uppercase mb-1">3 Month Max CPU</div>
          <div className="text-2xl font-bold text-gray-800">
            {aggregates.maxCpuThree.toLocaleString()}%
          </div>
        </div>

        <div className="border border-gray-300 rounded p-4 w-72 text-center">
          <div className="text-sm text-gray-600 uppercase mb-1">3 Month Average monthly Memory utilization</div>
          <div className="text-2xl font-bold text-gray-800">
            {(((aggregates.sumMemoryThree)).toLocaleString())}
          </div>
        </div>


        <div className="border border-gray-300 rounded p-4 w-72 text-center">
          <div className="text-sm text-gray-600 uppercase mb-1">3 Month average CPU utilization</div>
          <div className="text-2xl font-bold text-gray-800">
            {(((aggregates.sumCpuThree)).toLocaleString())}%
          </div>
        </div>
      </div>
       */}
    </div>
    </div>
  );
};

export default Consumption;