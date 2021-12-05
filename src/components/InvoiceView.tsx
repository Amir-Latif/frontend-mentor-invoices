import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Stack, Table } from 'react-bootstrap'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { IconArrowLeft } from '..'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AppDispatch, RootState } from '../store/store'
import { deleteInvoice, editInvoice, invoiceData } from '../store/invoiceSlice'
import InvoiceForm from "./InvoiceForm"
import Status from './Status'
import './invoiceview.css'

// Edit/Delete Component
function EditDelete({ status, invoice, dispatch, navigateTo, showInvoiceForm }:
    { status: string, invoice: invoiceData, dispatch: AppDispatch, navigateTo: NavigateFunction, showInvoiceForm: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Stack direction="horizontal" id="control-btns" className={`ms-auto`}>
            <Button variant="" id="edit" className="rounded-pill px-3 me-2" onClick={() => showInvoiceForm(true)}>Edit</Button>
            <Button variant="" id="delete" className="rounded-pill px-3 me-2"
                onClick={() => {
                    dispatch(deleteInvoice(invoice.id))
                    navigateTo('/')
                }}>Delete</Button>
            {status !== "Paid" && (
                <Button variant="" id="mark-paid" className="rounded-pill px-3"
                    onClick={() => dispatch(editInvoice({ ...invoice, status: "Paid" }))}>Mark as Paid</Button>
            )}
        </Stack>
    )
}

/*================
Main Component
==================*/
export default function InvoiceView() {
    const { id } = useParams()
    const theme = useAppSelector((store: RootState) => store.themeDay)
    const invoice = useAppSelector((store: RootState) => store.invoices.filter(invoice => invoice.id === id))[0]
    const dispatch = useAppDispatch()
    const [desktopView, setDesktopView] = useState(window.matchMedia('(min-width: 992px)').matches)
    const navigateTo = useNavigate()

    // Invoice Form
    const [invoiceForm, showInvoiceForm] = useState(false)

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
            <main id="invoice-view" className="container-fluid">
                <Stack direction="horizontal" id="go-back-btn" onClick={() => navigateTo('/')} >
                    <img src={IconArrowLeft} alt="go-back arrow" className="me-4" />
                    Go back
                </Stack>

                <Stack direction="horizontal"
                    className={`horizontal-div ${theme === 'night' ? 'horizontal-div-night' : ""} ${!desktopView && 'justify-content-between'} my-4`}>
                    <div>Status</div>

                    <Status status={invoice.status} theme={theme} className={desktopView ? 'ms-3' : ''} />

                    {desktopView && (
                        <EditDelete status={invoice.status} invoice={invoice} dispatch={dispatch} navigateTo={navigateTo} showInvoiceForm={showInvoiceForm} />
                    )}
                </Stack>

                <section className={`horizontal-div ${theme === 'night' ? 'horizontal-div-night' : ""} mb-3`}>

                    <Stack direction={desktopView ? "horizontal" : "vertical"} gap={desktopView ? undefined : 4}
                        className={`${desktopView ? 'justify-content-between align-items-start' : ''} `}>
                        <div>
                            <h6 className="mb-0"><span className="sec-color">#</span>{invoice.id}</h6>
                            <small>{invoice.description}</small>
                        </div>

                        <Stack id="sender-address">
                            <small>{invoice.senderAddress.street}</small>
                            <small>{invoice.senderAddress.city}</small>
                            <small>{invoice.senderAddress.postCode}</small>
                            <small>{invoice.senderAddress.country}</small>
                        </Stack>
                    </Stack>

                    <Container fluid className="mt-4 p-0">
                        <Row>
                            <Col xs={desktopView ? 4 : 6} className={desktopView ? '' : 'mb-4'}>
                                <small>Invoice Date</small>
                                <h6 className="mb-5">{new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h6>

                                <small>Payment Due</small>
                                <h6>{new Date(invoice.paymentDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h6>
                            </Col>

                            <Col xs={desktopView ? 5 : 6} className="d-flex flex-column">
                                <small className="mb-2">Bill To</small>
                                <h6>{invoice.clientName}</h6>
                                <small>{invoice.clientAddress.street}</small>
                                <small>{invoice.clientAddress.city}</small>
                                <small>{invoice.clientAddress.postCode}</small>
                                <small>{invoice.clientAddress.country}</small>
                            </Col>

                            <Col className={desktopView ? "" : "mt-2"}>
                                <small>Sent To</small>
                                <h6>{invoice.clientEmail}</h6>
                            </Col>
                        </Row>
                    </Container>

                    <div className="mt-5">
                        <Table borderless className={`${theme === 'night' ? "table-night" : ''} rounded p - 3 mb - 0`}>
                            {desktopView && (
                                <thead>
                                    <tr>
                                        <td className="col-3 text-start">Item Name</td>
                                        <td className="col-3 text-center">QTY.</td>
                                        <td className="col-3 text-center">Price</td>
                                        <td className="col-3 text-end">Total</td>
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="col-3 text-start">{item.name}</td>
                                        {desktopView && (
                                            <>
                                                <td className="col-3 text-center">{item.quantity}</td>
                                                <td className="col-3 text-center">£{item.price}</td>
                                            </>
                                        )}
                                        <td className="col-3 text-end">£{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Stack direction="horizontal" gap={2}
                            className="justify-content-between p-4 price">
                            <div>Amount Due</div>
                            <h6>£{invoice.total}</h6>
                        </Stack>
                    </div>

                </section>

                {!desktopView && (
                    <div className={`${theme === 'night' ? 'horizontal-div-night' : 'desktop-btns'} rounded p-4`}>
                        <EditDelete status={invoice.status} invoice={invoice} dispatch={dispatch} navigateTo={navigateTo} showInvoiceForm={showInvoiceForm} />
                    </div>
                )}

                {/* Invoice Form */}
                {invoiceForm && <InvoiceForm type="editing" theme={theme} desktopView={desktopView} showInvoiceForm={showInvoiceForm} invoice={invoice} />}

            </main>
        </React.Fragment>
    )
}