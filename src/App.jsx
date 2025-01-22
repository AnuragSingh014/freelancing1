import React from 'react'
import Instances from './pages/Instances'
import Summary from './pages/Summary'
import CompanyExpense from './pages/CompanyExpense'
import Advisory from './pages/Advisory'
import { Navbar } from './components/Navbar'

const App = () => {
  return (
    <div>
      <div className='flex'>
      <div><Navbar /></div>
      <div className='w-[80%]'> 
       {/* <Instances /> */}
       {/* <Summary /> */}
      <CompanyExpense />
      {/* <Advisory /> */}
      </div>
      </div>
      
    </div>
  )
}

export default App