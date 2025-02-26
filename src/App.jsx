import React, { useState } from 'react'
import Instances from './pages/Instances'
import Summary from './pages/Summary'
import CompanyExpense from './pages/CompanyExpense'
import Consumption from './pages/Consumption'
import Advisory from './pages/Advisory'
import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router'

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState( { name: "DIBD", id: "33ea3b3a-5274-4aaa-9a19-b98e5b259a8c" }) // Default value

  const handleCompanyChange = (company) => {
    setSelectedCompany(company)
    // console.log(selectedCompany)
  }

  return (
    <div>
      <div className='flex'>
        <div className='bg-blue-100 flex-1 w-full max-w-[14rem] '><Navbar /></div>
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
