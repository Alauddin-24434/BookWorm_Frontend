"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2, Video, Plus, X, VideoIcon } from "lucide-react";
import {
  useGetTutorialsQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} from "@/redux/features/tutorials/tutorialApi";

export default function AdminTutorialsPage() {
  // RTK Query Hook
  const { data: response, isLoading } = useGetTutorialsQuery(undefined);
  
  // Extract the array safely
  const tutorials = Array.isArray(response) ? response : (response as any)?.data || [];

  const [createTutorial] = useCreateTutorialMutation();
  const [updateTutorial] = useUpdateTutorialMutation();
  const [deleteTutorialApi] = useDeleteTutorialMutation();

  const [formData, setFormData] = useState({
    title: "",
    youtubeURL: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Function to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? "Updating..." : "Creating..."); // লোডিং টোস্ট শুরু
    
    try {
      if (editingId) {
        await updateTutorial({ id: editingId, body: formData }).unwrap();
        toast.success("Tutorial updated successfully!", { id: toastId }); // আগের লোডিং টোস্টটি আপডেট হবে
      } else {
        await createTutorial(formData).unwrap();
        toast.success("Tutorial added successfully!", { id: toastId });
      }
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", { id: toastId });
    }
  };

  const deleteTutorial = async (id: string) => {
   
    const toastId = toast.loading("Deleting...");
    try {
      await deleteTutorialApi(id).unwrap();
      toast.success("Tutorial deleted permanently", { id: toastId });
    } catch {
      toast.error("Failed to delete tutorial", { id: toastId });
    }
  };



  const startEdit = (tutorial: any) => {
    setEditingId(tutorial._id);
    setFormData({
      title: tutorial.title,
      youtubeURL: tutorial.youtubeURL,
    });
    setShowModal(true);
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({ title: "", youtubeURL: "" });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", youtubeURL: "" });
    setShowModal(false);
  };

  const modalVideoId = getYouTubeId(formData.youtubeURL);

  return (
    <div className="p-2 py-8 ">
      {/* Header */}
     
     <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {" "}
           Manage Tutorials
          </h1>
          <p className="text-gray-500 text-sm">
         Organize and update your video library
          </p>
        </div>
        <button
          onClick={openModal}
          className="w-full md:w-auto flex items-center cursor-pointer justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-all"
        >
          <VideoIcon size={20} />     Add New Tutorial
        </button>
      </div>
      

      {/* Cards Section */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial: any) => {
            const cardVideoId = getYouTubeId(tutorial.youtubeURL);
            return (
              <div 
                key={tutorial._id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* YouTube Embed */}
                <div className="aspect-video bg-gray-900 relative">
                  {cardVideoId ? (
                    <iframe
                      className="w-full h-full absolute inset-0"
                      src={`https://www.youtube.com/embed/${cardVideoId}`}
                      title={tutorial.title}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 italic text-sm">
                      Invalid YouTube Link
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  <h3 className="font-bold text-xl text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {tutorial.title}
                  </h3>
                </div>

                {/* Awesome Action Buttons */}
                <div className="p-4 bg-gray-50/50 flex items-center gap-3 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(tutorial)}
                    className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTutorial(tutorial._id)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tutorials.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Video className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 font-medium">No tutorials found. Start by adding one!</p>
        </div>
      )}

      {/* Modal Section (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center border-b px-8 py-5 bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Tutorial" : "New Tutorial"}
              </h2>
              <button 
                onClick={resetForm} 
                className="p-2 bg-gray-200 rounded-full text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Tutorial Title</label>
                    <input
                      value={formData.title}
                      placeholder="Enter title..."
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">YouTube Video URL</label>
                    <input
                      value={formData.youtubeURL}
                      placeholder="Paste link here..."
                      onChange={(e) => setFormData({ ...formData, youtubeURL: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 block mb-2">Video Preview</label>
                  <div className="flex-1 min-h-[180px] bg-gray-900 rounded-2xl overflow-hidden relative border-4 border-gray-100 shadow-inner">
                    {modalVideoId ? (
                      <iframe
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${modalVideoId}`}
                        title="Preview"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                        <Video size={32} />
                        <span className="text-xs font-medium">Awaiting valid link...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-8 py-3 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 cursor-pointer text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  {editingId ? "Save Changes" : "Create Tutorial"}
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