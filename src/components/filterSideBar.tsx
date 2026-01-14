"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Genre } from "@/types";
import { SlidersHorizontal, Check } from "lucide-react";

interface FilterSidebarProps {
  genres: Genre[];
  selectedGenres: string | string[]; // From URL searchParams
}

export default function FilterSidebar({ genres, selectedGenres }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Convert string or array from URL to a consistent array
  const activeGenres = Array.isArray(selectedGenres) 
    ? selectedGenres 
    : selectedGenres ? [selectedGenres] : [];

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === "genre") {
      const current = params.getAll("genre");
      if (current.includes(value)) {
        const filtered = current.filter(id => id !== value);
        params.delete("genre");
        filtered.forEach(id => params.append("genre", id));
      } else {
        params.append("genre", value);
      }
    } else {
      params.set(key, value);
    }
    
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => router.push("/browse");

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-8 sticky top-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-widest text-[10px]">
          <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
        </div>
        <button onClick={clearAll} className="text-[10px] font-bold text-blue-600 uppercase hover:text-blue-700">
          Reset
        </button>
      </div>

      {/* Sort By Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4">Sort By</h3>
        <select
          onChange={(e) => updateFilters("sortBy", e.target.value)}
          value={searchParams.get("sortBy") || "createdAt"}
          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-100"
        >
          <option value="createdAt">Recently Added</option>
          <option value="averageRating">Highest Rated</option>
          <option value="title">Alphabetical (A-Z)</option>
        </select>
      </div>

      <hr className="border-slate-50" />

      {/* Genres Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-4">Genres</h3>
        <div className="flex flex-col gap-2">
          {genres.map((genre) => {
            const isSelected = activeGenres.includes(genre._id);
            return (
              <button
                key={genre._id}
                onClick={() => updateFilters("genre", genre._id)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isSelected 
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-100" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {genre.name}
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}