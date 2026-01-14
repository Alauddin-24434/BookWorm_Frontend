// app/browse/page.tsx
import { Book, Genre } from "@/types";
import BookCard from "@/components/books/BookCard";
import SearchHeader from "@/components/sideBarHeader";
import FilterSidebar from "@/components/filterSideBar";

async function getGenres(): Promise<Genre[]> {
  const res = await fetch("https://bokworm-server.vercel.app/api/v1/genre", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data.data || [];
}

async function getBooks(
  searchParams: any
): Promise<{ data: Book[]; pagination: any }> {
  const urlParams = new URLSearchParams();

  // Iterate over the object and append values correctly
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // If it's an array (like genres), append each item with the same key
      // This results in: ?genre=fiction&genre=horror
      value.forEach((v) => urlParams.append(key, v));
    } else if (value !== undefined && value !== null && value !== "") {
      // For single values (search, page, sortBy)
      urlParams.set(key, String(value));
    }
  });

  const res = await fetch(
    `https://bokworm-server.vercel.app/api/v1/books?${urlParams.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: any;
}) {
  const genres = await getGenres();
  const { data: books, pagination } = await getBooks(searchParams);

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <SearchHeader initialSearch={searchParams.search || ""} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Client-side Sidebar for interactivity */}
          <aside className="lg:col-span-1">
            <FilterSidebar
              genres={genres}
              selectedGenres={searchParams.genre || ""}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {books?.map((book: Book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination UI */}
            {pagination?.pages > 1 && (
              <div className="mt-12 flex justify-center gap-4">
                {/* Link-based pagination for SEO */}
                <a
                  href={`?page=${Math.max(
                    1,
                    Number(searchParams.page || 1) - 1
                  )}`}
                  className="p-3 border rounded-xl bg-white"
                >
                  Prev
                </a>
                <span className="p-3 font-bold">
                  {searchParams.page || 1} of {pagination.pages}
                </span>
                <a
                  href={`?page=${Math.min(
                    pagination.pages,
                    Number(searchParams.page || 1) + 1
                  )}`}
                  className="p-3 border rounded-xl bg-white"
                >
                  Next
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
