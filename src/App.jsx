import React from 'react'
import Instances from './pages/Instances'
import Summary from './pages/Summary'
import CompanyExpense from './pages/CompanyExpense'
import Advisory from './pages/Advisory'
import { Navbar } from './components/Navbar'
import { Route,Routes } from 'react-router'
const App = () => {
  return (
    <div>
      <div className='flex'>
      <div><Navbar /></div>
      <div className='w-[80%]'> 
        <Routes >
      {/* <ThemeProvider> */}
          <Route path="/" element={<Summary />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/expense" element={<CompanyExpense />} />
          <Route path="/instances" element={<Instances />} />
        </Routes>
      </div>
      </div>
      
    </div>
  )
}

export default App