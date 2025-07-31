import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (paymentData: any) => void;
  invoices: any[];
}

const PaymentModal = ({ open, onClose, onSave, invoices }: PaymentModalProps) => {
  const [formData, setFormData] = useState({
    invoice_id: "",
    customer_name: "",
    amount: "",
    payment_method: "upi",
    notes: "",
    payment_date: new Date().toISOString().split('T')[0]
  });

  // Get unpaid invoices
  const unpaidInvoices = invoices.filter(invoice => 
    invoice.status === 'Pending' || invoice.status === 'Overdue'
  );

  const handleInvoiceSelect = (invoiceId: string) => {
    const selectedInvoice = unpaidInvoices.find(inv => inv.id === invoiceId);
    if (selectedInvoice) {
      setFormData({
        ...formData,
        invoice_id: invoiceId,
        customer_name: selectedInvoice.customer_name,
        amount: selectedInvoice.total_amount.toString()
      });
    }
  };

  const handleSave = () => {
    onSave({
      invoice_id: formData.invoice_id || null,
      customer_name: formData.customer_name,
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      payment_date: formData.payment_date,
      notes: formData.notes || null
    });
    setFormData({
      invoice_id: "",
      customer_name: "",
      amount: "",
      payment_method: "upi",
      notes: "",
      payment_date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payments</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="invoice">Select Invoice</Label>
            <Select value={formData.invoice_id} onValueChange={handleInvoiceSelect}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose unpaid invoice" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {unpaidInvoices.map((invoice) => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number} - {invoice.customer_name} (₹{invoice.total_amount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="Customer name"
              disabled={!!formData.invoice_id}
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              disabled={!!formData.invoice_id}
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              className="h-20"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Payment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;