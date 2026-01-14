"use client";

import { useState } from "react";
import { Book } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { ResponsiveTable, TableColumn } from "@/components/shared/table";
import {
  Edit,
  Trash2,
  UploadCloud,
  X,
  CheckCircle,
  Loader2,
  ImageIcon,
  BookSearch,
} from "lucide-react";

import {
  useCreateBookMutation,
  useDeleteBookMutation,
  useGetAllBooksQuery,
  useUpdateBookMutation,
} from "@/redux/features/book/bookAPi";
import { useGetAllGenresQuery } from "@/redux/features/genres/genreApi";
import Link from "next/link";

export default function AdminBooksPage() {
  // --- RTK Query ---
  const { data: booksData, isLoading: booksLoading } = useGetAllBooksQuery(undefined);
  const { data: genresData } = useGetAllGenresQuery(undefined);
  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  // --- States ---
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfUploadDone, setPdfUploadDone] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    totalPages: "",
    pdfFile: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const books = booksData?.data || [];
  const genres = genresData?.data || [];

  // --- Handlers ---
  
  // Instant Cover Image Preview
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      return toast.error("Please select a valid PDF file");
    }

    setIsPdfUploading(true);
    setPdfUploadDone(false);
    const uploadToast = toast.loading("Uploading PDF...");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "book_preset");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dyfamn6rm/raw/upload`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setFormData((prev) => ({ ...prev, pdfFile: result.secure_url }));
      setPdfUploadDone(true);
      toast.success("PDF Linked!", { id: uploadToast });
    } catch (error) {
      toast.error("PDF upload failed", { id: uploadToast });
    } finally {
      setIsPdfUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pdfFile) return toast.error("Please upload a PDF first");

    const loadingToast = toast.loading(editingBook ? "Updating..." : "Creating...");

    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("author", formData.author);
      submissionData.append("genre", formData.genre);
      submissionData.append("description", formData.description);
      submissionData.append("totalPages", formData.totalPages);
      submissionData.append("pdfFile", formData.pdfFile);

      // IMPORTANT: Ensure the key "coverImage" matches what your backend middleware (Multer) expects
      if (coverFile) {
        submissionData.append("coverImage", coverFile);
      }

      if (editingBook) {
        
        await updateBook({ id: editingBook._id, body: submissionData }).unwrap();
        toast.success("Book updated!", { id: loadingToast });
      } else {
        await createBook(submissionData).unwrap();
        toast.success("Book created!", { id: loadingToast });
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Validation Error: Check all fields", { id: loadingToast });
    }
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: typeof book.genre === "object" ? book.genre._id : (book.genre as string),
      description: book.description,
      totalPages: book.totalPages.toString(),
      pdfFile: book.pdfFile || "",
    });
    setCoverPreview(book.coverImage || null);
    setPdfUploadDone(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setCoverPreview(null);
    setCoverFile(null);
    setPdfUploadDone(false);
    setFormData({ title: "", author: "", genre: "", description: "", totalPages: "", pdfFile: "" });
  };

  const handleDelete = async (id: string) => {

    try {
      await deleteBook(id).unwrap();
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

const columns: TableColumn[] = [
  {
    key: "coverImage",
    label: "Cover",
    render: (row) => (
      <div className="flex justify-center">
        <Image 
          src={row?.coverImage || "/placeholder-book.png"} 
          alt={row.title} 
          width={40} 
          height={55} 
          className="rounded border shadow-sm object-cover" 
        />
      </div>
    ),
  },
  { 
    key: "title", 
    label: "Book Title",
    // Render the title as a Link
    render: (row) => (
      <Link
        href={`/books/${row._id}`} 
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
      >
        {row.title}
      </Link>
    )
  },
  { key: "author", label: "Author" },
];
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Book Inventory</h1>
          <p className="text-gray-500 text-sm">Manage your library's digital collection</p>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-all">
          <UploadCloud size={20} /> Add New Book
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
       <ResponsiveTable 
    columns={columns} 
    data={books} 
    loading={booksLoading} 
    actions={(row: Book) => (
        <div className="flex items-center justify-center gap-2">
            {/* Added View Link */}
            <Link 
                href={`/books/${row._id}`} 
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="View Details"
            >
                <BookSearch size={18} /> {/* Or any "Eye" icon */}
            </Link>

            <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Edit size={18} />
            </button>
            <button onClick={() => handleDelete(row._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={18} />
            </button>
        </div>
    )}
/>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingBook ? "✏️ Edit Book" : "📚 Add New Book"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Cover Image Instant Preview UI */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 group hover:border-blue-400 transition-all">
                {coverPreview ? (
                  <div className="relative w-32 h-44 mb-3">
                    <Image src={coverPreview} alt="Preview" fill className="rounded-lg object-cover shadow-lg border" />
                    <button 
                        type="button"
                        onClick={() => {setCoverFile(null); setCoverPreview(null);}} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 mb-2">
                    <ImageIcon size={48} strokeWidth={1} />
                    <p className="text-xs mt-2">No cover image selected</p>
                  </div>
                )}
                <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                  {coverPreview ? "Change Cover Image" : "Select Cover Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 ml-1">Title</label>
                    <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Book Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 ml-1">Author</label>
                    <input className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Author Name" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 ml-1">Genre</label>
                    <select className="w-full p-2.5 border rounded-lg outline-none" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} required>
                        <option value="">Select Genre</option>
                        {genres.map((g: any) => <option key={g._id} value={g._id}>{g.name}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 ml-1">Total Pages</label>
                    <input type="number" className="w-full p-2.5 border rounded-lg outline-none" placeholder="Pages" value={formData.totalPages} onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Description</label>
                <textarea className="w-full p-2.5 border rounded-lg outline-none resize-none" rows={3} placeholder="Write something about the book..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              {/* PDF Upload */}
              <div className="p-4 border rounded-xl bg-blue-50/50 border-blue-100">
                <label className="text-xs font-bold text-blue-600 uppercase block mb-2">Book PDF Digital Copy</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept=".pdf" className="text-xs w-full file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded-md file:cursor-pointer" onChange={(e) => handlePdfUpload(e.target.files?.[0]!)} />
                  {isPdfUploading && <Loader2 className="animate-spin text-blue-600" size={20} />}
                  {pdfUploadDone && <CheckCircle className="text-green-500" size={20} />}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={isPdfUploading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 shadow-lg active:scale-95 transition-all">
                  {editingBook ? "Update Book Information" : "Save New Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}