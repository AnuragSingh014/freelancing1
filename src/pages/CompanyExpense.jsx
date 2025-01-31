import React, { useState } from "react";
import SearchBox from "../components/instances/SearchBox";
import { MenuListDropDown } from "../components/MenuListDropDown";
import { ServiceTable } from "../components/companyExpense/ServiceTable";
import { ResourceTable } from "../components/companyExpense/ResourceTable";
import { AccountTable } from "../components/companyExpense/AccountTable";
import DatePicker from "../components/companyExpense/DatePicker";
import { useEffect } from "react";
import { se } from "date-fns/locale";

const CompanyExpense = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("mis-uat");
  const [selectedDate, setSelectedDate] = useState(null); // State for the selected date

  const handleMenuItemChange = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const formatDate = (rawDate) => {
    const year = Math.floor(rawDate / 10000);
    const month = Math.floor((rawDate % 10000) / 100);
    const day = rawDate % 100;
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`; // Format: YYYY-MM-DD
  };

  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date);
  };

  const handleApply = () => {
    console.log("Applying filter for:", selectedMenuItem);
    console.log("Selected Date:", selectedDate); // Log the selected date here
  };

  useEffect(() => {
    console.log("Selected Menu Item:", selectedMenuItem);
  }, [selectedMenuItem,selectedDate]);

  return (
    <div className="p-4">
  {/* Heading */}
  <div className="flex flex-row items-center justify-between">
    <div className="pl-5">
      <div className="text-3xl font-medium">Company Expense Summary</div>
      <div className="flex gap-1 mt-3">
        <div className="text-sm"> Summary &gt;</div>
        <div className="text-sm"> Expense Summary &gt;</div>
      </div>
    </div>

    <div className="flex flex-row gap-1.5 items-end">
      <div>
        <div className="text-sm">Time Filter</div>
        <DatePicker date={selectedDate} onDateChange={handleDateChange} /> {/* Pass state and handler */}
      </div>
      <button className="bg-green-400 py-[8px] px-[12px] rounded-md" onClick={handleApply}>
        Apply
      </button>
      <button className="bg-green-500 p-1 rounded-md py-[8px] px-[12px]">Snooze all</button>
    </div>
  </div>

  {/* Three Equal-Height Boxes */}
  <div className="flex w-full mt-16 gap-4">
    {/* Go to Service Catalog */}
    <div className="w-[32%] flex flex-col">
      <div className="flex-1 text-center py-[1.9rem] rounded-md text-xl px-4 bg-blue-gray-200">
        Go to Service Catalog
      </div>
      <div className="mt-6 flex-1">
        <ServiceTable date={selectedDate} />
      </div>
    </div>

    {/* Go to Resource Catalog */}
    <div className="w-[32%] flex flex-col">
      <div className="flex-1 flex text-center rounded-md text-xl p-4 bg-orange-300">
        <span>Go to Resource Catalog </span>
        <MenuListDropDown
          name={selectedMenuItem}
          className="text-black m-0 bg-orange-500 rounded-md text-xl"
          onChange={handleMenuItemChange}
        />
      </div>
      <div className="mt-6 flex-1">
        <ResourceTable resourceGroup={selectedMenuItem} date={selectedDate} />
      </div>
    </div>

    {/* Go to Accounting Catalog */}
    <div className="w-[32%] flex flex-col">
      <div className="flex-1 text-center rounded-md text-xl px-4 py-[1.9rem] bg-purple-300">
        Go to Accounting Catalog
      </div>
      <div className="mt-6 flex-1">
        <AccountTable />
      </div>
    </div>
  </div>
</div>
    
  );
};

export default CompanyExpense;
