import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  CreditCard, 
  Users, 
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Edit
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvoiceModal from "@/components/InvoiceModal";
import PaymentModal from "@/components/PaymentModal";
import CustomerModal from "@/components/CustomerModal";
import printInvoice from "@/components/InvoicePrint";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;
      
      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (invoicesError) throw invoicesError;
      
      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (paymentsError) throw paymentsError;
      
      setCustomers(customersData || []);
      setInvoices(invoicesData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setInvoiceModalOpen(true);
  };

  const handleRecordPayment = () => {
    setPaymentModalOpen(true);
  };

  const handleAddCustomer = () => {
    setCustomerModalOpen(true);
  };

  const handleEditInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    setEditingInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm(`Are you sure you want to delete this invoice?`)) {
      try {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', invoiceId);
        
        if (error) throw error;
        
        setInvoices(invoices.filter(inv => inv.id !== invoiceId));
        toast({
          title: "Success",
          description: "Invoice deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast({
          title: "Error",
          description: "Failed to delete invoice",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrintInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      printInvoice(invoice);
    }
  };

  const handleSaveInvoice = async (invoiceData: any) => {
    try {
      if (editingInvoice) {
        // Update existing invoice
        const { data, error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingInvoice.id)
          .select()
          .single();
        
        if (error) throw error;
        
        setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? data : inv));
        toast({
          title: "Success",
          description: "Invoice updated successfully",
        });
      } else {
        // Create new invoice
        const { data, error } = await supabase
          .from('invoices')
          .insert([invoiceData])
          .select()
          .single();
        
        if (error) throw error;
        
        setInvoices([data, ...invoices]);
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
      }
      setInvoiceModalOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      });
    }
  };

  const handleSavePayment = async (paymentData: any) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();
      
      if (error) throw error;
      
      setPayments([data, ...payments]);
      setPaymentModalOpen(false);
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    } catch (error) {
      console.error('Error saving payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  };

  const handleSaveCustomer = async (customerData: any) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();
      
      if (error) throw error;
      
      setCustomers([data, ...customers]);
      setCustomerModalOpen(false);
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  // Calculate dynamic stats
  const totalPayments = payments.reduce((total, p) => total + parseFloat(p.amount || 0), 0);
  const pendingAmount = invoices
    .filter(inv => inv.status !== "Paid")
    .reduce((total, inv) => total + parseFloat(inv.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Invoice Management System
            </h2>
            {/*<p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Complete invoice, payment, and customer management solution for your business
            </p>*/}
          </div>

          {/* Quick Stats */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-600">Loading data...</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-600 mb-1">
                {invoices.length}
              </h3>
              <p className="text-slate-600">Total Invoices</p>
            </Card>

            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-600 mb-1">
                ₹{totalPayments.toLocaleString()}
              </h3>
              <p className="text-slate-600">Payments Received</p>
            </Card>

            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-orange-600 mb-1">
                ₹{pendingAmount.toLocaleString()}
              </h3>
              <p className="text-slate-600">Pending Payments</p>
            </Card>

            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-purple-600 mb-1">
                {customers.length}
              </h3>
              <p className="text-slate-600">Active Customers</p>
            </Card>
          </div>
          )}

          {/* Main Content */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Business Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="invoices" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Invoices
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="customers" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Customers
                  </TabsTrigger>
                </TabsList>

                {/* Invoices Tab */}
                <TabsContent value="invoices" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-semibold text-slate-800">Invoice Management</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewInvoice}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Invoice
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Sample Invoice Cards */}
                    {invoices.map((invoice) => (
                      <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                             <div className="space-y-1">
                               <h4 className="font-semibold text-slate-800">{invoice.invoice_number}</h4>
                               <p className="text-sm text-slate-600">Customer: {invoice.customer_name}</p>
                               <p className="text-sm text-slate-500">Date: {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                             </div>
                             <div className="flex items-center gap-4">
                               <div className="text-right">
                                 <p className="font-semibold text-slate-800">₹{parseFloat(invoice.total_amount || 0).toLocaleString()}</p>
                                 <span className={`text-xs px-2 py-1 rounded-full ${
                                   invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                   invoice.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                                   'bg-red-100 text-red-700'
                                 }`}>
                                   {invoice.status}
                                 </span>
                               </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice.id)}>
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditInvoice(invoice.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-semibold text-slate-800">Payment Tracking</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleRecordPayment}>
                        <Plus className="h-4 w-4 mr-2" />
                        Payments
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Sample Payment Cards */}
                    {payments.map((payment) => (
                      <Card key={payment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                             <div className="space-y-1">
                               <h4 className="font-semibold text-slate-800">Payment #{payment.id.slice(-8)}</h4>
                               <p className="text-sm text-slate-600">From: {payment.customer_name}</p>
                               <p className="text-sm text-slate-500">Method: {payment.payment_method}</p>
                             </div>
                             <div className="text-right">
                               <p className="font-semibold text-green-600">₹{parseFloat(payment.amount || 0).toLocaleString()}</p>
                               <p className="text-sm text-slate-500">{new Date(payment.payment_date).toLocaleDateString()}</p>
                             </div>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-semibold text-slate-800">Customer Database</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddCustomer}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Sample Customer Cards */}
                    {customers.map((customer) => (
                      <Card key={customer.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-slate-800">{customer.name}</h4>
                              <p className="text-sm text-slate-600">{customer.email}</p>
                              <p className="text-sm text-slate-500">{customer.phone}</p>
                            </div>
                             <div className="text-right">
                               <p className="font-semibold text-slate-800">₹{invoices
                                 .filter(inv => inv.customer_id === customer.id)
                                 .reduce((total, inv) => total + parseFloat(inv.total_amount || 0), 0)
                                 .toLocaleString()}</p>
                               <p className="text-sm text-slate-500">Total Business</p>
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <InvoiceModal 
        open={invoiceModalOpen} 
        onClose={() => setInvoiceModalOpen(false)}
        invoice={editingInvoice}
        customers={customers}
        onSave={handleSaveInvoice}
      />
      <PaymentModal 
        open={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)}
        onSave={handleSavePayment}
        invoices={invoices}
      />
      <CustomerModal 
        open={customerModalOpen} 
        onClose={() => setCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default Index;