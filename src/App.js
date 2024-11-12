import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PrimeReactProvider } from 'primereact/api';


import './App.css';

import Loader from './components/Loader';

const NewSearchPage = lazy(()=>import('./pages/DashboardPage/NewSearchPage'));
const HistoryPage = lazy(()=>import('./pages/DashboardPage/HistoryPage'));
const DetailPage = lazy(()=>import('./pages/DashboardPage/DetailPage'));
const PricingPage = lazy(()=>import('./pages/DashboardPage/PricingPage'));
const MyDashboardPage = lazy(()=>import('./pages/DashboardPage/MyDashboardPage'));
const LoginPage = lazy(()=>import('./pages/LoginPage'));
const HomePage = lazy(()=>import('./pages/HomePage'));
const Payment = lazy(()=>import('./pages/Payment'));
const PaypalPage = lazy(()=>import('./pages/PaypalPage'));

// import MyDash
const initialOptions = {
  "client-id": "AXiwHD2JmTEAWM-_oF525o9u16QNKaMccpM_oLTWOwFwEndTA-shT1AMEjXlF4fTx9SE4LonYBUUPt8i",
  currency: "USD",
  intent: "capture",
};

function App() {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PrimeReactProvider>
        <Suspense fallback={<Loader />}>
          <Router>
            <Routes>
              <Route path="/:to" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/payment/:long" element={<Payment />} />
              <Route path='/my-dashboard' element={<MyDashboardPage />} />
              <Route path='/dashboard-pricing' element={<PricingPage />} />
              <Route path='/new-search' element={<NewSearchPage />} />
              <Route path='/history' element={<HistoryPage />} />
              <Route path='/paypal' element={<PaypalPage />}/>
              <Route path='/detail/:id' element={<DetailPage />} />
            </Routes>
          </Router>
        </Suspense>
      </PrimeReactProvider>
    </PayPalScriptProvider>
  );
}

export default App;
