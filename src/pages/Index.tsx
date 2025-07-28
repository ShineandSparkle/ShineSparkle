import { useState } from "react";
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("invoices");

  const handleNewInvoice = () => {
    alert("New Invoice functionality will be implemented");
  };

  const handleRecordPayment = () => {
    alert("Record Payment functionality will be implemented");
  };

  const handleAddCustomer = () => {
    alert("Add Customer functionality will be implemented");
  };

  const handleEditInvoice = (invoiceId: number) => {
    alert(`Edit Invoice #${invoiceId} functionality will be implemented`);
  };

  const handleDeleteInvoice = (invoiceId: number) => {
    if (confirm(`Are you sure you want to delete Invoice #${invoiceId}?`)) {
      alert(`Invoice #${invoiceId} deleted successfully`);
    }
  };

  const handlePrintInvoice = (invoiceId: number) => {
    alert(`Print Invoice #${invoiceId} functionality will be implemented`);
  };

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
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Complete invoice, payment, and customer management solution for your business
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-600 mb-1">24</h3>
              <p className="text-slate-600">Total Invoices</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-600 mb-1">₹45,230</h3>
              <p className="text-slate-600">Payments Received</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-orange-600 mb-1">₹12,450</h3>
              <p className="text-slate-600">Pending Payments</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-purple-600 mb-1">18</h3>
              <p className="text-slate-600">Active Customers</p>
            </Card>
          </div>

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
                    {[1, 2, 3].map((invoice) => (
                      <Card key={invoice} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-slate-800">Invoice #INV-{String(invoice).padStart(3, '0')}</h4>
                              <p className="text-sm text-slate-600">Customer: ABC Company Ltd.</p>
                              <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-slate-800">₹{(invoice * 2500).toLocaleString()}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  invoice === 1 ? 'bg-green-100 text-green-700' : 
                                  invoice === 2 ? 'bg-orange-100 text-orange-700' : 
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {invoice === 1 ? 'Paid' : invoice === 2 ? 'Pending' : 'Overdue'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice)}>
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditInvoice(invoice)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteInvoice(invoice)}>
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
                        Record Payment
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {/* Sample Payment Cards */}
                    {[1, 2, 3, 4].map((payment) => (
                      <Card key={payment} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-slate-800">Payment #{String(payment).padStart(3, '0')}</h4>
                              <p className="text-sm text-slate-600">From: Customer {payment}</p>
                              <p className="text-sm text-slate-500">
                                Method: {payment % 2 === 0 ? 'Bank Transfer' : payment % 3 === 0 ? 'Cash' : 'UPI'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">₹{(payment * 1250).toLocaleString()}</p>
                              <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
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
                    {['ABC Company Ltd.', 'XYZ Industries', 'PQR Enterprises', 'LMN Corp'].map((customer, index) => (
                      <Card key={customer} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-slate-800">{customer}</h4>
                              <p className="text-sm text-slate-600">contact@{customer.toLowerCase().replace(/[^a-z]/g, '')}.com</p>
                              <p className="text-sm text-slate-500">+91 98765 4321{index}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-800">₹{((index + 1) * 5000).toLocaleString()}</p>
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
    </div>
  );
};

export default Index;