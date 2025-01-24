import React from 'react'

const Savings = () => {
  return (
    <div className="flex w-full mt-4 border-gray-300" style={{borderBottomWidth: '0.25px'}}>
        <div className="p-2 flex flex-col gap">
          <div className="font-bold text-lg">All</div>
          <div className="font-semibold">Potential savings</div>
          <div className="text-lime-600 text-2xl">$25,453.63</div>
        </div>
        
        <div className="p-2 flex flex-col gap">
          <div className="font-bold text-lg">RightSizing</div>
          <div className="font-semibold">Potential savings</div>
          <div className="text-lime-600 text-2xl">$25,453.63</div>
        </div>

        <div className="p-2 flex flex-col gap">
          <div className="font-bold text-lg">Startup/shutDown</div>
          <div className="font-semibold">Potential savings</div>
          <div className="text-lime-600 text-2xl">$25,453.63</div>
        </div>

        <div className="p-2 flex flex-col gap">
          <div className="font-bold text-lg">Idle Instances</div>
          <div className="font-semibold">Potential savings</div>
          <div className="text-lime-600 text-2xl">$25,453.63</div>
        </div>
      </div>
  )
}

export default Savings