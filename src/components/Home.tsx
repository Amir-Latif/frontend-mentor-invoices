import React, { useEffect, useState } from "react"
import { Button, ButtonGroup, Dropdown, Stack, ToggleButton } from "react-bootstrap"
import { useAppSelector } from "../store/hooks"
import { invoicesData } from "../store/invoiceSlice"
import { RootState } from "../store/store"
import "./home.css"

export default function Home() {
    const invoices: invoicesData[] = useAppSelector((store: RootState) => store.invoices)
    const [desktopView, setDesktopView] = useState(window.matchMedia('(min-width: 992px)').matches)
    const theme: string = useAppSelector((store: RootState) => store.themeDay)
    const dropDownRadio = [
        { name: 'All', value: 0 },
        { name: 'Paid', value: 1 },
        { name: 'Pending', value: 2 },
        { name: 'Draft', value: 3 },
    ]
    const [selectedFilter, selectFilter] = useState(0)

    useEffect(() => {
        window.addEventListener('resize', () =>
            setDesktopView(window.matchMedia('(min-width: 992px)').matches ? true : false))

        return () => {
            window.removeEventListener('resize', () =>
                setDesktopView(window.matchMedia('(min-width: 992px)').matches ? true : false))
        }
    }, [desktopView])

    return (
        <React.Fragment>
            <div id="home" className="container-fluid">
                {/* The header */}
                <Stack direction="horizontal" gap={3} className="mb-4">
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
                            {desktopView ? "Filter by status" : "Filter"} <img src="images/icon-arrow.svg" alt="arrow icon" />
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
                        <img src="images/icon-plus.svg" alt="add icon" className="rounded-circle" /> New {desktopView ? "Invoice" : ""}
                    </Button>
                </Stack>

                {/* The invoices */}
                <div id="invoices">
                    {invoices.map((invoice, index) => (
                        <div key={index} className={`${theme === 'night' ? "invoice-night" : ""} invoice align-items-center mb-3`}>

                            <h6 style={{ order: 1 }} className="mb-0"><span className="sec-color">#</span>{invoice.id}</h6>
                            <div className="sec-color" style={{ order: desktopView ? 2 : 3 }}>
                                Due {new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>

                            <div className={`${!desktopView ? "ms-auto" : ""} sec-color`} style={{ order: desktopView ? 3 : 2 }}>{invoice.clientName}</div>

                            <h5 style={{ order: desktopView ? 4 : 5 }} className="mb-0">£{invoice.total.toLocaleString('es-US', { minimumFractionDigits: 2 })}</h5>
                            <div className={`${invoice.status === 'Paid' ? "paid" : "pending"} ${theme === 'night' ? 'night-status' : ''} status d-flex align-items-center fw-bold`}
                                style={{ order: desktopView ? 5 : 4 }}>
                                <div className="bullet rounded-circle"></div>
                                <div>{invoice.status}</div>
                            </div>

                            {desktopView && <div style={{ order: 6 }}><img src="images/icon-arrow-right.svg" alt="Right Arrow" /></div>}

                        </div>
                    ))}
                </div>

            </div>
        </React.Fragment>
    )
}
