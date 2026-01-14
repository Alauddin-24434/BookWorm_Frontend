'use client';

import { Video, Youtube, ExternalLink } from 'lucide-react';
import { useGetTutorialsQuery } from '@/redux/features/tutorials/tutorialApi';

export default function TutorialsPage() {
  // RTK Query Hook
  const { data: response, isLoading, isError } = useGetTutorialsQuery(undefined);
  
  // Safe extraction of the tutorial array
  const tutorials = Array.isArray(response) ? response : (response as any)?.data || [];

  // Helper to extract ID for the iframe
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Fetching latest tutorials...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load tutorials. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Book Tutorials & Reviews
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Enhance your reading experience with our curated video guides, book summaries, and expert reviews.
        </p>
      </div>

      {tutorials.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Video className="text-gray-300" size={40} />
          </div>
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
            No tutorials available yet
          </h3>
          <p className="text-gray-500">Check back later for book reviews and reading tips!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial: any) => {
            const videoId = getYouTubeId(tutorial.youtubeURL);
            
            return (
              <div 
                key={tutorial._id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
              >
                {/* Video Player */}
                <div className="aspect-video bg-black relative">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={tutorial.title}
                      className="w-full h-full absolute inset-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                      Video unavailable
                    </div>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-100 text-red-600 p-1.5 rounded-lg">
                      <Youtube size={16} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      YouTube Tutorial
                    </span>
                  </div>
                  
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {tutorial.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {tutorial.description || "Learn more about this book through our detailed video guide covering key themes and character analysis."}
                  </p>

                  <a
                    href={tutorial.youtubeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm group/link"
                  >
                    Watch on YouTube 
                    <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}