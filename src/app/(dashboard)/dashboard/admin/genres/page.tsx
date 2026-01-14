"use client";
import { Book, Edit, Trash2 } from "lucide-react";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";
import {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useGetAllGenresQuery,
  useUpdateGenreMutation,
} from "@/redux/features/genres/genreApi";

export default function AdminGenresPage() {
  // RTK Query Hooks
  const { data, isLoading } = useGetAllGenresQuery(undefined);
  const [createGenre] = useCreateGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();
  const [deleteGenre] = useDeleteGenreMutation();

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Extract genres from the API response structure
  const genres = data?.data || [];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // unwrap() use kora thik ache, eta promise success ba reject return korbe
        await updateGenre({ id: editingId, body: formData }).unwrap();
        toast.success("Genre updated");
      } else {
        await createGenre(formData).unwrap();
        toast.success("Genre created");
      }
      resetForm();
    } catch (error: any) {
      // RTK Query error structure check kora hochche
      // Sadharonoto error.data.message thake backend theke pathale
      const errorMessage = error?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Mutation Error:", error);
    }
  };

  // const handleDelete = async (id: string) => {

  //   try {
  //     // 4. Use delete mutation
  //     await deleteGenre(id).unwrap();
  //     toast.success("Genre deleted");
  //   } catch {
  //     toast.error("Failed to delete genre");
  //   }
  // };

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

  const columns: TableColumn[] = [{ key: "name", label: "Genre Name" }];

  const actions = (row: any) => (
    <div className="flex items-center justify-center space-x-4">
      {/* Edit Button with Icon */}
      <button
        onClick={() => startEdit(row)}
        className="p-2 rounded-full cursor-pointer text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
        title="Edit Genre"
      >
        <Edit size={18} />
      </button>

      {/* Delete Button with Icon
    <button
      onClick={() => handleDelete(row._id)}
      className="p-2 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
      title="Delete Genre"
    >
      <Trash2 size={18} />
    </button> */}
    </div>
  );
  return (
    <div className="px-2 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {" "}
            Manage Genres
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your library's digital collection
          </p>
        </div>
        <button
          onClick={openModal}
          className="w-full md:w-auto flex items-center cursor-pointer justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-all"
        >
          <Book size={20} /> Add New Genre
        </button>
      </div>

      {/* Table - Loading is now handled by RTK Query */}
      <ResponsiveTable
        columns={columns}
        data={genres}
        actions={actions}
        loading={isLoading}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
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

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
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
                />
              </div>

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

              <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end border-t mt-4">
                {/* Cancel Button - Outline Style */}
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>

                {/* Submit Button - Strong Background */}
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? "Update Genre" : "Create Genre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
