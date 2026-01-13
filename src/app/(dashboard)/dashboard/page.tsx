'use client';

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import toast from 'react-hot-toast';
import AdminDashboard from '@/components/dashboard-related/AdminDashboard';
import DashboardPage from '@/components/dashboard-related/UserDashboard';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

 function DashboardWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me'); // fetch logged-in user
      setUser(response.data.data);
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // if (!user) {
  //   return <p className="text-center py-12 text-gray-700">Please login to view your dashboard</p>;
  // }

  return "admin" === 'admin' ? <AdminDashboard /> : <DashboardPage />;
}

export default DashboardWrapper;