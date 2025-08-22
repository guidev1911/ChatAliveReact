// Pagination.jsx
export default function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 0))}
        disabled={page === 0}
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        ◀
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded-md transition ${
            page === i ? "bg-cyan-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
        disabled={page === totalPages - 1}
        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        ▶
      </button>
    </div>
  );
}
    