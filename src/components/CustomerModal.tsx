import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customerData: any) => void;
}

const CustomerModal = ({ open, onClose, onSave }: CustomerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gst_no: ""
  });

  const handleSave = () => {
    const fullAddress = [formData.address].filter(Boolean).join(", ");
    
    onSave({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      address: fullAddress || null,
      gst_no: formData.gst_no || null
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      gst_no: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company/Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Customer name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="gst_no">GST Number</Label>
              <Input
                id="gst_no"
                value={formData.gst_no}
                onChange={(e) => setFormData({ ...formData, gst_no: e.target.value })}
                placeholder="GST registration number"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Complete address"
              className="h-20"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.name}>Save Customer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;