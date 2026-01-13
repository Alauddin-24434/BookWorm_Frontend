'use client';

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { Tutorial } from '../../../types';
import api from '../../../lib/api';

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const response = await api.get('/tutorials');
      setTutorials(response.data.data);
    } catch (error) {
      toast.error('Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
        Book Tutorials & Reviews
      </h1>

      {tutorials.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            No tutorials available yet
          </h3>
          <p className="text-gray-600">Check back later for book reviews and reading tips!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial) => (
            <div key={tutorial._id} className="card overflow-hidden">
              <div className="aspect-video relative">
                <iframe
                  src={`https://www.youtube.com/embed/${tutorial.youtubeVideoId}`}
                  title={tutorial.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif font-semibold text-lg text-gray-800 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                <a
                  href={tutorial.youtubeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
