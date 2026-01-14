"use client";

import toast from "react-hot-toast";
import { Check, Trash2, Star, BookOpen } from "lucide-react";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";
import {
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/features/reviews/reviewApi";
import Image from "next/image";

export default function AdminReviewsPage() {
  // RTK Query Hooks
  const { data: reviews = [], isLoading } = useGetPendingReviewsQuery(undefined);
  const [approveReview] = useApproveReviewMutation();
  const [deleteReviewApi] = useDeleteReviewMutation();

  const handleApprove = async (id: string) => {
    const toastId = toast.loading("Approving review...");
    try {
      await approveReview(id).unwrap();
      toast.success("Review approved successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const toastId = toast.loading("Deleting review...");
    try {
      await deleteReviewApi(id).unwrap();
      toast.success("Review deleted successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete", { id: toastId });
    }
  };

  // Table Columns - updated to include book details
  const columns: TableColumn[] = [
    { 
      key: "book", 
      label: "Book Info" 
    },
    { 
      key: "user", 
      label: "Reviewer" 
    },
    { 
      key: "comment", 
      label: "Review Content" 
    },
    { 
      key: "rating", 
      label: "Rating" 
    },
  ];

  // custom action buttons
  const actions = (row: any) => (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => handleApprove(row._id)}
        className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-sm"
      >
        <Check size={16} />
        Approve
      </button>
      <button
        onClick={() => handleDelete(row._id)}
        className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-sm"
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  );

  // This part maps your data to include JSX for complex cells
  const formattedData = reviews.map((review: any) => ({
    ...review,
    book: (
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-14 rounded overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
          <img
            src={review.book?.coverImage}
            alt={review.book?.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm line-clamp-1">
            {review.book?.title}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">
             ID: {review.book?._id.slice(-6)}
          </span>
        </div>
      </div>
    ),
    user: (
      <div className="flex flex-col">
        <span className="font-bold text-gray-700 text-sm">{review.user?.name}</span>
        <span className="text-xs text-gray-400">{review.user?.email}</span>
      </div>
    ),
    rating: (
      <div className="flex items-center gap-1 text-yellow-500 font-bold">
        {review.rating}
        <Star size={14} className="fill-current" />
      </div>
    ),
    comment: (
      <p className="max-w-[280px] text-sm text-gray-600 italic leading-relaxed">
    
          "{review.comment.length > 50 
            ? `${review.comment.slice(0, 50)}...` 
            : review.comment}"
        </p>
    )
  }));

  

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
      
          <h1 className="text-4xl font-serif font-bold text-gray-900 leading-none">
            Review Moderation
          </h1>
          <p className="text-gray-500 mt-3">You have {reviews.length} reviews waiting for approval</p>
        </div>
      </div>

      {/* Table Container with modern styling */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
        <ResponsiveTable
          columns={columns}
          data={formattedData}
          actions={actions}
          loading={isLoading}
        />
        
        {/* Empty State */}
        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-24 bg-gray-50/50">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
               <Check className="text-emerald-500 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-400 mt-1 max-w-xs mx-auto">
              There are no pending reviews in the queue at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}