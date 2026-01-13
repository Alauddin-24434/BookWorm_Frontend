'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Book } from '@/types';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { ResponsiveTable, TableColumn } from '@/components/shared/table';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    totalPages: '',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books?limit=100');
      setBooks(res.data.data);
    } catch {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await api.get('/genres');
      setGenres(res.data.data);
    } catch {
      toast.error('Failed to load genres');
    }
  };

  /* ---------------- Modal Logic ---------------- */
  const openCreateModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      genre: '',
      description: '',
      totalPages: '',
    });
    setCoverFile(null);
    setShowModal(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: typeof book.genre === 'object' ? book.genre._id : book.genre,
      description: book.description,
      totalPages: book.totalPages.toString(),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );
    if (coverFile) data.append('coverImage', coverFile);

    try {
      if (editingBook) {
        await api.patch(`/books/${editingBook._id}`, data);
        toast.success('Book updated');
      } else {
        await api.post('/books', data);
        toast.success('Book created');
      }
      closeModal();
      fetchBooks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    }
  };

  /* ---------------- Delete ---------------- */
  const deleteBook = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch {
      toast.error('Failed to delete book');
    }
  };

  /* ---------------- Table ---------------- */
  const columns: TableColumn[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    {
      key: 'genre',
      label: 'Genre',
      render: (row) =>
        typeof row.genre === 'object' ? row.genre.name : '—',
    },
    { key: 'totalPages', label: 'Pages' },
    {
      key: 'coverImageURL',
      label: 'Cover',
      render: (row) => (
        <Image
          src={row.coverImageURL}
          alt={row.title}
          width={40}
          height={60}
          className="rounded"
        />
      ),
    },
  ];

  const actions = (row: Book) => (
    <div className="flex gap-3">
      <button
        onClick={() => openEditModal(row)}
        className="text-blue-600 hover:underline"
      >
        Edit
      </button>
      <button
        onClick={() => deleteBook(row._id)}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="p-2 py-8 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border rounded-lg p-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">
          Manage Books
        </h1>
        <button onClick={openCreateModal} className="btn-primary">
          Add New Book
        </button>
      </div>

      {/* Table */}
      <ResponsiveTable
        columns={columns}
        data={books}
        loading={loading}
        actions={actions}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="input-field"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <input
                className="input-field"
                placeholder="Author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />

              <select
                className="input-field"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                required
              >
                <option value="">Select Genre</option>
                {genres.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <textarea
                className="input-field"
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                type="number"
                className="input-field"
                placeholder="Total Pages"
                value={formData.totalPages}
                onChange={(e) =>
                  setFormData({ ...formData, totalPages: e.target.value })
                }
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
