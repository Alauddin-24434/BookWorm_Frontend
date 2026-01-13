'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Shelf } from '../../../types';
import BookCard from '../../../components/books/BookCard';
import toast from 'react-hot-toast';

export default function LibraryPage() {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [activeTab, setActiveTab] = useState<'wantToRead' | 'currentlyReading' | 'read'>('wantToRead');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    try {
      const userId = "6965e7f5eeeeab78d5620286";
      const response = await fetch(`http://localhost:5000/api/v1/user-library/${userId}`);
      const data= await response.json();
      setShelves(data.data);
    } catch (error) {
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };
  console.log("Shelves", shelves);

  const filteredShelves = shelves?.filter(shelf => shelf.shelfType === activeTab);

  const tabs = [
    { key: 'wantToRead' as const, label: 'Want to Read', emoji: '📚' },
    { key: 'currentlyReading' as const, label: 'Currently Reading', emoji: '📖' },
    { key: 'read' as const, label: 'Read', emoji: '✓' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">My Library</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 px-6 font-medium transition-colors duration-200 border-b-2 ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{tab.emoji}</span>
            {tab.label} ({shelves.filter(s => s.shelfType === tab.key).length})
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredShelves.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            No books in this shelf yet
          </h3>
          <p className="text-gray-600 mb-6">Start adding books to your library!</p>
          <a
            href="/browse"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Browse Books
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredShelves.map((shelf) => (
            <div key={shelf._id}>
              <BookCard book={shelf.book} />
              {shelf.shelfType === 'currentlyReading' && shelf.progress && (
                <div className="mt-2 px-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${shelf.progress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {shelf.progress.pagesRead} / {shelf.book.totalPages} pages
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
