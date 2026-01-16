import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { analyticsData } from '@/services/mockData';

const COLORS = ['#4f6d7a', '#7a9e7e', '#c9b896', '#d4a574', '#8b7355'];

const AdminAnalytics: React.FC = () => {
  const pieData = [
    { name: 'Pending', value: analyticsData.ordersByStatus.pending },
    { name: 'Shipped', value: analyticsData.ordersByStatus.shipped },
    { name: 'Delivered', value: analyticsData.ordersByStatus.delivered },
    { name: 'Cancelled', value: analyticsData.ordersByStatus.cancelled },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">₨ {analyticsData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{analyticsData.totalOrders}</p>
        </div>
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold mt-1">{analyticsData.totalCustomers}</p>
        </div>
        <div className="bg-card rounded-xl shadow-elegant p-6">
          <p className="text-sm text-muted-foreground">Wishlist Items</p>
          <p className="text-2xl font-bold mt-1">{analyticsData.wishlistCount}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl shadow-elegant p-6">
        <h3 className="font-display text-lg font-bold mb-6">Monthly Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.monthlyRevenue}>
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
              <BarChart data={analyticsData.topProducts} layout="vertical">
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
