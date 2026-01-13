"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";

export default function AdminGenresPage() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get("/genres");
      setGenres(response.data.data);
    } catch {
      toast.error("Failed to load genres");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/genres/${editingId}`, formData);
        toast.success("Genre updated");
      } else {
        await api.post("/genres", formData);
        toast.success("Genre created");
      }
      resetForm();
      fetchGenres();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save genre");
    }
  };

  const deleteGenre = async (id: string) => {
    if (!confirm("Delete this genre?")) return;
    try {
      await api.delete(`/genres/${id}`);
      toast.success("Genre deleted");
      fetchGenres();
    } catch {
      toast.error("Failed to delete genre");
    }
  };

  const startEdit = (genre: any) => {
    setEditingId(genre._id);
    setFormData({ name: genre.name, description: genre.description || "" });
    setShowModal(true);
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setShowModal(false);
  };

  // Table Columns
  const columns: TableColumn[] = [
    { key: "name", label: "Genre Name" },
    { key: "description", label: "Description" },
  ];

  const actions = (row: any) => (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => startEdit(row)}
        className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => deleteGenre(row._id)}
        className="text-red-600 hover:text-red-900 font-medium transition-colors"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="px-2 py-8">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col md:flex-row w-full justify-between p-4 gap-4 mb-8 border rounded-lg items-center">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          Manage Genres
        </h1>
        <div className="w-full md:w-auto flex justify-end">
          <button
            onClick={openModal}
            className="btn-primary px-6 py-2 rounded-lg shadow hover:shadow-lg transition-all"
          >
            Add New Genre
          </button>
        </div>
      </div>

      {/* Table */}
      <ResponsiveTable
        columns={columns}
        data={genres}
        actions={actions}
        loading={loading}
      />

      {/* Modal */}
    {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-serif font-semibold text-gray-900">
          {editingId ? "Edit Genre" : "Add New Genre"}
        </h2>
        <button
          onClick={resetForm}
          className="text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter genre name"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder="Optional description"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary-600 px-5 py-2 text-white shadow hover:bg-primary-700 transition"
          >
            {editingId ? "Update Genre" : "Create Genre"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
