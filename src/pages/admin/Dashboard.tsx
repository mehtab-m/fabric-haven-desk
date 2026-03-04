import React from 'react';
import { Package, Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Order } from '@/services/mockData';
import { orderAPI, productAPI } from '@/services/api';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}> = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-card rounded-xl shadow-elegant p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {trend && (
          <p className="text-accent text-sm mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const COLORS = ['#d4a574', '#7a9e7e', '#c9b896', '#8b7355'];

const AdminDashboard: React.FC = () => {
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = React.useState<{ month: string; revenue: number }[]>([]);
  const [ordersByStatus, setOrdersByStatus] = React.useState<{
    pending: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }>({
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([orderAPI.getAll(), productAPI.getAll()]);
        const orderItems = Array.isArray(ordersData) ? ordersData : ordersData.items || [];
        const mappedOrders: Order[] = orderItems.map((o: any) => ({
          id: o._id || o.id,
          customerId: o.userId?._id || o.userId,
          customerName: o.userId?.name || 'Customer',
          products: (o.items || []).map((i: any) => ({
            productId: i.product || i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          total: o.total,
          status: String(o.status || 'pending').toLowerCase() as Order['status'],
          orderDate: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
          address: o.shipping?.address || '',
        }));

        setRecentOrders(mappedOrders.slice(0, 5));
        setTotalOrders(mappedOrders.length);
        setTotalRevenue(mappedOrders.reduce((sum, o) => sum + o.total, 0));

        const customerIds = new Set(mappedOrders.map((o) => o.customerId));
        setTotalCustomers(customerIds.size);

        const productItems = Array.isArray(productsData) ? productsData : productsData.items || [];
        setTotalProducts(productItems.length);

        const statusCounts = mappedOrders.reduce(
          (acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          },
          { pending: 0, shipped: 0, delivered: 0, cancelled: 0 } as any
        );
        setOrdersByStatus(statusCounts);

        const monthlyMap = new Map<string, number>();
        mappedOrders.forEach((o) => {
          const date = o.orderDate ? new Date(o.orderDate) : new Date();
          const month = date.toLocaleString('default', { month: 'short' });
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + o.total);
        });
        setMonthlyRevenue(
          Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue }))
        );
      } catch (error) {
        console.error('Failed to load dashboard analytics', error);
      }
    };

    loadAnalytics();
  }, []);

  const pieData = [
    { name: 'Pending', value: ordersByStatus.pending },
    { name: 'Shipped', value: ordersByStatus.shipped },
    { name: 'Delivered', value: ordersByStatus.delivered },
    { name: 'Cancelled', value: ordersByStatus.cancelled },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₨ ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5% from last month"
          color="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="bg-accent/20 text-accent"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          trend="+8.2% from last month"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-elegant p-6">
          <h3 className="font-display text-lg font-bold mb-6">Monthly Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <h3 className="font-display text-lg font-bold mb-6">Orders by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl shadow-elegant p-6">
        <h3 className="font-display text-lg font-bold mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.orderDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-accent/20 text-accent' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">₨ {order.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
