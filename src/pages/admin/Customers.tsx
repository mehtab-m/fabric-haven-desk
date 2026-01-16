import React, { useState } from 'react';
import { Plus, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { customers as initialCustomers, Customer } from '@/services/mockData';
import { toast } from '@/hooks/use-toast';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const openAddModal = () => {
    setViewingCustomer(null);
    setFormData({ name: '', email: '', phone: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      orderCount: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setCustomers([...customers, newCustomer]);
    toast({ title: 'Customer added successfully' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
                <th className="text-center py-4 px-6 font-medium text-muted-foreground">Orders</th>
                <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
                <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-border">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">{customer.email}</td>
                  <td className="py-4 px-6 hidden lg:table-cell">{customer.phone}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground hidden md:table-cell">{customer.joinedDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="icon" onClick={() => setViewingCustomer(customer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Customer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Customer Modal */}
      <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-2xl font-bold">
                    {viewingCustomer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{viewingCustomer.name}</h3>
                  <p className="text-muted-foreground">{viewingCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewingCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{viewingCustomer.orderCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined Date</p>
                  <p className="font-medium">{viewingCustomer.joinedDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
