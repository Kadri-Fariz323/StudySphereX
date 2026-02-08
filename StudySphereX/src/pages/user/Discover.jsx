import { Card } from "@/components/UI/Card";
import { fetchTechNewsService } from "@/services/StudentViewService";
import { useEffect, useState } from "react";

export const Discover = () => {
  const [newsList, setNewsList] = useState([]);

  async function getNews() {
    try {
      const res = await fetchTechNewsService();
      setNewsList(res.data || []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50/50 min-h-screen">
      <div className="mb-8 border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>🚀</span> Discover Tech Trends
        </h2>
        <p className="text-gray-500 text-sm mt-1">Stay updated with the latest in software and skills.</p>
      </div>

      <div className="grid gap-6">
        {newsList.map((item, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden bg-white border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-300"
          >
            {/* Source and Date Row */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                {item.source}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {new Date(item.publishedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 leading-tight transition-colors">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                {item.title}
              </a>
            </h3>

            {/* Controlled Description: We keep it to exactly 2 lines to prevent UI breaking */}
            {item.description && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2 italic opacity-80">
                {item.description.replace(/<[^>]*>?/gm, '')} {/* Strip HTML tags if any */}
              </p>
            )}

            {/* Footer hint */}
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Read Article <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Card>
        ))}

        {newsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-400 font-medium">Curating your feed...</p>
          </div>
        )}
      </div>
    </div>
  );
};