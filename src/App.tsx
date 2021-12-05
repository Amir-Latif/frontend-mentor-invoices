import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import InvoiceView from "./components/InvoiceView";
import { invoiceData } from "./store/invoiceSlice";
import { RootState } from "./store/store";
import { useAppSelector } from "./store/hooks"
import { useEffect } from "react";

export default function App() {
  const invoices: invoiceData[] = useAppSelector((store: RootState) => store.invoices)
  
  useEffect(() => {
    // Set default theme mode  & store if not set already
    !localStorage.getItem('theme') && localStorage.setItem('theme', 'day')
    !localStorage.getItem('invoices') && localStorage.setItem('invoices', JSON.stringify(invoices))

    
  }, [invoices])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" element={<Home />} />
          <Route path="/invoice/:id" element={<InvoiceView />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}