import Image from "next/image";
import Link from "next/link";
import { Book } from "../../types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const genreName = typeof book.genre === "object" ? book.genre.name : "";

  return (
    <Link href={`/books/${book._id}`} className="book-card">
      <div className="aspect-[2/3] relative overflow-hidden">
        <Image
          src={book?.coverImage}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif font-semibold text-lg text-gray-800 line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
            {genreName}
          </span>
          {book.averageRating > 0 && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-700">
                {book.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          Add to Want to Read
        </button>
      </div>
    </Link>
  );
}
