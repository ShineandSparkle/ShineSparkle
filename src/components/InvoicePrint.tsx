interface InvoicePrintProps {
  invoice: any;
}

const InvoicePrint = ({ invoice }: InvoicePrintProps) => {
  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice #${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .bill-to, .invoice-info { flex: 1; }
            .bill-to { margin-right: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background-color: #f8f9fa; font-weight: bold; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
            .notes { margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-name">SHINE & SPARKLE</div>
              <p>Professional Cleaning Solutions</p>
            </div>
            
            <div class="invoice-details">
              <div class="bill-to">
                <h3>Bill To:</h3>
                <p><strong>${invoice.customerName}</strong></p>
                <p>${invoice.customerEmail}</p>
                <p>${invoice.customerPhone}</p>
              </div>
              <div class="invoice-info">
                <h3>Invoice Details:</h3>
                <p><strong>Invoice #:</strong> INV-${String(invoice.id).padStart(3, '0')}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(new Date(invoice.date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
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
                ${invoice.items.map((item: any) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.rate.toFixed(2)}</td>
                    <td>₹${item.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Tax (${invoice.taxRate}%):</span>
                <span>₹${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div class="total-row total-final">
                <span>Total:</span>
                <span>₹${invoice.total.toFixed(2)}</span>
              </div>
            </div>
            
            ${invoice.notes ? `
              <div class="notes">
                <h4>Notes:</h4>
                <p>${invoice.notes}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 40px; color: #666;">
              <p>Thank you for your business!</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return { printInvoice };
};

export default InvoicePrint;