// app/books/[id]/page.tsx
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import ShelfActions from "@/components/selfActions";
import ReviewForm from "@/components/reviewFrom";
import ApprovedReviewsList from "@/components/approvedReviewList";

type Params = Promise<{ id: string }>;

async function getBookDetails(id: string) {
  const res = await fetch(
    `https://bokworm-server.vercel.app/api/v1/books/${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function BookDetailsPage({ params }: { params: Params }) {
  const { id } = await params;
  const book = await getBookDetails(id);

  if (!book)
    return (
      <div className="py-20 text-center font-serif text-2xl">
        Book not found
      </div>
    );

  return (
    <div className="bg-[#faf9f6] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 1. Main Hero Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-16 flex flex-col md:flex-row">
          {/* Left: Premium Book Cover Display */}
          <div className="md:w-1/3 bg-slate-50 p-10 flex justify-center border-r border-slate-50">
            <div className="relative w-full max-w-[300px] aspect-[2/3] shadow-2xl rounded-xl overflow-hidden ring-8 ring-white">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-widest uppercase">
                {book.genre?.name || "General"}
              </span>
              <div className="flex items-center text-slate-400 text-sm font-medium">
                <Clock className="w-4 h-4 mr-1" /> {book.totalPages} pages
              </div>
            </div>

            <h1 className="text-5xl font-serif font-bold text-slate-900 leading-tight mb-4">
              {book.title}
            </h1>
            <p className="text-2xl text-slate-500 font-serif italic mb-8">
              by {book.author}
            </p>

            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100">
              <div>
                <p className="text-3xl font-bold text-slate-900 flex items-center gap-1">
                  {book.averageRating?.toFixed(1) || "0.0"}{" "}
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Avg Rating
                </p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {book.totalReviews || 0}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Reviews
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-10 line-clamp-6">
              {book.description}
            </p>

            <ShelfActions bookId={book._id} />
          </div>
        </div>

        {/* 2. Review Section Grid - Fixed Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Review Form - Sticky on desktop */}
          <div className="lg:col-span-4 sticky top-8">
            <ReviewForm bookId={id} />
          </div>

          {/* Approved Reviews List */}
          <div className="lg:col-span-8">
            <ApprovedReviewsList bookId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
