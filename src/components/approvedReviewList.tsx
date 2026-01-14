"use client";

import { useGetApprovedReviewsQuery } from "@/redux/features/reviews/reviewApi";
import { Star, Calendar, Loader2, Quote, User } from "lucide-react";

interface ApprovedReviewsListProps {
  bookId: string;
}

export default function ApprovedReviewsList({ bookId }: ApprovedReviewsListProps) {
  // RTK Query hook to fetch reviews
  const { data: reviews, isLoading } = useGetApprovedReviewsQuery(bookId);

  // Console log for debugging
  console.log("Reviews Data:", reviews);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-20 gap-3">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-slate-400 font-medium animate-pulse font-serif">
          Loading community reviews...
        </p>
      </div>
    );
  }

  // Handling different API response structures (reviews or reviews.data)
  const reviewList = reviews?.data || reviews || [];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <h3 className="text-3xl font-serif font-bold text-slate-900">
          Reader Reviews
        </h3>
        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-blue-100 uppercase tracking-widest">
          {reviewList.length} Approved
        </span>
      </div>

      {reviewList.length > 0 ? (
        <div className="grid gap-8">
          {reviewList.map((review: any) => (
            <div 
              key={review._id} 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/50 group"
            >
              {/* Reviewer Info & Rating */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-5 mb-8">
                <div className="flex items-center gap-4">
                  {/* Profile Photo / Avatar Logic */}
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:bg-blue-600 transition-all duration-500 overflow-hidden relative ring-4 ring-slate-50">
                    {review.user?.profilePhoto ? (
                      <img
                        src={review.user.profilePhoto}
                        alt={review.user.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <span className="relative z-10">
                        {review.user?.name?.[0]?.toUpperCase() || <User size={24} />}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-lg capitalize leading-none mb-2">
                      {review.user?.name || "Anonymous Reader"}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                      <Calendar size={12} className="text-blue-400" />
                      {review.createdAt 
                        ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : "Recent"}
                    </p>
                  </div>
                </div>
                
                {/* Rating Stars */}
                <div className="flex gap-1 bg-yellow-50/50 px-4 py-2 rounded-2xl border border-yellow-100/50 shadow-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={`${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                      } transition-colors`} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Review Content */}
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-10 h-10 text-slate-50 -z-10 transition-colors group-hover:text-blue-50" />
                <p className="text-slate-600 text-lg leading-relaxed italic relative z-10 pl-2 break-words">
                  "{review.comment.length > 250 
                    ? `${review.comment.slice(0, 250)}...` 
                    : review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
            <Quote className="w-10 h-10 text-slate-200" />
          </div>
          <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">No reviews yet</h4>
          <p className="text-slate-400 font-medium italic max-w-xs mx-auto">
            This book is waiting for its first community feedback. Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
}