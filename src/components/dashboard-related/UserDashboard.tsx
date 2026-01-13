'use client';

import { Book } from '@/types';
import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import BookCard from '../books/BookCard';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/recommendations');
      const data= await response.json();
      setRecommendations(data.data);
    } catch (error) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-serif font-bold text-gradient mb-4">
          Welcome to Your Reading Journey
        </h1>
        <p className="text-xl text-gray-600">
          Discover your next favorite book with personalized recommendations
        </p>
      </div>

      {/* Recommendations */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Recommended for You
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recommendations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recommendations.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <a href="/browse" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            Browse Books
          </h3>
          <p className="text-gray-600">
            Explore our entire collection with advanced filters
          </p>
        </a>

        <a href="/library" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            My Library
          </h3>
          <p className="text-gray-600">
            View and manage your reading lists
          </p>
        </a>

        <a href="/tutorials" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            Tutorials
          </h3>
          <p className="text-gray-600">
            Watch book reviews and reading tips
          </p>
        </a>
      </div>
    </div>
  );
} 