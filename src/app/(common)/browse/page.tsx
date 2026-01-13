"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { Book, Genre } from "../../../types";
import BookCard from "../../../components/books/BookCard";
import toast from "react-hot-toast";

export default function BrowsePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, selectedGenres, sortBy, page]);

  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/genre"); // double slash ঠিক করলাম
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // fetch এর জন্য parse করতে হবে
      setGenres(data.data); // server থেকে আসা data
    } catch (error: any) {
      toast.error("Failed to load genres: " + error.message);
    }
  };

  console.log("Genres", genres);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 12,
        sortBy,
        order: "desc",
      };

      if (search) params.search = search;
      if (selectedGenres.length > 0) params.genre = selectedGenres;

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:5000/api/v1/book?${queryString}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
        
        
      const data = await response.json(); // fetch এর জন্য parse করতে হবে
   
      setBooks(data?.data);
      setTotalPages(data?.pagination?.pages);
    } catch (error) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };
  console.log("Books", books);  

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
        Browse Books
      </h1>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            className="text-gray-900 input-field"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Genre Filters */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genres
          </label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre._id}
                onClick={() => toggleGenre(genre._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenres.includes(genre._id)
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="input-field max-w-xs"
          >
            <option value="createdAt">Latest</option>
            <option value="averageRating">Highest Rated</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            No books found
          </h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border-2 border-primary-500 text-primary-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border-2 border-primary-500 text-primary-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
