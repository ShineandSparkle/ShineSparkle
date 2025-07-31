const printInvoice = (invoice: any) => {
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${invoice.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          position: relative;
        }

        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Watermark using actual image element */
        .watermark-img {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: auto;
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }

        .logo {
          max-width: 50px;
          height: auto;
          margin-bottom: 10px;
        }

        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .bill-to, .invoice-info {
          flex: 1;
        }

        .bill-to {
          margin-right: 20px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .table th, .table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }

        .total-section {
          text-align: right;
          margin-top: 20px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }

        .total-final {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #333;
          padding-top: 10px;
        }

        .notes {
          margin-top: 30px;
          padding: 15px;
          background-color: #f8f9fa;
          border-left: 4px solid #007bff;
        }

        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
        }

        .footer-business {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .footer-details {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <img src="/Logo.png" alt="Watermark" class="watermark-img" />

      <div class="invoice-container">
        <div class="header">
          <img src="/Logo.png" alt="Company Logo" class="logo" />
          <div class="company-name">SHINE & SPARKLE</div>
        </div>

        <div class="invoice-details">
          <div class="bill-to">
            <h3>Bill To:</h3>
            <p><strong>${invoice.customer_name || 'N/A'}</strong></p>
            <p>${invoice.customer_email || ''}</p>
            <p>${invoice.customer_phone || ''}</p>
            ${invoice.customer_address ? `<p>${invoice.customer_address}</p>` : ''}            
          </div>
          <div class="invoice-info">
            <h3>Invoice Details:</h3>
            <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
            <p><strong>Date:</strong> ${new Date(invoice.invoice_date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${
              invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString()
                : new Date(new Date(invoice.invoice_date).getTime() + 30 * 86400000).toLocaleDateString()
            }</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate (₹)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>₹${item.rate.toFixed(2)}</td>
                <td>₹${item.amount.toFixed(2)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${(invoice.subtotal || 0).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax (${invoice.tax_rate || 18}%):</span>
            <span>₹${(invoice.tax_amount || 0).toFixed(2)}</span>
          </div>
          <div class="total-row total-final">
            <span>Total:</span>
            <span>₹${(invoice.total_amount || 0).toFixed(2)}</span>
          </div>
        </div>

        ${invoice.notes ? `
          <div class="notes">
            <h4>Notes:</h4>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <div class="footer-business">SHINE & SPARKLE</div>
          <div class="footer-details">
            <div class="footer-item">
              <span>📍</span><span>RK Residency, Ravalkole, Medchal</span>
              <span>📞</span><span>+91 8500 60 6000</span>
              <span>📧</span><span>support@shineandsparkle.com</span>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #666;">
          <p>Thank you for your business!</p>
        </div>
      </div>

      <script>
        window.onload = function () {
          window.print();
          window.onafterprint = function () {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
};

export default printInvoice;
