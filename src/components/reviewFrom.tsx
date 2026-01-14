"use client";

import { useState } from "react";
import { Star, Send, Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAddReviewMutation } from "@/redux/features/reviews/reviewApi";

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  

  const [addReview, { isLoading: submitting }] = useAddReviewMutation();

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.length < 10) {
      return toast.error("Comment must be at least 10 characters");
    }

    try {
      await addReview({ 
        
        book: bookId,
        rating, 
        comment 
      }).unwrap();

      toast.success("Review sent for approval!");
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not post review");
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900">Write a Review</h2>
      </div>

      <form onSubmit={submitReview} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
            Overall Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={submitting}
                className="transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? "text-yellow-400 fill-current" : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
            Your Thoughts
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 text-slate-700 placeholder-slate-400 resize-none min-h-[160px] transition-all outline-none disabled:opacity-50"
            placeholder="What did you love or hate about this book?"
            required
          />
          {/* Character Count */}
          <div className="absolute bottom-4 right-5 text-[10px] font-bold text-slate-300">
            {comment.length} characters
          </div>
        </div>

        <button
          disabled={submitting || comment.length < 10}
          type="submit"
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}