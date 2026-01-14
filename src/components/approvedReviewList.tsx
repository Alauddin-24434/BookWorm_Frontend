"use client";

import { useGetApprovedReviewsQuery } from "@/redux/features/reviews/reviewApi";
import { Star, Calendar, Loader2, Quote } from "lucide-react";

export default function ApprovedReviewsList({ bookId }: { bookId: string }) {
  // RTK Query hook to fetch only approved reviews for this specific book
  const { data: reviews = [], isLoading } = useGetApprovedReviewsQuery(bookId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-20 gap-3">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-slate-400 font-medium animate-pulse">Loading community reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <h3 className="text-2xl font-serif font-bold text-slate-900">
          Reader Reviews
        </h3>
        <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
          {reviews.length} Approved
        </span>
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-6">
          {reviews.map((review: any) => (
            <div 
              key={review._id} 
              className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm transition-all hover:shadow-md group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:bg-blue-600 transition-colors">
                    {review.user?.name?.[0] || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{review.user?.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-0.5 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={`${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-50 -z-10" />
                <p className="text-slate-600 leading-relaxed italic relative z-10 pl-2">
                  {/* Slice used to keep UI clean */}
                  "{review.comment.length > 200 ? `${review.comment.slice(0, 200)}...` : review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-medium italic">No approved reviews yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}