import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Invoice.css';

const Invoice = () => {
  const [invoiceDetails, setInvoiceDetails] = useState({
    recipient: '',
    email: '',
    subject: '',
    dueDate: '',
    currency: 'INR',
    items: [
      {
        description: '',
        quantity: '',
        price: '',
        tax: '',
      },
    ],
    discount: 0,
  });

  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...invoiceDetails.items];
    items[index][name] = value;
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      items,
    }));
  };

  const addItem = () => {
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      items: [
        ...prevDetails.items,
        {
          description: '',
          quantity: '',
          price: '',
          tax: '',
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const items = [...invoiceDetails.items];
    items.splice(index, 1);
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      items,
    }));
  };

  const calculateTotal = () => {
    const subtotal = invoiceDetails.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    const totalTax = invoiceDetails.items.reduce(
      (acc, item) => acc + (item.quantity * item.price * item.tax) / 100,
      0
    );
    const discountAmount = (subtotal * invoiceDetails.discount) / 100;
    const totalDiscount = discountAmount + couponDiscount;
    return {
      subtotal,
      totalTax,
      discountAmount,
      totalDiscount,
      total: subtotal + totalTax - totalDiscount,
    };
  };

  const totals = calculateTotal();

  const handlePDFDownload = () => {
    const input = document.getElementById('preview-container');
    html2canvas(input, { scale: 10 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('invoice.pdf');
      })
      .catch((err) => {
        console.error('Error generating PDF:', err);
      });
  };

  const handleEmail = () => {
    // Add logic for sending email
    alert('Send Email');
  };

  const handlePayment = () => {
    // Add logic for processing payment
    alert('Process Payment');
  };

  const handleApplyCoupon = () => {
    // Add logic to validate and apply the coupon
    if (coupon === 'DISCOUNT100') {
      setCouponDiscount(100);
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="invoice">
      <div className="invoice-container">
        <div className="invoice-details">
          <h2>Create Details</h2>
          <div className="form-group">
            <label><b>Recipient</b></label>
            <input
              type="text"
              name="recipient"
              value={invoiceDetails.recipient}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label><b>Email</b></label>
            <input
              type="email"
              name="email"
              value={invoiceDetails.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label><b>Subject</b></label>
            <input
              type="text"
              name="subject"
              value={invoiceDetails.subject}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label><b>Due Date</b></label>
            <input
              type="date"
              name="dueDate"
              value={invoiceDetails.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label><b>Currency</b></label>
            <select
              name="currency"
              value={invoiceDetails.currency}
              onChange={handleChange}
            >
              <option value="INR">INR - Indian Rupees</option>
              {/* Add more currencies as needed */}
            </select>
          </div>
        </div>
        <div className="products">
          <h2>Products</h2>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="tax"
                      value={item.tax}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td>
                    <button onClick={() => removeItem(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='add-new-line'>
            <button onClick={addItem}>Add New Line</button>
          </div>
          <div className='add-coupon'>
            <input
              type="text"
              name="coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button onClick={handleApplyCoupon}>Apply Coupon</button>
          </div>
        </div>
        <div className="discount">
          <div className="form-group">
            <label>Discount:</label>
            <input
              type="number"
              name="discount"
              value={invoiceDetails.discount}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="totals">
          <p>Subtotal: {totals.subtotal.toFixed(2)} {invoiceDetails.currency}</p>
          <p>Tax: {totals.totalTax.toFixed(2)} {invoiceDetails.currency}</p>
          <p>Discount: {totals.totalDiscount.toFixed(2)} {invoiceDetails.currency}</p>
          <p>Total: {totals.total.toFixed(2)} {invoiceDetails.currency}</p>
        </div>
        <div className="actions">
          <button>Send Invoice</button>
        </div>
      </div>
      <div className="preview">
        <h2>Preview</h2>
        <div className='actions'>
          <button onClick={handlePDFDownload}>Download PDF</button>
          <button onClick={handleEmail}>Send Email</button>
          <button onClick={handlePayment}>Make Payment</button>
        </div>
        <div className="preview-container" id="preview-container">
          <h3>Hi {invoiceDetails.recipient},</h3>
          <p>Your order {invoiceDetails.subject} was just dropped off. Check it out below:</p>
          <div className="preview-order-details">
            <h4><b>Your Order</b></h4>
            <hr></hr>
            <div className="row">
              <div className="left">
                <p>Due Date: {invoiceDetails.dueDate}</p>
                <p>Bill to: {invoiceDetails.email}</p>
              </div>
              <div className="right">
                <p>Subject: {invoiceDetails.subject}</p>
                <p>Currency: {invoiceDetails.currency}</p>
              </div>
            </div>
            {invoiceDetails.items.map((item, index) => (
              <p key={index}>
                {item.description} - {item.quantity} x {item.price} {invoiceDetails.currency}
              </p>
            ))}
            <h4><b>Amount</b></h4>
            <hr></hr>
            <div className="table-container">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td>{totals.subtotal.toFixed(2)} {invoiceDetails.currency}</td>
                  </tr>
                  <tr>
                    <td>Discount:</td>
                    <td>{totals.totalDiscount.toFixed(2)} {invoiceDetails.currency}</td>
                  </tr>
                  <tr>
                    <td>Tax:</td>
                    <td>{totals.totalTax.toFixed(2)} {invoiceDetails.currency}</td>
                  </tr>
                  <tr>
                    <td>Total:</td>
                    <td>{totals.total.toFixed(2)} {invoiceDetails.currency}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
