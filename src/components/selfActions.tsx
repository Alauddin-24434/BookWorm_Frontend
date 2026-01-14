"use client";

import { useState } from "react";
import { Bookmark, BookOpen, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShelfActions({ bookId }: { bookId: string }) {
  const [loadingShelf, setLoadingShelf] = useState<string | null>(null);

  const addToShelf = async (
    shelfType: "wantToRead" | "currentlyReading" | "read"
  ) => {
    setLoadingShelf(shelfType);
    try {
      const res = await fetch(
        "https://bokworm-server.vercel.app/api/v1/user-library/add-book",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ book: bookId, shelfType }),
        }
      );

      if (!res.ok) throw new Error("Failed to update shelf");

      const label =
        shelfType === "wantToRead"
          ? "Want to Read"
          : shelfType === "currentlyReading"
          ? "Currently Reading"
          : "Read";
      toast.success(`Moved to ${label}`);
    } catch (error) {
      toast.error("Could not update library");
    } finally {
      setLoadingShelf(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 pt-6">
      <button
        disabled={!!loadingShelf}
        onClick={() => addToShelf("wantToRead")}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-100"
      >
        {loadingShelf === "wantToRead" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
        Want to Read
      </button>

      <button
        disabled={!!loadingShelf}
        onClick={() => addToShelf("currentlyReading")}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-green-500 hover:text-green-600 transition-all active:scale-95 disabled:opacity-70"
      >
        {loadingShelf === "currentlyReading" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <BookOpen className="w-5 h-5" />
        )}
        Reading
      </button>

      <button
        disabled={!!loadingShelf}
        onClick={() => addToShelf("read")}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95 disabled:opacity-70"
      >
        {loadingShelf === "read" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CheckCircle className="w-5 h-5" />
        )}
        Finished
      </button>
    </div>
  );
}
