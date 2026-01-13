'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ResponsiveTable, TableColumn } from '@/components/shared/table';

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeURL: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const res = await api.get('/tutorials');
      setTutorials(res.data.data);
    } catch {
      toast.error('Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.patch(`/tutorials/${editingId}`, formData);
        toast.success('Tutorial updated');
      } else {
        await api.post('/tutorials', formData);
        toast.success('Tutorial added');
      }
      resetForm();
      fetchTutorials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save tutorial');
    }
  };

  const deleteTutorial = async (id: string) => {
    if (!confirm('Delete this tutorial?')) return;

    try {
      await api.delete(`/tutorials/${id}`);
      toast.success('Tutorial deleted');
      fetchTutorials();
    } catch {
      toast.error('Failed to delete tutorial');
    }
  };

  const startEdit = (tutorial: any) => {
    setEditingId(tutorial._id);
    setFormData({
      title: tutorial.title,
      description: tutorial.description,
      youtubeURL: tutorial.youtubeURL,
    });
    setShowModal(true);
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', youtubeURL: '' });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', youtubeURL: '' });
    setShowModal(false);
  };

  /* Table */
  const columns: TableColumn[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'youtubeURL', label: 'YouTube URL' },
  ];

  const actions = (row: any) => (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => startEdit(row)}
        className="text-blue-600 hover:text-blue-900 font-medium"
      >
        Edit
      </button>
      <button
        onClick={() => deleteTutorial(row._id)}
        className="text-red-600 hover:text-red-900 font-medium"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="px-2 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border rounded-lg p-4">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          Manage Tutorials
        </h1>
        <button
          onClick={openModal}
          className="btn-primary px-6 py-2 rounded-lg shadow"
        >
          Add New Tutorial
        </button>
      </div>

      {/* Table */}
      <ResponsiveTable
        columns={columns}
        data={tutorials}
        actions={actions}
        loading={loading}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-serif font-semibold">
                {editingId ? 'Edit Tutorial' : 'Add Tutorial'}
              </h2>
              <button onClick={resetForm} className="text-xl text-gray-400">
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium">YouTube URL</label>
                <input
                  value={formData.youtubeURL}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeURL: e.target.value })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-5 py-2 rounded-lg"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
