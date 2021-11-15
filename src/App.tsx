import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { invoicesData } from "./store/invoiceSlice";
import { RootState } from "./store/store";
import { useAppSelector } from "./store/hooks"
import { useEffect } from "react";

export default function App() {
  const invoices: invoicesData[] = useAppSelector((store: RootState) => store.invoices)
  // Set default theme mode if not set already
  useEffect(() => {
    !localStorage.getItem('theme') && localStorage.setItem('theme', 'day')
    !localStorage.getItem('invoices') && localStorage.setItem('invoices', JSON.stringify(invoices))

  }, [invoices])
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}