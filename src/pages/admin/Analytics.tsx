import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { adminAPI, orderAPI, productAPI } from '@/services/api';

const COLORS = ['#4f6d7a', '#7a9e7e', '#c9b896', '#d4a574', '#8b7355'];

const AdminAnalytics: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [wishlistCount, setWishlistCount] = React.useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = React.useState<{ month: string; revenue: number }[]>([]);
  const [topProducts, setTopProducts] = React.useState<{ name: string; sales: number }[]>([]);
  const [ordersByStatus, setOrdersByStatus] = React.useState<{ pending: number; shipped: number; delivered: number; cancelled: number }>({
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [ordersData, productsData, usersData] = await Promise.all([
          orderAPI.getAll(),
          productAPI.getAll(),
          adminAPI.getUsers(),
        ]);

        const orders = Array.isArray(ordersData) ? ordersData : ordersData.items || [];
        const products = Array.isArray(productsData) ? productsData : productsData.items || [];
        const users = Array.isArray(usersData) ? usersData : usersData.items || [];

        setTotalOrders(orders.length);
        setTotalRevenue(orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0));

        const customerUsers = users.filter((u: any) => (u.role || 'user') === 'user');
        setTotalCustomers(customerUsers.length);
        setWishlistCount(customerUsers.reduce((sum: number, u: any) => sum + ((u.wishlist || []).length || 0), 0));

        const statusCounts = orders.reduce(
          (acc: any, o: any) => {
            const status = String(o.status || 'pending').toLowerCase();
            if (acc[status] !== undefined) acc[status] += 1;
            return acc;
          },
          { pending: 0, shipped: 0, delivered: 0, cancelled: 0 }
        );
        setOrdersByStatus(statusCounts);

        const monthlyMap = new Map<string, number>();
        orders.forEach((o: any) => {
          const date = o.createdAt ? new Date(o.createdAt) : new Date();
          const month = date.toLocaleString('default', { month: 'short' });
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + (o.total || 0));
        });
        setMonthlyRevenue(Array.from(monthlyMap.entries()).map(([month, revenue]) => ({ month, revenue })));

        const productNameById = new Map<string, string>();
        products.forEach((p: any) => productNameById.set(String(p._id || p.id), p.title || p.name));

        const salesByProduct = new Map<string, number>();
        orders.forEach((o: any) => {
          (o.items || []).forEach((it: any) => {
            const pid = String(it.product || it.productId);
            salesByProduct.set(pid, (salesByProduct.get(pid) || 0) + (it.quantity || 0));
          });
        });

        const top = Array.from(salesByProduct.entries())
          .map(([id, sales]) => ({ id, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 8)
          .map((x) => ({ name: productNameById.get(x.id) || 'Product', sales: x.sales }));

        setTopProducts(top);
      } catch (error) {
        console.error('Failed to load analytics', error);
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
      <h1 className="font-display text-2xl font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">₨ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{totalOrders}</p>
        </div>
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
        </div>
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Wishlist Items</p>
          <p className="text-2xl font-bold mt-1">{wishlistCount}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl shadow-elegant p-6">
        <h3 className="font-display text-lg font-bold mb-6">Monthly Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenue}>
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
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <h3 className="font-display text-lg font-bold mb-6">Top Selling Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Distribution */}
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <h3 className="font-display text-lg font-bold mb-6">Orders Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
