export const generatePrintContent = (formData: any) => {
  const { dispatch, invoice, items, driver } = formData;

  // Calculate total amount
  const total = items ? items.reduce((sum: number, item: any) => sum + (parseFloat(item.price) || 0), 0) : 0;
  const storageTotal = (invoice.storageDays || 1) * (invoice.storageRate || 75.00);

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${invoice.invoicenum}</title>
      <style>
        @page {
          size: letter;
          margin: 0.35in 0.5in;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0 0.5in;
          font-size: 10pt;
          line-height: 1.3;
          max-width: 8.5in;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 15px;
          padding-top: 10px;
        }
        .company-name {
          font-size: 14pt;
          font-weight: bold;
          margin: 0;
        }
        .company-address {
          margin: 3px 0;
        }
        .invoice-box {
          border: 2px solid black;
          padding: 5px;
          float: right;
          width: 200px;
          margin-bottom: 10px;
        }
        .invoice-number {
          font-size: 14pt;
          font-weight: bold;
        }
        .invoice-details {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 5px;
        }
        .invoice-details th {
          background-color: #ffff00;
          border: 1px solid black;
          padding: 3px 4px;
          text-align: left;
        }
        .invoice-details td {
          border: 1px solid black;
          padding: 3px 4px;
        }
        .bill-to {
          float: left;
          margin-bottom: 15px;
        }
        .reg-owner {
          float: right;
          margin-bottom: 15px;
        }
        .clear {
          clear: both;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .items-table th {
          background-color: #ffff00;
          border: 1px solid black;
          padding: 3px 4px;
          text-align: left;
        }
        .items-table td {
          border: 1px solid black;
          padding: 3px 4px;
        }
        .totals {
          float: right;
          margin-top: 15px;
          width: 300px;
        }
        .totals table {
          width: 100%;
          border-collapse: collapse;
        }
        .totals td {
          padding: 3px 4px;
          text-align: right;
        }
        .remarks {
          margin-top: 15px;
          border: 1px solid black;
          padding: 8px;
        }
        .info-row {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5px;
        }
        .info-row td {
          border: 1px solid black;
          padding: 3px 4px;
          font-size: 9pt;
        }
        .info-row th {
          background-color: #ffff00;
          border: 1px solid black;
          padding: 3px 4px;
          font-size: 9pt;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <p class="company-name">PACIFIC TRUCK & AUTO TOWING, INC.</p>
        <p class="company-address">5391 BROOKS STREET CA42880</p>
        <p class="company-address">MONTCLAIR CA 91763-</p>
        <p class="company-address">909-6219596</p>
      </div>

      <div class="invoice-box">
        <table style="width: 100%">
          <tr>
            <td>Carrier<br>Indentification<br>Number</td>
            <td style="text-align: center; border: 1px solid black;">CA# ${invoice.carrierNumber || '165455'}</td>
          </tr>
        </table>
      </div>

      <div class="clear"></div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="width: 70%">
            <div class="bill-to">
              <strong>Bill To:</strong><br>
              ${invoice.billtoname || ''}<br>
              ${invoice.billtoaddr1 || ''}<br>
              ${invoice.billtocity || ''}, ${invoice.billtost || ''}
            </div>
          </td>
          <td style="width: 30%">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="background: #ffff00; border: 1px solid black; padding: 3px 4px;">Invoice#</td>
                <td style="border: 1px solid black; padding: 3px 4px; text-align: center;">${invoice.invoicenum || ''}</td>
              </tr>
              <tr>
                <td style="background: #ffff00; border: 1px solid black; padding: 3px 4px;">Invoice Date</td>
                <td style="border: 1px solid black; padding: 3px 4px; text-align: center;">${invoice.invdate || ''}</td>
              </tr>
              <tr>
                <td style="background: #ffff00; border: 1px solid black; padding: 3px 4px;">Dispatch#</td>
                <td style="border: 1px solid black; padding: 3px 4px; text-align: center;">${dispatch.dispatchNumber || ''}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div class="clear"></div>

      <table class="invoice-details">
        <tr>
          <th>Dispatch#</th>
          <th>Vehicle Information</th>
          <th>Storage In Date</th>
          <th>Storage Out Date</th>
          <th>Lot#</th>
          <th>Keys Info</th>
        </tr>
        <tr>
          <td>${dispatch.dispnum || ''}</td>
          <td>${dispatch.yearcar || ''} ${dispatch.makecar || ''} ${dispatch.modelcar || ''} ${dispatch.colorcar || ''}</td>
          <td>${dispatch.datein || ''}</td>
          <td>${dispatch.dateout || ''}</td>
          <td>${dispatch.lotNumber || ''}</td>
          <td>${dispatch.keysinfo || ''}</td>
        </tr>
      </table>

      <table class="info-row">
        <tr>
          <th>Purchase Order Number</th>
          <td colspan="3">${dispatch.purchaseOrderNumber || ''}</td>
        </tr>
      </table>

      <table class="info-row">
        <tr>
          <th>Vehicle Towed From</th>
          <td colspan="3">${dispatch.towedfrom || ''}</td>
        </tr>
      </table>

      <table class="info-row">
        <tr>
          <th>Vehicle Towed To</th>
          <td colspan="3">${dispatch.towedto || ''}</td>
        </tr>
      </table>

      <table class="info-row">
        <tr>
          <th>Calling Acct#</th>
          <th>Reference#</th>
          <th>Member# / Odometer</th>
          <th>Expires R-Type</th>
          <th>Rec</th>
          <th>Inrt</th>
          <th>Arrv</th>
          <th>Intow</th>
          <th>Clear</th>
          <th>Tag#</th>
        </tr>
        <tr>
          <td>${dispatch.callingAccount || ''}</td>
          <td>${dispatch.refnumber || ''}</td>
          <td>${dispatch.odometer || ''}</td>
          <td>${dispatch.expiresRType || ''}</td>
          <td>${driver.timerec || ''}</td>
          <td>${driver.timeinrt || ''}</td>
          <td>${driver.timearrive || ''}</td>
          <td>${driver.timeintow || ''}</td>
          <td>${driver.timeclear || ''}</td>
          <td>${driver.towtagnum || ''}</td>
        </tr>
      </table>

      <table class="items-table">
        <tr>
          <th>Driver</th>
          <th>Truck</th>
          <th>Quantity</th>
          <th>Item Description</th>
          <th>Unit Price</th>
          <th>Extended Price</th>
        </tr>
        ${items ? items.map((item: any) => `
          <tr>
            <td>${item.driver || ''}</td>
            <td>${item.truck || ''}</td>
            <td>${item.quantity || '1.00'}</td>
            <td>${item.description || ''}</td>
            <td style="text-align: right">$${parseFloat(item.price || 0).toFixed(2)}</td>
            <td style="text-align: right">$${parseFloat(item.price || 0).toFixed(2)}</td>
          </tr>
        `).join('') : ''}
      </table>

      <div class="remarks">
        <strong>Remarks:</strong><br>
        ${dispatch.callremark || ''}
      </div>

      <div class="totals">
        <table>
          <tr>
            <td>Sub Total</td>
            <td>$${total.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Storage # Days ${invoice.storageDays || 1} @ ${invoice.storageRate || 75.00} =</td>
            <td>$${storageTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>$${(total + storageTotal).toFixed(2)}</strong></td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  return content;
};

export const printInvoice = (formData: any) => {
  const content = generatePrintContent(formData);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};