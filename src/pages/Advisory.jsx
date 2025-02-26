import React, { useState } from "react";
import SearchBox from "../components/instances/SearchBox";
import Box1 from "../components/instances/Box1";
import Savings from "../components/instances/Savings";
import Table from "../components/Advisory/Table";
import Footer from "../components/instances/Footer";

const Advisory = ({selectedCompany}) => {
  const [meterRegion, setMeterRegion] = useState("");
  // console.log(selectedCompany)
  const handleMeterRegionChange = (e) => {
    setMeterRegion(e.target.value);
  };

  const handleApply = () => {
    // You can add additional logic here if needed
    console.log("Applying filter for region:", meterRegion);
  };

  return (
    <div className="p-4">
      {/* heading */}
      <div className="flex flex-row items-center justify-between">
        <div className="text-3xl">Advisory</div>

        <div className="flex flex-row gap-1.5 items-end">
          <div>
            <SearchBox />
          </div>
          <div></div>
          <div>
            <div className="text-sm">Meter</div>
            <input
              type="text"
              value={meterRegion}
              onChange={handleMeterRegionChange}
              className="border rounded-md p-1"
              placeholder="Enter region"
            />
          </div>
          <button 
            className="bg-green-400 p-1 rounded-md"
            onClick={handleApply}
          > 
            Apply
          </button>
          <button className="bg-green-500 p-1 rounded-md">Snooze all</button>
        </div>
      </div>

      {/* box 1 */}
      {/* <Box1 /> */}
      {/* savings */}
      {/* <Savings /> */}

      {/* table */}
      <Table meterRegion={meterRegion} selectedCompany={selectedCompany} />
    </div>
  );
};

export default Advisory;