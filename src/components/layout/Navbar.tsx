'use client';

import React from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {

  const pathname = usePathname();

  const isAdmin = "admin" === 'admin';

 const userNav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Browse Books', href: '/browse' },
    { name: 'My Library', href: '/library' },
    { name: 'Tutorials', href: '/tutorials' },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Books', href: '/admin/books' },
    { name: 'Genres', href: '/admin/genres' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Reviews', href: '/admin/reviews' },
    { name: 'Tutorials', href: '/admin/tutorials' },
  ];

  const navItems = isAdmin ? adminNav : userNav;

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className="text-2xl font-serif font-bold text-gradient">BookWorm</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-primary-500'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          {/* {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <Image
                  src={user.photoURL || '/placeholder-avatar.png'}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-primary-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="btn-outline py-2 px-4 text-sm"
              >
                Logout
              </button>
            </div>
          )} */}
        </div>
      </div>
    </nav>
  );
}
