import React, { useState } from 'react';
import { Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { orders as initialOrders, products, Order } from '@/services/mockData';
import { toast } from '@/hooks/use-toast';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast({ title: `Order status updated to ${newStatus}` });
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-accent/20 text-accent';
      case 'shipped': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-right py-4 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="py-4 px-4 font-medium">{order.id}</td>
                  <td className="py-4 px-4">{order.customerName}</td>
                  <td className="py-4 px-4 text-muted-foreground hidden md:table-cell">{order.orderDate}</td>
                  <td className="py-4 px-4">
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v as Order['status'])}>
                      <SelectTrigger className={`w-28 h-8 text-xs ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-4 px-4 text-right font-medium">₨ {order.total.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setViewingOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{viewingOrder.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingOrder.status)}`}>
                  {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{viewingOrder.orderDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                <p className="font-medium">{viewingOrder.address}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-medium mb-3">Order Items</p>
                <div className="space-y-3">
                  {viewingOrder.products.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{getProductName(item.productId)}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₨ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-primary">₨ {viewingOrder.total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
