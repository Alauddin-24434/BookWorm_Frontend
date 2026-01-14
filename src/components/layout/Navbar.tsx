'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout} from '@/redux/features/auth/authSlice';
import toast from 'react-hot-toast';

// Import shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutAction } from '@/app/actions/auth/auth';
import { Search, Video, LayoutDashboard, Library } from 'lucide-react';

export default function Navbar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    dispatch(logout());
    await logoutAction();
    toast.success("Logged out successfully");
    router.push('/login');
  };

  // Define navigation items that should appear in the navbar for users
  const navLinks = [
    { title: "Browse Books", url: "/browse", icon: Search },
    { title: "Tutorials", url: "/tutorials", icon: Video },
    { title: "My Library", url: "/dashboard/user/library", icon: Library },

  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white font-bold text-xl flex items-center gap-2">
            <span>📚</span> BookWorm
          </Link>

          {/* User-facing links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-400 ${
                  pathname === link.url ? "text-blue-500" : "text-gray-300"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Quick access to Dashboard for authenticated users */}
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-9 w-9 border border-blue-500 hover:opacity-80 transition">
                    <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 mt-2 bg-gray-800 border-gray-700 text-white shadow-xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-gray-400 capitalize">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full">My Dashboard</Link>
                  </DropdownMenuItem>

                  {user.role === "user" && (
                     <DropdownMenuItem asChild>
                     <Link href="/dashboard/user/library" className="cursor-pointer w-full">My Library</Link>
                   </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}