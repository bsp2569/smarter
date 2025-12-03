"use client";

import { useState } from "react";

type SearchResult = {
  text: string;
  html: string;
  score: number;
  tag?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!url || !query) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch("http://127.0.0.1:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, query }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResults(data.results || []);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to reach backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 ">
      
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Website Content Search
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Search through website content with precision.
        </p>

        <div className="space-y-3 text-black">
          <input
            type="text"
            placeholder="Enter website URL"
            className="w-full p-2 border rounded-lg text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter your search query"
            className="w-full p-2 border rounded-lg text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        {results.length > 0 && (
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Search Results
          </h2>
        )}

        {results.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 mb-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-semibold text-gray-900">
                {item.text.length > 140
                  ? item.text.slice(0, 140) + "..."
                  : item.text}
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                {item.score ? `${(1 - item.score) * 100 | 0}% match` : "Match"}
              </span>
            </div>

            {item.tag && (
              <p className="text-xs text-black mb-2">
                Element: <span className="font-mono">{`<${item.tag}>`}</span>
              </p>
            )}

      
            <div className="text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto">
              <details>
              <summary>View HTML</summary>
              <pre><code>{item.html}</code></pre>
            </details>
            </div>

            

          </div>
        ))}

        {!loading && results.length === 0 && !error && (
          <p className="text-center text-gray-500 text-sm mt-8">
            No results yet. Try searching a page.
          </p>
        )}
      </div>
    </div>
  );
}