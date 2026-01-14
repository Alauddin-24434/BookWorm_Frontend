'use client';

import AdminDashboard from '@/components/dashboard-related/AdminDashboard';
import UserDashboard from '@/components/dashboard-related/UserDashboard';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

import { Loader2 } from "lucide-react";
import { useGetStatsQuery } from '@/redux/features/auth/authApi';

function DashboardWrapper() {
  const user = useSelector(selectCurrentUser);

 
  const { data, isLoading, isError } = useGetStatsQuery(undefined, {
    skip: !user,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 font-medium italic">
          Please login to access your workspace.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-muted-foreground animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <p className="text-red-600 font-semibold">Error loading statistics!</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline text-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  const stats = data?.data; 

  return user.role === 'admin' ? (
    <AdminDashboard stats={stats} />
  ) : (
    <UserDashboard stats={stats} />
  );
}

export default DashboardWrapper;