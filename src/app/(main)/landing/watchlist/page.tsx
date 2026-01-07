import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Token | Watchlist",
  description: "Your saved videos",
};

const watchlist = [
  {
    id: 1,
    title: "Intro to Web3",
    duration: "12:45",
    thumbnail: "https://via.placeholder.com/300x180",
  },
  {
    id: 2,
    title: "Solana Deep Dive",
    duration: "18:20",
    thumbnail: "https://via.placeholder.com/300x180",
  },
  {
    id: 3,
    title: "Tokenomics Explained",
    duration: "10:05",
    thumbnail: "https://via.placeholder.com/300x180",
  },
];

export default function Page() {
  return (
    <div className="relative z-10 px-6 pt-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Watchlist</h1>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            Refresh
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
            Add Video
          </button>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.map((video) => (
          <div
            key={video.id}
            className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="font-semibold text-lg mb-1">
                {video.title}
              </h2>
              <p className="text-sm text-gray-300 mb-4">
                Duration: {video.duration}
              </p>

              <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition">
                  Watch
                </button>
                <button className="flex-1 py-2 rounded-lg bg-red-600/80 hover:bg-red-700 transition">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state (optional) */}
      {watchlist.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          Your watchlist is empty 📭
        </div>
      )}
    </div>
  );
}

