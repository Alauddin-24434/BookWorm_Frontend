"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await api.get("/reviews/pending");
      setReviews(response.data.data);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}/approve`);
      toast.success("Review approved");
      fetchPendingReviews();
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted");
      fetchPendingReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };
    // Table Columns
    const columns: TableColumn[] = [
      { key: "name", label: "Genre Name" },
      { key: "description", label: "Description" },
    ];
  
    const actions = (row: any) => (
      <div className="flex items-center space-x-3">
        <button className="text-blue-600 hover:text-blue-900 font-medium transition-colors">
          Edit
        </button>
        <button className="text-red-600 hover:text-red-900 font-medium transition-colors"></button>
      </div>
    );

  return (
    <div className="p-2 py-8">
      <h1 className="text-4xl border rounded-lg px-4 p-2 font-serif font-bold text-gray-900 mb-8">
        Moderate Reviews
      </h1>

      {/* Table */}
      <ResponsiveTable
        columns={columns}
        data={reviews}
        actions={actions}
        loading={loading}
      />
    </div>
  );
}
