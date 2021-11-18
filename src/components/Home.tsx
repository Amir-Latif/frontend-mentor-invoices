import React, { useEffect, useState } from "react"
import { Button, ButtonGroup, Dropdown, Stack, ToggleButton } from "react-bootstrap"
import { useNavigate } from "react-router"
import { DropdownArrow, IconArrowRight, IconPlus } from ".."
import { useAppSelector } from "../store/hooks"
import { invoicesData } from "../store/invoiceSlice"
import { RootState } from "../store/store"
import Status from "./Status"
import "./home.css"

export default function Home() {
    // Variables & Hooks
    const [desktopView, setDesktopView] = useState(window.matchMedia('(min-width: 992px)').matches)
    const theme: string = useAppSelector((store: RootState) => store.themeDay)

    const dropDownRadio = [
        { name: 'All', value: 'All' },
        { name: 'Paid', value: 'Paid' },
        { name: 'Pending', value: 'Pending' },
        { name: 'Draft', value: 'Draft' },
    ]
    const [selectedFilter, selectFilter] = useState('All')
    const allInvoices: invoicesData[] = useAppSelector((store: RootState) => store.invoices)
    let invoices: invoicesData[] = allInvoices;
    if (selectedFilter !== 'All') invoices = allInvoices.filter(element => element.status === selectedFilter)

    const navigateTo = useNavigate()


    // Effects & actions
    useEffect(() => {
        window.addEventListener('resize', () =>
            setDesktopView(window.matchMedia('(min-width: 992px)').matches ? true : false))

        return () => {
            window.removeEventListener('resize', () =>
                setDesktopView(window.matchMedia('(min-width: 992px)').matches ? true : false))
        }
    }, [desktopView])


    // Return
    return (
        <React.Fragment>
            <div id="home" className="container-fluid">
                {/* The header */}
                <Stack direction="horizontal" gap={3} className="my-4">
                    <div>
                        <h2>Invoices</h2>

                        {desktopView ?
                            <p className="sec-color">There are {invoices.length} total {invoices.length > 1 ? "invoies" : "invoice"}</p>
                            :
                            <p className="sec-color">{invoices.length} {invoices.length > 1 ? "invoies" : "invoice"}</p>
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


                    <Button variant="" id="btn-plus" className="fw-bold">
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

            </div>
        </React.Fragment>
    )
}
