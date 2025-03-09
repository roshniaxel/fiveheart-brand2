"use client";

import { useState, useEffect, useCallback } from "react";

// Define TypeScript interfaces for filters
interface FilterOption {
  url: string;
  raw_value: string;
  values?: { count: number };
}

interface FilterGroup {
  [key: string]: FilterOption[];
}

export default function CourseFilters({
  selectedFilters,
  setSelectedFilters,
}: {
  selectedFilters: string;
  setSelectedFilters: (url: string) => void;
}) {
  const [filters, setFilters] = useState<FilterGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // Fetch filters from API
  const fetchFilters = useCallback(
    async (url: string) => {
      try {
        console.log("🔄 Fetching filters from:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch filters");

        const data = await res.json();
        console.log("✅ Filters API Response:", data.facets);

        setFilters(Array.isArray(data.facets) ? data.facets : []);
        setSelectedFilters(url);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [setSelectedFilters]
  );

  useEffect(() => {
    fetchFilters(selectedFilters);
  }, [fetchFilters, selectedFilters]);

  // Handle filter selection
  const handleFilterChange = (filterUrl: string) => {
    const updatedFilters = selected.includes(filterUrl)
      ? selected.filter((url) => url !== filterUrl)
      : [...selected, filterUrl];

    setSelected(updatedFilters);

    const siteUrl = window.location.host;
    const newApiUrl =
      updatedFilters.length > 0
        ? updatedFilters.join("&")
        : `/api/course-search/${siteUrl}`;

    console.log("🔄 Applying filters:", newApiUrl);
    fetchFilters(newApiUrl);
  };

  // Clear all selected filters
  const clearFilters = () => {
    setSelected([]);
    const siteUrl = window.location.host;
    fetchFilters(`/api/course-search/${siteUrl}`); // Reset to default
  };

  if (error) return <div className="text-red-500">Error loading filters: {error}</div>;

  return (
    <aside className="w-1/4 p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Clear Filters
      </button>

      {filters.length > 0 ? (
        filters.map((filterGroup, index) => {
          if (!filterGroup[0]) return null;

          const entries = Object.entries(filterGroup[0]);
          if (entries.length === 0) return null;

          const [filterType, filterOptions] = entries[0];

          return (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold capitalize">
                {filterType.replace("field_", "").replace("_name", "")}
              </h3>
              <ul>
                {Array.isArray(filterOptions) &&
                  filterOptions.map((option: FilterOption, i: number) => (
                    <li key={i}>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.includes(option.url)}
                          onChange={() => handleFilterChange(option.url)}
                          className="cursor-pointer"
                        />
                        <span className="text-blue-600 hover:underline">
                          {option.raw_value} ({option.values?.count || 0})
                        </span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          );
        })
      ) : (
        <p className="text-gray-600">No filters available.</p>
      )}
    </aside>
  );
}
