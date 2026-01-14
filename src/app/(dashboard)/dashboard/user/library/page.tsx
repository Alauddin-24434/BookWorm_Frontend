// src/app/(dashboard)/dashboard/user/library/page.tsx

import { store } from "@/redux/store";

import { headers } from "next/headers";
import Link from "next/link";
import BookCard from "@/components/books/BookCard";
import { libraryApi } from "@/redux/features/library/libraryApi";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ shelf?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.shelf || "wantToRead";

  // RTK Query initiate function call
  const result = await store.dispatch(
    libraryApi.endpoints.getUserLibrary.initiate(undefined, {
   
      forceRefetch: true,
    })
  );

  const shelves = result.data || [];
  const filteredShelves = shelves.filter((shelf) => shelf.shelfType === activeTab);

  const tabs = [
    { key: "wantToRead", label: "Want to Read", emoji: "📚" },
    { key: "currentlyReading", label: "Currently Reading", emoji: "📖" },
    { key: "read", label: "Read", emoji: "✓" },
  ];

  return (
    <div className="p-4 py-8 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`?shelf=${tab.key}`}
            className={`pb-2 px-4 ${activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            {tab.emoji} {tab.label} ({shelves.filter(s => s.shelfType === tab.key).length})
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredShelves.map((shelf) => (
          <div key={shelf._id}>
            <BookCard book={shelf.book} />
            {/* Progress bar logic if needed */}
          </div>
        ))}
      </div>
    </div>
  );
}