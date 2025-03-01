import React, { useState } from 'react'
import Instances from './pages/Instances'
import Summary from './pages/Summary'
import CompanyExpense from './pages/CompanyExpense'
import Consumption from './pages/Consumption'
import Advisory from './pages/Advisory'
import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router'

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState( { name: "KUM", id: "e4211ed5-8d3a-48ad-8d73-ba400c0af811" }) // Default value

  const handleCompanyChange = (company) => {
    setSelectedCompany(company)
    // console.log(selectedCompany)
  }

  return (
    <div>
      <div className='flex'>
        <div className='bg-blue-100 flex-1 w-full max-w-[14rem]'><Navbar /></div>
          <div className='w-[75%]'> 
            <Routes>
              <Route path="/" element={<Summary onCompanyChange={handleCompanyChange} selectedCompany={selectedCompany} />} />
              <Route path="/advisory" element={<Advisory selectedCompany={selectedCompany} />} />
              <Route path="/expense" element={<CompanyExpense selectedCompany={selectedCompany} />} />
              <Route path="/instances" element={<Instances selectedCompany={selectedCompany} />} />
              <Route path="/consumption" element={<Consumption selectedCompany={selectedCompany} />} />
            </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
