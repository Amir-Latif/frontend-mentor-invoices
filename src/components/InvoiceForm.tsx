import { useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Trash } from "..";
import { useAppDispatch } from "../store/hooks";
import { addInvoice, editInvoice, invoiceData } from "../store/invoiceSlice";
import { motion } from 'framer-motion'

import './invoiceform.css'

export default function InvoiceForm({ type, theme, desktopView, showInvoiceForm, invoice }:
    { type: string, theme: string, desktopView: boolean, showInvoiceForm: React.Dispatch<React.SetStateAction<boolean>>, invoice?: invoiceData }) {

    const [itemListCount, setItemListCount] = useState(invoice ? invoice.items.length : 0)
    const [skippedItems, addSkippedItems] = useState<number[]>([])
    const [invoiceItems, setInvoiceItems] = useState<{
        "name": string,
        "quantity": number,
        "price": number,
        "total": number
    }[]>(invoice ? invoice.items : [])
    const dispatch = useAppDispatch()

    // Copy form data to the store
    const copyFormData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, status: string) => {
        e.preventDefault()
        showInvoiceForm(false)

        // Validating all necessary data are filled
        if (status === "Pending") {
            let alertItems = false
            let alertData = false
            let inputs = document.querySelectorAll('input')!
            inputs.forEach(e => {
                if (e.value === "") {
                    e.style.border = 'solid red'
                    alertData = true
                    showInvoiceForm(true)
                }
                else e.style.border = 'none'
            })
            if (itemListCount === 0) alertItems = true
            if (alertItems && alertData) alert('Kindly fill all the data and provide the needed items')
            else if (alertItems && !alertData) alert('Kindly provide the needed items')
            else if (alertData && !alertItems) alert('Kindly fill all the data')

        }

        // ** Send the data to the store **
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
        }[] = invoice ? invoice.items : []

        Array.from(Array(itemListCount)).forEach((element, index) => {
            let sum = parseInt(form.get(`item-${index}-qty`)! as string) * parseInt(form.get(`item-${index}-price`)! as string)
            items = [...items,
            {
                name: form.get(`item-${index}-name`)! as string,
                quantity: parseInt(form.get(`item-${index}-quantity`)! as string),
                price: parseInt(form.get(`item-${index}-price`)! as string),
                total: sum ? sum : 0
            }
            ]
            console.log(sum);

        })

        // Create the invoice object
        const formInvoice: invoiceData = {
            id: invoice ? invoice!.id : `${generateRandomString(2).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
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
        invoice ? dispatch(editInvoice(formInvoice)) : dispatch(addInvoice(formInvoice))
    }


    /*======
    DOM
    =======*/
    return (
        <motion.main key="invoiceForm" id="invoice-form" className="p-4"
            initial={{ x: -800 }}
            animate={{ x: 0, transition: { duration: 0.5 } }}
            exit={{ x: -800, transition: { duration: 0.5 } }}
        >
            <h2>{type === 'creation' ? "Create Invoice" : (<span>Edit <span className="sec-color">#</span>{invoice!.id}</span>)}</h2>
            <Form onSubmit={e => e.preventDefault()}>
                <h6>Bill From</h6>

                <Form.Group controlId="streetAddress" className="mb-3">
                    <Form.Label className="sec-color">Street Address</Form.Label>
                    <Form.Control type="text" name="sender-street-address" defaultValue={type === "editing" ? invoice!.senderAddress.street : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                </Form.Group>

                <Row className="mb-3 flex-wrap">
                    <Form.Group as={Col} controlId="senderCity" className="mb-3">
                        <Form.Label className="sec-color">City</Form.Label>
                        <Form.Control type="text" name="sender-city" defaultValue={type === "editing" ? invoice!.senderAddress.city : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="senderPostCode" className="mb-3">
                        <Form.Label className="sec-color">Post Code</Form.Label>
                        <Form.Control type="text" name="sender-post-code" defaultValue={type === "editing" ? invoice!.senderAddress.postCode : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="senderCountry" className="mb-3">
                        <Form.Label className="sec-color">Country</Form.Label>
                        <Form.Control type="text" name="sender-country" defaultValue={type === "editing" ? invoice!.senderAddress.country : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                </Row>

                <h6>Bill To</h6>
                <Form.Group controlId="receipentName" className="mb-3">
                    <Form.Label className="sec-color">Client Name</Form.Label>
                    <Form.Control type="text" name="recepient-name" defaultValue={type === "editing" ? invoice!.clientName : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                </Form.Group>
                <Form.Group controlId="recepientEmail" className="mb-3">
                    <Form.Label className="sec-color">Client Email</Form.Label>
                    <Form.Control type="email" name="recepient-email" defaultValue={type === "editing" ? invoice!.clientEmail : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                </Form.Group>
                <Form.Group controlId="recepientAddress" className="mb-3">
                    <Form.Label className="sec-color">Street Address</Form.Label>
                    <Form.Control type="text" name="recepient-street" defaultValue={type === "editing" ? invoice!.clientAddress.street : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="recepientCity" className="mb-3">
                        <Form.Label className="sec-color">City</Form.Label>
                        <Form.Control type="text" name="recepient-city" defaultValue={type === "editing" ? invoice!.clientAddress.city : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="recepientPostCode" className="mb-3">
                        <Form.Label className="sec-color">Post Code</Form.Label>
                        <Form.Control type="text" name="recepient-post-code" defaultValue={type === "editing" ? invoice!.clientAddress.postCode : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="recepientCountry" className="mb-3">
                        <Form.Label className="sec-color">Country</Form.Label>
                        <Form.Control type="text" name="recepient-country" defaultValue={type === "editing" ? invoice!.clientAddress.country : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="invoiceDate" className="mb-3">
                        <Form.Label className="sec-color">Invoice Date</Form.Label>
                        <Form.Control type="date" name="invoice-date" defaultValue={type === "editing" ? invoice!.createdAt : undefined} placeholder={new Date().toLocaleDateString()} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="paymentTerms" className="mb-3">
                        <Form.Label className="sec-color">Payment Terms</Form.Label>
                        <Form.Select name="payment-terms" className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}>
                            <option value="1">Net 1 day</option>
                            <option value="7">Net 7 days</option>
                            <option value="14">Net 14 days</option>
                            <option value="30">Net 30 days</option>
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Form.Group controlId="description" className="mb-3">
                    <Form.Label className="sec-color">Description</Form.Label>
                    <Form.Control name="description" defaultValue={type === "editing" ? invoice!.description : undefined} placeholder="e.g. Graphic Design Service" className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`} />
                </Form.Group>

                <h6>Item List</h6>

                {[...Array(itemListCount)].map((element, index) => !skippedItems.includes(index) && (
                    <Row key={index} className="align-items-center">
                        <Form.Group as={Col} controlId={`item-${index}-name`} className={`item ${!desktopView && 'flex-fill'}`}>
                            <Form.Label className="sec-color">Item Name</Form.Label>
                            <Form.Control type="text" name={`item-${index}-name`} defaultValue={(type === "editing" && invoice!.items.length > 0) ? invoice!.items[index].name : undefined} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                                onBlur={e => e.target.value !== "" && setInvoiceItems({ ...invoiceItems, [index]: { name: e.target.value, quantity: 0, price: 0, get total() { return this.quantity * this.price } } })
                                } />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`item-${index}-qty`} className="qty">
                            <Form.Label className="sec-color">Qty.</Form.Label>
                            <Form.Control type="number" min="0" name={`item-${index}-qty`} defaultValue={(type === "editing" && invoice!.items.length > 0) ? invoice!.items[index].quantity : 0} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                                onBlur={e => e.target.value !== "" && setInvoiceItems({ ...invoiceItems, [index]: { ...invoiceItems[index], quantity: parseInt(e.target.value) } })} />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`item-${index}-price`} className="price">
                            <Form.Label className="sec-color">Price</Form.Label>
                            <Form.Control type="number" min="0" name={`item-${index}-price`} defaultValue={(type === "editing" && invoice!.items.length > 0) ? invoice!.items[index].price : 0} className={` ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                                onBlur={e => e.target.value !== "" && setInvoiceItems({ ...invoiceItems, [index]: { ...invoiceItems[index], price: parseInt(e.target.value) } })} />
                        </Form.Group>
                        <Col>
                            <Form.Label className="sec-color total">Total</Form.Label>
                            <h4>{(invoiceItems[index] && invoiceItems[index].quantity && invoiceItems[index].price) ? invoiceItems[index].quantity * invoiceItems[index].price : 0}</h4>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-end pt-4">
                            <Trash onClick={() => addSkippedItems([...skippedItems, index])} />
                        </Col>
                    </Row>
                )
                )}

                <button className={`rounded-pill sec-color border-0 fw-bold text-center w-100 my-3 py-2 ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                    onClick={() => setItemListCount(itemListCount + 1)}>+ Add New Item</button>

            </Form>

            <Stack direction="horizontal" gap={3} className="mt-5 mb-3">
                <Button variant="" className={`sec-color rounded-pill py-3 px-4 ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                    onClick={() => showInvoiceForm(false)}>Discard</Button>
                <Button variant="" className={`sec-color ms-auto rounded-pill py-3 px-4 ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                    onClick={e => copyFormData(e, 'Draft')}>Save as Draft</Button>
                <Button variant="" className={`purple-btn sec-color rounded-pill py-3 px-4 ${theme === 'day' ? 'invoice-div' : 'invoice-div-night'}`}
                    onClick={e => copyFormData(e, 'Pending')}>Save & Send</Button>
            </Stack>

        </motion.main>
    )
}