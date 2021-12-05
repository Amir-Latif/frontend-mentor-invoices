import React, { useEffect, useState } from "react"
import { Button, ButtonGroup, Dropdown, Stack, ToggleButton } from "react-bootstrap"
import { useNavigate } from "react-router"
import { DropdownArrow, IconArrowRight, IconPlus } from ".."
import { useAppSelector } from "../store/hooks"
import { invoiceData } from "../store/invoiceSlice"
import InvoiceForm from "./InvoiceForm"
import Status from "./Status"
import "./home.css"

export default function Home() {
    /*=============================
       Vaiables & Hooks
       ==============================*/
    const [desktopView, setDesktopView] = useState(window.matchMedia('(min-width: 992px)').matches)
    const theme: string = useAppSelector(store => store.themeDay)
    const navigateTo = useNavigate()

    // Invoices
    const allInvoices: invoiceData[] = useAppSelector(store => store.invoices)
    let invoices: invoiceData[] = allInvoices;
    // Invoice filter
    const dropDownRadio = [
        { name: 'All', value: 'All' },
        { name: 'Paid', value: 'Paid' },
        { name: 'Pending', value: 'Pending' },
        { name: 'Draft', value: 'Draft' },
    ]
    const [selectedFilter, selectFilter] = useState('All')
    if (selectedFilter !== 'All') invoices = allInvoices.filter(element => element.status === selectedFilter)

    // Invoice Form
    const [invoiceForm, showInvoiceForm] = useState(false)

    /*=============================
    Effects & actions
    =============================*/
    useEffect(() => {
        // Listen to the screen size
        window.addEventListener('resize', () =>
            setDesktopView(window.matchMedia('(min-width: 992px)').matches ? true : false))

        return () => {
            window.removeEventListener('resize', () =>
                setDesktopView(window.matchMedia('(min-width: 992px)').matches ? true : false))
        }
    }, [desktopView])


    /*=============================
    DOM
    ==============================*/
    return (
        <React.Fragment>
            <div id="home" className="container-fluid">
                {/* The header */}
                <Stack direction="horizontal" gap={3} className="my-4">
                    <div>
                        <h2>Invoices</h2>

                        {desktopView ?
                            <p className="sec-color">There are {invoices.length} total {invoices.length > 1 ? "invoicies" : "invoice"}</p>
                            :
                            <p className="sec-color">{invoices.length} {invoices.length > 1 ? "invoicies" : "invoice"}</p>
                        }

                    </div>

                    {/* The filter button */}
                    <Dropdown>
                        <Dropdown.Toggle variant="" className={`fw-bold ${theme === "night" ? "text-white" : ""} `}>
                            {desktopView ? "Filter by status" : "Filter"} <img src={DropdownArrow} alt="arrow icon" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className={theme === 'night' ? 'dropdown-night' : ''}>
                            <ButtonGroup>
                                {dropDownRadio.map((radio, index) => (
                                    <ToggleButton
                                        key={index}
                                        id={`radio-${index}`}
                                        type="radio"
                                        variant=""
                                        name="radio"
                                        value={radio.name}
                                        style={selectedFilter === radio.value ?
                                            theme === 'day' ?
                                                { backgroundColor: 'rgb(124, 93, 250)', color: '#fff' }
                                                : { color: 'initial', backgroundColor: '#fff' }
                                            : {}}
                                        checked={selectedFilter === radio.value}
                                        onChange={() => selectFilter(radio.value)}
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Dropdown.Menu>
                    </Dropdown>


                    <Button variant="" className="purple-btn fw-bold" onClick={() => showInvoiceForm(true)}>
                        <img src={IconPlus} alt="add icon" className="rounded-circle" /> New {desktopView ? "Invoice" : ""}
                    </Button>
                </Stack>

                {/* The invoices */}
                <div id="invoices">
                    {invoices.length === 0 ?
                        (<div>No invoices for the selected filter</div>)
                        :
                        invoices.map((invoice, index) => (
                            <div key={index} className={`${theme === 'night' ? "horizontal-div-night" : ""} horizontal-div align-items-center mb-3`}
                                onClick={() => navigateTo(`./invoice/${invoice.id}`)}>

                                <h6 style={{ order: 1 }} className="mb-0"><span className="sec-color">#</span>{invoice.id}</h6>
                                <div className="sec-color" style={{ order: desktopView ? 2 : 3 }}>
                                    Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>

                                <div className={`${!desktopView ? "ms-auto" : ""} sec-color`} style={{ order: desktopView ? 3 : 2 }}>{invoice.clientName}</div>

                                <h5 style={{ order: desktopView ? 4 : 5 }} className="mb-0">£{invoice.total.toLocaleString('es-US', { minimumFractionDigits: 2 })}</h5>

                                <Status status={invoice.status} theme={theme} />

                                {desktopView && <div style={{ order: 6 }}><img src={IconArrowRight} alt="Right Arrow" /></div>}

                            </div>
                        ))}
                </div>

                {/* Invoice Form */}
                {invoiceForm && <InvoiceForm type="creation" theme={theme} desktopView={desktopView} showInvoiceForm={showInvoiceForm} />}
            </div>
        </React.Fragment >
    )
}
