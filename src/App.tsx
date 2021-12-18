import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import InvoiceView from "./components/InvoiceView";
import { invoiceData } from "./store/invoiceSlice";
import { RootState } from "./store/store";
import { useAppSelector } from "./store/hooks"
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function App() {
  const invoices: invoiceData[] = useAppSelector((store: RootState) => store.invoices)

  useEffect(() => {
    // Set default theme mode  & store if not set already
    !localStorage.getItem('theme') && localStorage.setItem('theme', 'day')
    !localStorage.getItem('invoices') && localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])


  function AnimatedRoutes() {
    let location = useLocation()

    return (
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />} >
            <Route path="/" element={<Home />} key="homeComponent" />
            <Route path="/invoice/:id" element={<InvoiceView />} key="invoiceComponent" />
          </Route>
        </Routes>
      </AnimatePresence>
    )
  }


  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter >
  );
}