'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalBooks: number;
  totalGenres: number;
  pendingReviews: number;
  adminCount: number;
  userCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
        const response = await fetch('/users/stats');
        const data = await response.json();
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-green-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'blue', link: '/admin/users' },
    { label: 'Total Books', value: stats?.totalBooks || 0, icon: '📚', color: 'green', link: '/admin/books' },
    { label: 'Genres', value: stats?.totalGenres || 0, icon: '🏷️', color: 'purple', link: '/admin/genres' },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: '📝', color: 'orange', link: '/admin/reviews' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.link} className="card p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-5xl">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/books" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Manage Books</h3>
          <p className="text-gray-600">Add, edit, or delete books from the collection</p>
        </Link>

        <Link href="/admin/genres" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏷️</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Manage Genres</h3>
          <p className="text-gray-600">Create and update book categories</p>
        </Link>

        <Link href="/admin/reviews" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Moderate Reviews</h3>
          <p className="text-gray-600">Approve or reject user-submitted reviews</p>
        </Link>

        <Link href="/admin/users" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Manage Users</h3>
          <p className="text-gray-600">Update user roles and manage accounts</p>
        </Link>

        <Link href="/admin/tutorials" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">Manage Tutorials</h3>
          <p className="text-gray-600">Add and manage YouTube book tutorials</p>
        </Link>
      </div>
    </div>
  );
}