import { useLoader } from "@/context/LoaderContext";

export const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex gap-x-2 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>
    </div>
  );
};
