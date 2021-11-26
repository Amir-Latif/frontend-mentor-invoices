import React, { useEffect, useState } from "react"
import { Button, ButtonGroup, Col, Dropdown, Form, Row, Stack, ToggleButton } from "react-bootstrap"
import { useNavigate } from "react-router"
import { DropdownArrow, IconArrowRight, IconPlus, Trash } from ".."
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { addInvoice, invoicesData } from "../store/invoiceSlice"
import Status from "./Status"
import "./home.css"

export default function Home() {
    /*=============================
       Vaiables & Hooks
       ==============================*/
    const [desktopView, setDesktopView] = useState(window.matchMedia('(min-width: 992px)').matches)
    const theme: string = useAppSelector(store => store.themeDay)
    const dispatch = useAppDispatch()
    const navigateTo = useNavigate()

    // Invoices
    const allInvoices: invoicesData[] = useAppSelector(store => store.invoices)
    let invoices: invoicesData[] = allInvoices;
    // Invoice filter
    const dropDownRadio = [
        { name: 'All', value: 'All' },
        { name: 'Paid', value: 'Paid' },
        { name: 'Pending', value: 'Pending' },
        { name: 'Draft', value: 'Draft' },
    ]
    const [selectedFilter, selectFilter] = useState('All')
    if (selectedFilter !== 'All') invoices = allInvoices.filter(element => element.status === selectedFilter)

    // Creation Modal
    const [creationModal, showCreationModal] = useState(false)
    const [itemListCount, setItemListCount] = useState(0)
    const [invoiceItems, setInvoiceItems] = useState<{ [i: string]: { [q: string]: number } }>({})

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

    // Copy form data to the store
    const copyFormData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, status: string) => {
        e.preventDefault()
        showCreationModal(false)

        // Form Validity
        if (status === "Pending") {
            let alertItems = false
            let alertData = false
            let inputs = document.querySelectorAll('input')!
            inputs.forEach(e => {
                if (e.value === "") {
                    e.style.border = 'solid red'
                    alertData = true
                    showCreationModal(true)
                }
                else e.style.border = 'none'
            })
            if(itemListCount === 0) alertItems = true
            if(alertItems && alertData) alert('Kindly fill all the data and provide the needed items')
            else if(alertItems && !alertData) alert('Kindly provide the needed items')
            else if(alertData && !alertItems) alert('Kindly fill all the data')

        }

        // Send the data to the store
             const f = document.querySelector('form')!
        const form = new FormData(f)

        // Get a random string for the ID
        const generateRandomString = (length: number) => {
            const alphabet = "abcdefghijklmnopqrstuvwxyz"
            let randomString = ""
            for (let i = 0; i < length; i++) {
                randomString += alphabet[Math.floor(Math.random() * 10)]
            }

            return randomString
        }

        // Calculate paymentDue
        let invoiceDate = form.get('invoice-date')!.toString()
        const paymentTerms = form.get('payment-terms')!.toString()
        let paymentDue = ""
        if (invoiceDate && paymentTerms) {
            const creationDate = new Date(invoiceDate!).getTime()
            switch (parseInt(paymentTerms)) {
                case 1:
                    paymentDue = new Date(creationDate + (1 * 24 * 60 * 60 * 1000)).toLocaleString()
                    break;
                case 7:
                    paymentDue = new Date(creationDate + (7 * 24 * 60 * 60 * 1000)).toLocaleString()
                    break;
                case 14:
                    paymentDue = new Date(creationDate + (14 * 24 * 60 * 60 * 1000)).toLocaleString()
                    break;
                case 30:
                    paymentDue = new Date(creationDate + (30 * 24 * 60 * 60 * 1000)).toLocaleString()
                    break;
                default:
                    break;
            }
        }

        // Get the items
        let items: {
            "name": string,
            "quantity": number,
            "price": number,
            "total": number
        }[] = []
        const arr: number[] = [...Array(itemListCount)]
        arr.forEach((element, index) => items.push(
            {
                name: form.get(`item-${index}-name`)!.toString(),
                quantity: parseInt(form.get(`item-${index}-quantity`)!.toString()),
                price: parseInt(form.get(`item-${index}-price`)!.toString()),
                total: parseInt(form.get(`item-${index}-qty`)!.toString()) * parseInt(form.get(`item-${index}-price`)!.toString())
            }
        ))

        // Create the invoice object
        const invoice: invoicesData = {
            id: `${generateRandomString(2).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
            createdAt: form.get('invoice-date')!.toString(),
            paymentDue: paymentDue,
            description: form.get('description')!.toString(),
            paymentTerms: form.get('payment-terms') !== "" ? parseInt(paymentTerms!) : 0,
            clientName: form.get('recepient-name')!.toString(),
            clientEmail: form.get('recepient-email')!.toString(),
            status: status,
            senderAddress: {
                street: form.get('sender-street-address')!.toString(),
                city: form.get('sender-city')!.toString(),
                postCode: form.get('sender-post-code')!.toString(),
                country: form.get('sender-country')!.toString()
            },
            clientAddress: {
                street: form.get('recepient-street')!.toString(),
                city: form.get('recepient-city')!.toString(),
                postCode: form.get('recepient-post-code')!.toString(),
                country: form.get('recepient-country')!.toString()
            },

            items: items,
            total: 0
        }

        // Finalize
        dispatch(addInvoice(invoice))
    }


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


                    <Button variant="" className="purple-btn fw-bold" onClick={() => showCreationModal(true)}>
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

                {/* ============  Creation Modal ================ */}
                {creationModal && (


                    <div id="creation-modal" className={creationModal ? "creation-show" : "creation-hide"}>
                        <h2>Create Invoice</h2>
                        <Form onSubmit={e => e.preventDefault()}>
                            <h6>Bill From</h6>

                            <Form.Group controlId="streetAddress" className="mb-3">
                                <Form.Label className="sec-color">Street Address</Form.Label>
                                <Form.Control type="text" name="sender-street-address" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                            </Form.Group>

                            <Row className="mb-3 flex-wrap">
                                <Form.Group as={Col} controlId="senderCity" className="mb-3">
                                    <Form.Label className="sec-color">City</Form.Label>
                                    <Form.Control type="text" name="sender-city" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="senderPostCode" className="mb-3">
                                    <Form.Label className="sec-color">Post Code</Form.Label>
                                    <Form.Control type="text" name="sender-post-code" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="senderCountry" className="mb-3">
                                    <Form.Label className="sec-color">Country</Form.Label>
                                    <Form.Control type="text" name="sender-country" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                            </Row>

                            <h6>Bill To</h6>
                            <Form.Group controlId="receipentName" className="mb-3">
                                <Form.Label className="sec-color">Client Name</Form.Label>
                                <Form.Control type="text" name="recepient-name" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                            </Form.Group>
                            <Form.Group controlId="recepientEmail" className="mb-3">
                                <Form.Label className="sec-color">Client Email</Form.Label>
                                <Form.Control type="email" name="recepient-email" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                            </Form.Group>
                            <Form.Group controlId="recepientAddress" className="mb-3">
                                <Form.Label className="sec-color">Street Address</Form.Label>
                                <Form.Control type="text" name="recepient-street" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                            </Form.Group>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="recepientCity" className="mb-3">
                                    <Form.Label className="sec-color">City</Form.Label>
                                    <Form.Control type="text" name="recepient-city" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="recepientPostCode" className="mb-3">
                                    <Form.Label className="sec-color">Post Code</Form.Label>
                                    <Form.Control type="text" name="recepient-post-code" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="recepientCountry" className="mb-3">
                                    <Form.Label className="sec-color">Country</Form.Label>
                                    <Form.Control type="text" name="recepient-country" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="invoiceDate" className="mb-3">
                                    <Form.Label className="sec-color">Invoice Date</Form.Label>
                                    <Form.Control type="date" name="invoice-date" placeholder={new Date().toLocaleDateString()} className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="paymentTerms" className="mb-3">
                                    <Form.Label className="sec-color">Payment Terms</Form.Label>
                                    <Form.Select name="payment-terms" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}>
                                        <option value="1">Net 1 day</option>
                                        <option value="7">Net 7 days</option>
                                        <option value="14">Net 14 days</option>
                                        <option value="30">Net 30 days</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label className="sec-color">Description</Form.Label>
                                <Form.Control name="description" placeholder="e.g. Graphic Design Service" className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`} />
                            </Form.Group>

                            <h6>Item List</h6>

                            {[...Array(itemListCount)].map((element, index) => (
                                <Row key={index} className="align-items-center">
                                    <Form.Group as={Col} controlId={`item-${index}-name`} className={`item ${!desktopView && 'flex-fill'}`}>
                                        <Form.Label className="sec-color">Item Name</Form.Label>
                                        <Form.Control type="text" name={`item-${index}-name`} className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                                            onBlur={e => setInvoiceItems({ ...invoiceItems, [index]: { item: e.target.value, qty: 0, price: 0 } })} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId={`item-${index}-qty`} className="qty">
                                        <Form.Label className="sec-color">Qty.</Form.Label>
                                        <Form.Control type="number" name={`item-${index}-qty`} className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                                            onBlur={e => setInvoiceItems({ ...invoiceItems, [index]: { ...invoiceItems[index], qty: parseInt(e.target.value) } })} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId={`item-${index}-price`} className="price">
                                        <Form.Label className="sec-color">Price</Form.Label>
                                        <Form.Control type="number" name={`item-${index}-price`} className={` ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                                            onBlur={e => setInvoiceItems({ ...invoiceItems, [index]: { ...invoiceItems[index], price: parseInt(e.target.value) } })} />
                                    </Form.Group>
                                    <Col>
                                        <Form.Label className="sec-color total">Total</Form.Label>
                                        <h4>{invoiceItems[index] ? invoiceItems[index].qty * invoiceItems[index].price : 0}</h4>
                                    </Col>
                                    <Col className="d-flex align-items-center justify-content-end">
                                        <img src={Trash} alt="Trash" className="pt-4" />
                                    </Col>
                                </Row>
                            )
                            )}

                            <button className={`rounded-pill sec-color border-0 fw-bold text-center w-100 my-3 py-2 ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                            onClick={() => setItemListCount(itemListCount + 1)}>+ Add New Item</button>

                        </Form>

                        <Stack direction="horizontal" gap={3} className="mt-5 mb-3">
                            <Button variant="" className={`sec-color rounded-pill py-3 px-4 ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                                onClick={() => showCreationModal(false)}>Discard</Button>
                            <Button variant="" className={`sec-color ms-auto rounded-pill py-3 px-4 ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                                onClick={e => copyFormData(e, 'Draft')}>Save as Draft</Button>
                            <Button variant="" className={`purple-btn sec-color rounded-pill py-3 px-4 ${theme === 'day' ? 'creation-div' : 'creation-div-night'}`}
                                onClick={e => copyFormData(e, 'Pending')}>Save & Send</Button>
                        </Stack>
                    </div>
                )}
            </div>
        </React.Fragment >
    )
}
