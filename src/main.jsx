import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@material-tailwind/react";
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router';
import Advisory from './pages/Advisory';
import CompanyExpense from './pages/CompanyExpense';
import Instances from './pages/Instances';

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
  <ThemeProvider >
  <StrictMode>
     <App />
  </StrictMode>
  </ThemeProvider >
  </BrowserRouter>
)
