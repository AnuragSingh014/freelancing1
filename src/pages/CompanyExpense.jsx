import React, { useState } from "react";
import SearchBox from "../components/instances/SearchBox";
import { MenuListDropDown } from "../components/MenuListDropDown";
import { ServiceTable } from "../components/companyExpense/ServiceTable";
import { ResourceTable } from "../components/companyExpense/ResourceTable";
import { AccountTable } from "../components/companyExpense/AccountTable";
import DatePicker from "../components/companyExpense/DatePicker";

// const CompanyExpense = () => {
//   const [meterRegion, setMeterRegion] = useState("");

//   const handleMeterRegionChange = (e) => {
//     setMeterRegion(e.target.value);
//   };

//   const handleApply = () => {
//     // You can add additional logic here if needed
//     console.log("Applying filter for region:", meterRegion);
//   };

//   return (
//     <div className="p-4">
//       {/* heading */}
//       <div className="flex flex-row items-center justify-between">
//         <div className=" pl-5">
//           <div className="text-3xl font-medium">Company Expense Summary</div>
//           <div className="flex gap-1 mt-3">
//             <div className="text-sm"> Summary &gt;</div>
//             <div className="text-sm"> Expanse Summary &gt;</div>
//             <MenuListDropDown className="text-black p-0 m-0" />
//           </div>
//         </div>

//         <div className="flex flex-row gap-1.5 items-end">
          
//           <div></div>
//           <div>
//             <div className="text-sm">Time Filter</div>
//             {/* <input
//               type="text"
//               value={meterRegion}
//               onChange={handleMeterRegionChange}
//               className="border rounded-md p-1"
//               placeholder="Enter region"
//             /> */}
//             <DatePicker />
//           </div>
//           <button className="bg-green-400 p-1 rounded-md" onClick={handleApply}>
//             Apply
//           </button>
//           <button className="bg-green-500 p-1 rounded-md">Snooze all</button>
//         </div>
//       </div>



//       <div className="flex w-full mt-16 gap-4">

//         <div className="w-[32%]">
//           <div className="flex-1 text-center rounded-md text-xl p-4 bg-blue-gray-200">
//             Go to Service Catalog
//           </div>
//           <div className="mt-6">
//             {/*  api response added to this table service table*/}
//             <ServiceTable />
//           </div>
//         </div>

//         <div className="w-[32%]">
//           <div className="flex-1 text-center rounded-md text-xl p-4 bg-orange-300">
//             Go to Resource Catalog
//           </div>
//           <div className="mt-6">
//             {/* RESOURCE TABLE */}
//             <ResourceTable />
//           </div>
//         </div>

//         <div className="w-[32%]">
//           <div className="flex-1 text-center rounded-md text-xl p-4 bg-purple-300">
//             Go to Accounting Catalog
//           </div>
//           <div className="mt-6">
//             {/* account table */}
//             <AccountTable />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default CompanyExpense;


const CompanyExpense = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(""); // State to store the selected menu item

  const handleMenuItemChange = (menuItem) => {
    setSelectedMenuItem(menuItem);
    console.log(selectedMenuItem);
  };

  const handleApply = () => {
    // You can add additional logic here if needed
    console.log("Applying filter for:", selectedMenuItem);
  };

  return (
    <div className="p-4">
      {/* heading */}
      <div className="flex flex-row items-center justify-between">
        <div className="pl-5">
          <div className="text-3xl font-medium">Company Expense Summary</div>
          <div className="flex gap-1 mt-3">
            <div className="text-sm"> Summary &gt;</div>
            <div className="text-sm"> Expanse Summary &gt;</div>
            <MenuListDropDown
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
          <button className="bg-green-400 p-1 rounded-md" onClick={handleApply}>
            Apply
          </button>
          <button className="bg-green-500 p-1 rounded-md">Snooze all</button>
        </div>
      </div>

      <div className="flex w-full mt-16 gap-4">
        <div className="w-[32%]">
          <div className="flex-1 text-center rounded-md text-xl p-4 bg-blue-gray-200">
            Go to Service Catalog
          </div>
          <div className="mt-6">
            {/*  api response added to this table service table*/}
            <ServiceTable selectedItem={selectedMenuItem} /> {/* Pass the selectedMenuItem as a prop to ServiceTable */}
          </div>
        </div>

        <div className="w-[32%]">
          <div className="flex-1 text-center rounded-md text-xl p-4 bg-orange-300">
            Go to Resource Catalog
          </div>
          <div className="mt-6">
            {/* RESOURCE TABLE */}
            <ResourceTable selectedItem={selectedMenuItem} /> {/* Pass the selectedMenuItem as a prop to ResourceTable */}
          </div>
        </div>

        <div className="w-[32%]">
          <div className="flex-1 text-center rounded-md text-xl p-4 bg-purple-300">
            Go to Accounting Catalog
          </div>
          <div className="mt-6">
            {/* account table */}
            <AccountTable selectedItem={selectedMenuItem} /> {/* Pass the selectedMenuItem as a prop to AccountTable */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyExpense;