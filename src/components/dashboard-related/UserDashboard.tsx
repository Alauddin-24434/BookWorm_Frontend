'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function UserDashboard({ stats }: { stats: any }) {
  const goalPercentage = Math.min(Math.round((stats?.booksReadThisYear / stats?.annualGoal) * 100), 100);

  return (
    <div className="p-2 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-500">Track your reading progress and challenges.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Annual Goal Circular Progress */}
        <div className="bg-white border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold mb-4">2026 Reading Goal</h3>
          <div className="relative h-32 w-32 mb-4">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-600" strokeDasharray={`${goalPercentage}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
              {goalPercentage}%
            </div>
          </div>
          <p className="text-sm font-medium">{stats?.booksReadThisYear} / {stats?.annualGoal} Books Read</p>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Total Pages Read</p>
            <p className="text-4xl font-black mt-2">{stats?.totalPagesRead}</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <p className="text-orange-600 text-sm font-bold uppercase tracking-wider">Avg. Rating Given</p>
            <p className="text-4xl font-black mt-2">{stats?.averageRating} ⭐</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <p className="text-green-600 text-sm font-bold uppercase tracking-wider">Current Streak</p>
            <p className="text-4xl font-black mt-2">{stats?.readingStreak} Days 🔥</p>
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-bold mb-6">Books Read by Month</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="_id" tickFormatter={(val) => `Month ${val}`} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}