export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'user';
}

export interface Book {
  pdfFile: string;
  pdfUrl: string;
  _id: string;
  title: string;
  author: string;
  genre: Genre;
  description: string;
  coverImage: string;
  totalPages: number;
  averageRating: number;
  totalReviews: number;
  shelfCount: {
    wantToRead: number;
    currentlyReading: number;
    read: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Review {
  _id: string;
  book: string | Book;
  user: User;
  rating: number;
  reviewText: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Shelf {
  _id: string;
  user: string;
  book: Book;
  shelfType: 'wantToRead' | 'currentlyReading' | 'read';
  progress?: {
    pagesRead: number;
    percentage: number;
  };
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  youtubeURL: string;
  youtubeVideoId: string;
  thumbnail?: string;
  addedBy: User;
  createdAt: string;
}
