'use client';

import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard({ stats }: { stats: any }) {
  const statCards = [
    { label: 'Total Users', value: stats?.userCount || 0, icon: '👥', link: '/dashboard/admin/users' },
    { label: 'Library Books', value: stats?.booksCount || 0, icon: '📚', link: '/dashboard/admin/books' },
    { label: 'Admins', value: stats?.adminCount || 0, icon: '🛡️', link: '/dashboard/admin/users' },
    { label: 'Pending Reviews', value: stats?.pendingReviewCount || 0, icon: '📝', link: '/dashboard/admin/reviews' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Overview</h1>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.link} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white border rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold mb-4">Books Distribution by Genre</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.genreDistribution}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats?.genreDistribution?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}