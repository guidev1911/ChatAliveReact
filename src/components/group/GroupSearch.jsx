import React from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function GroupSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full my-4 md:my-6 px-4 md:px-0">
      <div className="max-w-5xl w-full">
        <div className="flex items-center w-full md:w-1/3">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar grupos..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition placeholder-gray-400 text-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
