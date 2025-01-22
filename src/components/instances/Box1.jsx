import React from 'react'

const Box1 = () => {
  return (
    <div
        className="w-full border-gray-300 mt-8 flex py-4"
        style={{ borderWidth: '0.25px' }}
      >
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div>Instances Current spend</div>
          <div className="text-2xl font-semibold">$210.31</div>
        </div>
        <div className="border-gray-200" style={{borderWidth: '0.25px'}}></div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div className="w-1/2 text-center">Potential savings per year</div>
          <div className="text-2xl font-semibold">$25413.12</div>
        </div>
      </div>
  )
}

export default Box1