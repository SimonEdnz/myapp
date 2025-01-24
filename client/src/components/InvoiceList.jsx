import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    description: '',
    amount: '',
    date: '',
    created_by: 1, // Example user ID
  });

  useEffect(() => {
    axios.get('http://localhost:5000/invoices') // Update with actual endpoint
      .then(response => setInvoices(response.data))
      .catch(error => console.error('Error fetching invoices:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const handleCreateInvoice = () => {
    axios.post('http://localhost:5000/invoices', newInvoice)
      .then(() => {
        alert('Invoice created successfully!');
        setInvoices([...invoices, newInvoice]);
      })
      .catch(error => console.error('Error creating invoice:', error));
  };

  return (
    <div>
      <h1>Invoice List</h1>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice.invoice_id}>{invoice.description} - {invoice.amount}</li>
        ))}
      </ul>
      <h2>Create New Invoice</h2>
      <input
        type="text"
        name="description"
        value={newInvoice.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="amount"
        value={newInvoice.amount}
        onChange={handleInputChange}
        placeholder="Amount"
      />
      <input
        type="date"
        name="date"
        value={newInvoice.date}
        onChange={handleInputChange}
        placeholder="Date"
      />
      <button onClick={handleCreateInvoice}>Create Invoice</button>
    </div>
  );
}

export default InvoiceList;