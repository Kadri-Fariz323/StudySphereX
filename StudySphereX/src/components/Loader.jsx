
import { useLoader } from "@/context/LoaderContext";

export const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm transition-opacity">
      <div className="flex gap-x-2 p-4 bg-white rounded-lg shadow-lg">
        <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
        {/* Added animation delay for wave effect */}
        <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
    </div>
  );
};