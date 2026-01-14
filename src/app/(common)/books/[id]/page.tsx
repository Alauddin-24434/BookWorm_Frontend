"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Book as BookType, Review as ReviewType } from "../../../../types";
import Image from "next/image";
import toast from "react-hot-toast";

export default function BookDetailsPage() {
  const params = useParams();
  const [book, setBook] = useState<BookType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) fetchBookDetails();
  }, [params.id]);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/books/${params.id}`
      );
      const data = await response.json();
      setBook(data?.data);
      setReviews(data.data.reviews || []);
    } catch {
      toast.error("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book._id, rating, reviewText }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      toast.success("Review submitted for approval!");
      setReviewText("");
      setRating(5);

      // Optionally refresh reviews
      fetchBookDetails();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };
 const user = "6965e7f5eeeeab78d5620286";
  const addToShelf = async (
    shelfType: "wantToRead" | "currentlyReading" | "read"
  ) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/user-library/add-book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({user, book: book?._id, shelfType }),
        }
      );
      if (!res.ok) throw new Error("Failed to add to shelf");
      toast.success(
        `Added to ${
          shelfType === "wantToRead"
            ? "Want to Read"
            : shelfType === "currentlyReading"
            ? "Currently Reading"
            : "Read"
        } shelf`
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );

  if (!book) return <div className="text-center py-12">Book not found</div>;

  const genreName = typeof book.genre === "object" ? book.genre.name : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Book Info */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative rounded-xl shadow-lg overflow-hidden">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            {book.title}
          </h1>
          <p className="text-xl text-gray-600">by {book.author}</p>

          <div className="flex flex-wrap items-center gap-4">
            {genreName && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {genreName}
              </span>
            )}
            {book.averageRating > 0 && (
              <div className="flex items-center space-x-1 text-sm">
                <svg
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="font-semibold">
                  {book.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({book.totalReviews} reviews)
                </span>
              </div>
            )}
            <span className="text-gray-600">{book.totalPages} pages</span>
          </div>

          <p className="text-gray-700 leading-relaxed">{book.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => addToShelf("wantToRead")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Want to Read
            </button>
            <button
              onClick={() => addToShelf("currentlyReading")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Currently Reading
            </button>
            <button
              onClick={() => addToShelf("read")}
              className="px-4 py-2 border border-gray-400 text-gray-800 rounded-md hover:bg-gray-100 transition"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          Write a Review
        </h2>
        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 resize-none"
              rows={4}
              placeholder="Share your thoughts about this book..."
              required
              minLength={10}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
          Reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white shadow rounded-lg p-4 flex space-x-4"
              >
                <Image
                  src={review.user.photoURL || "/placeholder-avatar.png"}
                  alt={review.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {review.user.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
