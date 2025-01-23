import React, { useState } from "react";
import SearchBox from "../components/instances/SearchBox";
import { MenuListDropDown } from "../components/MenuListDropDown";
import { ServiceTable } from "../components/companyExpense/ServiceTable";
import { ResourceTable } from "../components/companyExpense/ResourceTable";
import { AccountTable } from "../components/companyExpense/AccountTable";
import DatePicker from "../components/companyExpense/DatePicker";
import { useEffect } from "react";


const CompanyExpense = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("AzureBackupRG_centralindia_1"); // State to store the selected menu item

  const handleMenuItemChange = (menuItem) => {
    setSelectedMenuItem(menuItem);
    // console.log(selectedMenuItem);
  };

  const handleApply = () => {
    // You can add additional logic here if needed
    console.log("Applying filter for:", selectedMenuItem);
  };

  useEffect(() => {
    console.log(selectedMenuItem);
  }, [selectedMenuItem]);

  return (
    <div className="p-4">
      {/* heading */}
      <div className="flex flex-row items-center justify-between">
        <div className="pl-5">
          <div className="text-3xl font-medium">Company Expense Summary</div>
          <div className="flex gap-1 mt-3">
            <div className="text-sm"> Summary &gt;</div>
            <div className="text-sm"> Expanse Summary &gt;</div>
            <MenuListDropDown name={selectedMenuItem}
              className="text-black p-0 m-0"
              onChange={handleMenuItemChange} // Pass the handleMenuItemChange function as a prop
            />
          </div>
        </div>

        <div className="flex flex-row gap-1.5 items-end">
          <div></div>
          <div>
            <div className="text-sm">Time Filter</div>
            <DatePicker />
          </div>
          <button className="bg-green-400 py-[8px] px-[12px] rounded-md" onClick={handleApply}>
            Apply
          </button>
          <button className="bg-green-500 p-1 rounded-md py-[8px] px-[12px]">Snooze all</button>
        </div>
      </div>

      <div className="flex w-full mt-16 gap-4">
        <div className="w-[32%]">
          <div className="flex-1 text-center rounded-md text-xl p-4 bg-blue-gray-200">
            Go to Service Catalog
          </div>
          <div className="mt-6">
            {/*  api response added to this table service table*/}
            <ServiceTable  /> {/* Pass the selectedMenuItem as a prop to ServiceTable */}
          </div>
        </div>

        <div className="w-[32%]">
          <div className="flex-1 text-center rounded-md text-xl p-4 bg-orange-300">
            Go to Resource Catalog
          </div>
          <div className="mt-6">
            {/* RESOURCE TABLE */}
            <ResourceTable resourceGroup={selectedMenuItem} /> 
{/* {console.log("selectedMenuItem:", selectedMenuItem)} Pass the selectedMenuItem as a prop to ResourceTable */}
          </div>
        </div>

        <div className="w-[32%]">
          <div className="flex-1 text-center rounded-md text-xl p-4 bg-purple-300">
            Go to Accounting Catalog
          </div>
          <div className="mt-6">
            {/* account table */}
            <AccountTable/> 
            {/* Pass the selectedMenuItem as a prop to AccountTable */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyExpense;