export const CourseSkeleton = () => {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200" />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-5 w-full bg-gray-200 rounded" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />

        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>

        <div className="mt-auto flex justify-between pt-4 border-t">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
