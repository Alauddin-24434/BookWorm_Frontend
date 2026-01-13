'use client';

import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";


export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-white min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
  
  );
}
