import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface invoicesData {
  id: string,
  createdAt: string,
  paymentDue: string,
  description: string,
  paymentTerms: number,
  clientName: string,
  clientEmail: string,
  status: string,
  senderAddress: {
    "street": string,
    "city": string,
    "postCode": string,
    "country": string
  },
  "clientAddress": {
    "street": string,
    "city": string,
    "postCode": string,
    "country": string
  },
  "items":
  {
    "name": string,
    "quantity": number,
    "price": number,
    "total": number
  }[],
  "total": number
}

// Store Interface & Initialization
export interface InvoiceStore {
  themeDay: string;
  invoices: Array<invoicesData>
}

const initialState: InvoiceStore = {
  themeDay: localStorage.getItem('theme')!,
  invoices: [
    {
      id: "RT3080",
      "createdAt": "2021-08-18",
      "paymentDue": "2021-08-19",
      "description": "Re-branding",
      "paymentTerms": 1,
      "clientName": "Jensen Huang",
      "clientEmail": "jensenh@mail.com",
      "status": "Paid",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "106 Kendell Street",
        "city": "Sharrington",
        "postCode": "NR24 5WQ",
        "country": "United Kingdom"
      },
      "items": [
        {
          "name": "Brand Guidelines",
          "quantity": 1,
          "price": 1800.90,
          "total": 1800.90
        }
      ],
      "total": 1800.90
    },
    {
      "id": "XM9141",
      "createdAt": "2021-08-21",
      "paymentDue": "2021-09-20",
      "description": "Graphic Design",
      "paymentTerms": 30,
      "clientName": "Alex Grim",
      "clientEmail": "alexgrim@mail.com",
      "status": "Pending",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "84 Church Way",
        "city": "Bradford",
        "postCode": "BD1 9PB",
        "country": "United Kingdom"
      },
      "items": [
        {
          "name": "Banner Design",
          "quantity": 1,
          "price": 156.00,
          "total": 156.00
        },
        {
          "name": "Email Design",
          "quantity": 2,
          "price": 200.00,
          "total": 400.00
        }
      ],
      "total": 556.00
    },
    {
      "id": "RG0314",
      "createdAt": "2021-09-24",
      "paymentDue": "2021-10-01",
      "description": "Website Redesign",
      "paymentTerms": 7,
      "clientName": "John Morrison",
      "clientEmail": "jm@myco.com",
      "status": "Paid",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "79 Dover Road",
        "city": "Westhall",
        "postCode": "IP19 3PF",
        "country": "United Kingdom"
      },
      "items": [
        {
          "name": "Website Redesign",
          "quantity": 1,
          "price": 14002.33,
          "total": 14002.33
        }
      ],
      "total": 14002.33
    },
    {
      "id": "RT2080",
      "createdAt": "2021-10-11",
      "paymentDue": "2021-10-12",
      "description": "Logo Concept",
      "paymentTerms": 1,
      "clientName": "Alyssa Werner",
      "clientEmail": "alyssa@email.co.uk",
      "status": "Pending",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "63 Warwick Road",
        "city": "Carlisle",
        "postCode": "CA20 2TG",
        "country": "United Kingdom"
      },
      "items": [
        {
          "name": "Logo Sketches",
          "quantity": 1,
          "price": 102.04,
          "total": 102.04
        }
      ],
      "total": 102.04
    },
    {
      "id": "AA1449",
      "createdAt": "2021-10-7",
      "paymentDue": "2021-10-14",
      "description": "Re-branding",
      "paymentTerms": 7,
      "clientName": "Mellisa Clarke",
      "clientEmail": "mellisa.clarke@example.com",
      "status": "Pending",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "46 Abbey Row",
        "city": "Cambridge",
        "postCode": "CB5 6EG",
        "country": "United Kingdom"
      },
      "items": [
        {
          "name": "New Logo",
          "quantity": 1,
          "price": 1532.33,
          "total": 1532.33
        },
        {
          "name": "Brand Guidelines",
          "quantity": 1,
          "price": 2500.00,
          "total": 2500.00
        }
      ],
      "total": 4032.33
    },
    {
      "id": "TY9141",
      "createdAt": "2021-10-01",
      "paymentDue": "2021-10-31",
      "description": "Landing Page Design",
      "paymentTerms": 30,
      "clientName": "Thomas Wayne",
      "clientEmail": "thomas@dc.com",
      "status": "Pending",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "3964  Queens Lane",
        "city": "Gotham",
        "postCode": "60457",
        "country": "United States of America"
      },
      "items": [
        {
          "name": "Web Design",
          "quantity": 1,
          "price": 6155.91,
          "total": 6155.91
        }
      ],
      "total": 6155.91
    },
    {
      "id": "FV2353",
      "createdAt": "2021-11-05",
      "paymentDue": "2021-11-12",
      "description": "Logo Re-design",
      "paymentTerms": 7,
      "clientName": "Anita Wainwright",
      "clientEmail": "",
      "status": "Draft",
      "senderAddress": {
        "street": "19 Union Terrace",
        "city": "London",
        "postCode": "E1 3EZ",
        "country": "United Kingdom"
      },
      "clientAddress": {
        "street": "",
        "city": "",
        "postCode": "",
        "country": ""
      },
      "items": [
        {
          "name": "Logo Re-design",
          "quantity": 1,
          "price": 3102.04,
          "total": 3102.04
        }
      ],
      "total": 3102.04
    }
  ]
};

// Actions
export const invoiceSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    toggleTheme: store => {
      if (localStorage.getItem('theme') === 'day') {
        localStorage.setItem('theme', 'night')
        return {
          ...store,
          themeDay: "night"
        }
      } else {
        localStorage.setItem('theme', 'day')
        return {
          ...store,
          themeDay: "day"
        }
      }
    },
    addInvoice: (store, item: PayloadAction<invoicesData>) => {
      localStorage.setItem('invoices', JSON.stringify([...store.invoices, item.payload]))
      return {
        ...store,
        invoices: [...store.invoices, item.payload]
      }
    },
    editInvoice: (store, item: PayloadAction<invoicesData>) => {
      localStorage.setItem('invoices', JSON.stringify([...store.invoices, item.payload]))
      let updatedInvoices = store.invoices.map(invoice => invoice.id === item.payload.id ? item.payload : invoice)

      return {
        ...store,
        invoices: [...updatedInvoices]
      }
    },
    getInvoicesFromLocal: store => {
      return {
        ...store,
        invoices: JSON.parse(localStorage.getItem('invoices')!)
      }
    }
  }
});

export const { toggleTheme, addInvoice, editInvoice, getInvoicesFromLocal } = invoiceSlice.actions;

export default invoiceSlice.reducer;
