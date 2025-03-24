// CompanyExpense.jsx
import React, { useState, useEffect } from "react";
import SearchBox from "../components/instances/SearchBox";
import { MenuListDropDown } from "../components/MenuListDropDown";
import { ServiceTable } from "../components/companyExpense/ServiceTable";
import { ResourceTable } from "../components/companyExpense/ResourceTable";
import { AccountTable } from "../components/companyExpense/AccountTable";
import CompanyChart from "../components/companyExpense/CompanyChart";

const monthsData = [
  { display: "Dec 24", value: "1224" },
  { display: "Jan 25", value: "0125" },
  { display: "Feb 25", value: "0225" },
  { display: "Mar 25", value: "0325" },
  { display: "Apr 25", value: "0425" },
  { display: "May 25", value: "0525" },
  { display: "Jun 25", value: "0625" },
  { display: "Jul 25", value: "0725" },
  { display: "Aug 25", value: "0825" },
  { display: "Sep 25", value: "0925" },
  { display: "Oct 25", value: "1025" },
  { display: "Nov 25", value: "1125" },
  { display: "Dec 25", value: "1225" }
];

console.log(monthsData);

const CompanyExpense = ({selectedCompany}) => {

  const getInitialDate = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    return month + year; // "0325" for March 2025
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState("");
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

  return (
    <div className="p-4">
      {/* Heading */}

      

      <div className="flex flex-row items-center justify-between mt-4">
        <div className="pl-5">
          <div className="text-3xl font-medium">Company Expense Summary</div>
          <div className="flex gap-1 mt-3">
            <div className="text-sm"> Summary &gt;</div>
            <div className="text-sm"> Expense Summary &gt;</div>
            <div>
        {selectedCompany.name }
         
        
        </div>
          </div>
        </div>

      

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
      <div className="mt-4 ">
        <CompanyChart selectedCompany={selectedCompany}/>
      </div>
      {/* Three Equal-Height Boxes */}
      <div className="flex w-full mt-16 gap-4">
        {/* Go to Service Catalog */}
        <div className="w-1/3 flex flex-col">
          <div className="flex-1 text-center py-8 rounded-md text-xl px-4 bg-blue-200">
            Service Cost
          </div>
          <div className="mt-6 flex-1">
            <ServiceTable selectedCompany={selectedCompany} date={selectedMonthYear}/>
          </div>
        </div>

        {/* Go to Resource Catalog */}
        <div className="w-1/3 flex flex-col">
          <div className=" flex text-center items-center justify-center rounded-md text-xl px-4 py-8 bg-orange-300">
            <div className="">Resource Cost </div>
            {/* <MenuListDropDown
              selectedCompany={selectedCompany}
              name={selectedMenuItem}
              className="text-black m-0 bg-orange-500 rounded-md text-xl"
              onChange={handleMenuItemChange}
            /> */}
          </div>
          <div className="mt-6 flex-1">
            {/* <ResourceTable resourceGroup={selectedMenuItem} selectedCompany={selectedCompany} date={selectedMonthYear} /> */}
          </div>
        </div>

        {/* Go to Accounting Catalog */}
        <div className="w-1/3 flex flex-col">
          <div className=" text-center rounded-md text-xl px-4 py-8 bg-purple-300">
            Subscription cost
          </div>
          <div className="mt-6 flex-1 h-screen">
            {/* <AccountTable date={selectedMonthYear} selectedCompany={selectedCompany} className="min-h-screen"/> */}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CompanyExpense;