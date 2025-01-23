import React from "react";
import { Pamplet } from "../components/summary/Card";
import { MenuListDropDown } from "../components/MenuListDropDown";

const Summary = () => {
  return (
    <div className="p-4">
      <div className=" pl-5">
        <div className="text-3xl font-medium">Summary</div>
        <div className="flex gap-1 mt-3">
          <div className="text-sm"> Summary &gt;</div>
          <MenuListDropDown className="text-black p-0 m-0"/>
        </div>
      </div>
      <div className="flex gap-1 mt-6">
        <Pamplet
          url={"/summary/summary1.jpeg"}
          heading="Chargeback Summary"
          title="Chargeback Summary"
        />
        <Pamplet
          url={"/summary/summary2.jpeg"}
          heading="Expense Summary"
          title="Expense Summary"
        />
        <Pamplet
          url={"/summary/summary3.jpeg"}
          heading="Optmizer Summary"
          title="Optmizer Summary"
        />
      </div>
    </div>
  );
};

export default Summary;
