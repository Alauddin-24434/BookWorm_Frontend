"use client";

import { useState } from "react";
import { useGetUserLibraryQuery } from "@/redux/features/library/libraryApi";
import BookCard from "@/components/books/BookCard";
import { Loader2, Book, BookmarkCheck, Library as LibraryIcon } from "lucide-react";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("wantToRead");

  // RTK Query Hook
  const { data: shelves = [], isLoading, isFetching } = useGetUserLibraryQuery(undefined);

  // Filtering logic
  const filteredShelves = shelves.filter((shelf: any) => shelf.shelfType === activeTab);

  const tabs = [
    { key: "wantToRead", label: "Want to Read", emoji: "📚", icon: <LibraryIcon size={18} /> },
    { key: "currentlyReading", label: "Reading", emoji: "📖", icon: <Book size={18} /> },
    { key: "read", label: "Finished", emoji: "✓", icon: <BookmarkCheck size={18} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Opening your library...</p>
      </div>
    );
  }
  console.log(self)
console.log(filteredShelves)
  return (
    <div className="p-4 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">My Digital Library</h1>
          <p className="text-slate-500 font-medium">Manage your reading journey and personal collection.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
           <span className="text-blue-700 font-bold text-lg">{shelves.length}</span>
           <span className="text-blue-400 text-xs uppercase font-bold ml-2 tracking-widest">Total Books</span>
        </div>
      </div>
      
      {/* Premium Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-10 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const count = shelves.filter((s: any) => s.shelfType === tab.key).length;
          const isActive = activeTab === tab.key;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Layout */}
      {isFetching && !isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-400" /></div>
      ) : filteredShelves.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
       {/* Grid Layout in page.tsx */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
  {filteredShelves.map((shelf) => (
    // নিশ্চিত করুন shelf.book আছে
    shelf.book ? (
      <div key={shelf._id}>
        <BookCard book={shelf.book} />
      </div>
    ) : null
  ))}
</div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="text-slate-300" size={32} />
           </div>
           <h3 className="text-xl font-bold text-slate-800">Your shelf is empty</h3>
           <p className="text-slate-400 mt-2">Start adding books to your "{tabs.find(t => t.key === activeTab)?.label}" list!</p>
        </div>
      )}
    </div>
  );
}