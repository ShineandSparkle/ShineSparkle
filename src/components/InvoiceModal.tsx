import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formulationsData } from "@/data/formulations";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice?: any;
  customers: any[];
  onSave: (invoiceData: any) => void;
}

const InvoiceModal = ({
  open,
  onClose,
  invoice,
  customers,
  onSave,
}: InvoiceModalProps) => {
  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_gst_no: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0,
    notes: "",
  });

  const [priceData, setPriceData] = useState(formulationsData);

  // Load custom prices from database
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const { data } = await supabase
          .from("settings")
          .select("setting_data")
          .eq("setting_type", "pricing")
          .single();

        if (data?.setting_data) {
          const customPrices = data.setting_data;
          const mergedPrices = formulationsData.map((formulation) => {
            const customPrice = customPrices[formulation.id];
            if (customPrice) {
              return {
                ...formulation,
                costPer1L: customPrice.costPer1L ?? formulation.costPer1L,
              };
            }
            return formulation;
          });
          setPriceData(mergedPrices);
        }
      } catch (error) {
        console.error("Error loading prices:", error);
      }
    };

    if (open) loadPrices();
  }, [open]);

  // Populate form if editing existing invoice
  useEffect(() => {
    if (invoice) {
      setFormData({
        customer_id: invoice.customer_id || "",
        customer_name: invoice.customer_name || "",
        customer_email: invoice.customer_email || "",
        customer_phone: invoice.customer_phone || "",
        customer_address: invoice.customer_address || "",
        customer_gst_no: invoice.customer_gst_no || "",
        items:
          invoice.items || [{ description: "", quantity: 1, rate: 0, amount: 0 }],
        taxRate: invoice.tax_rate || 0,
        notes: invoice.notes || "",
      });
    } else {
      setFormData({
        customer_id: "",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        customer_gst_no: "",
        items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
        taxRate: 0,
        notes: "",
      });
    }
  }, [invoice, open]);

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (selectedCustomer) {
      setFormData({
        ...formData,
        customer_id: customerId,
        customer_name: selectedCustomer.name,
        customer_email: selectedCustomer.email || "",
        customer_phone: selectedCustomer.phone || "",
        customer_address: selectedCustomer.address || "",
        customer_gst_no: selectedCustomer.gst_no || "",
      });
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];

    // When product is selected
    if (field === "description" && value.includes("|")) {
      const [formulationName, size, price] = value.split("|");
      newItems[index] = {
        ...newItems[index],
        description: `${formulationName} - ${size}`,
        rate: parseFloat(price),
        amount: newItems[index].quantity * parseFloat(price),
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === "quantity" || field === "rate") {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    if (formData.items.length === 1) {
      newItems[0] = { description: "", quantity: 1, rate: 0, amount: 0 };
    } else {
      newItems.splice(index, 1);
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleSave = async () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount;

    let invoiceNumber = invoice?.invoice_number;
    if (!invoice) {
      const { data } = await supabase.rpc("generate_invoice_number");
      invoiceNumber = data;
    }

    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_id: formData.customer_id || null,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email || null,
      customer_phone: formData.customer_phone || null,
      customer_address: formData.customer_address || null,
      customer_gst_no: formData.customer_gst_no || null,
      items: formData.items,
      subtotal,
      tax_rate: formData.taxRate,
      tax_amount: taxAmount,
      total_amount: total,
      status: "Pending",
      invoice_date: invoice?.invoice_date || new Date().toISOString().split("T")[0],
      notes: formData.notes || null,
    };

    onSave(invoiceData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "New Invoice"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Selection */}
          <div>
            <Label htmlFor="customer">Select Customer</Label>
            <Select
              value={formData.customer_id}
              onValueChange={handleCustomerSelect}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose existing customer or add manually" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Customer Name</Label>
              <Input
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.customer_email}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>GST Number</Label>
              <Input
                value={formData.customer_gst_no}
                onChange={(e) =>
                  setFormData({ ...formData, customer_gst_no: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <Textarea
              value={formData.customer_address}
              onChange={(e) =>
                setFormData({ ...formData, customer_address: e.target.value })
              }
            />
          </div>

          {/* Item List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold">Items</Label>
              <Button onClick={addItem} size="sm">
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-end"
                >
                  <div>
                    <Label>Product Name</Label>
                    <Select
                      onValueChange={(value) =>
                        handleItemChange(index, "description", value)
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue
                          placeholder="Select product"
                          defaultValue={item.description}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg max-h-[300px] z-50">
                        {priceData.map((formulation) => (
                          <SelectItem
                            key={formulation.id}
                            value={`${formulation.name}|1 Ltr|${formulation.costPer1L}`}
                          >
                            {formulation.name} - 1 Ltr (₹
                            {formulation.costPer1L.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label>Rate (₹)</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input value={item.amount.toFixed(2)} readOnly />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tax Rate (%)</Label>
              <Select
                value={formData.taxRate.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, taxRate: Number(value) })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select tax rate" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="0">0% (No Tax)</SelectItem>
                  <SelectItem value="5">5% GST</SelectItem>
                  <SelectItem value="12">12% GST</SelectItem>
                  <SelectItem value="18">18% GST</SelectItem>
                  <SelectItem value="28">28% GST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  ₹
                  {formData.items
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Tax ({formData.taxRate}%):
                </span>
                <span>
                  ₹
                  {(
                    (formData.items.reduce(
                      (sum, item) => sum + item.amount,
                      0
                    ) *
                      formData.taxRate) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>
                  ₹
                  {(
                    formData.items.reduce(
                      (sum, item) => sum + item.amount,
                      0
                    ) *
                    (1 + formData.taxRate / 100)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Invoice</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
