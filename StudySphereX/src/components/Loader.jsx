// components/GlobalLoader.jsx
import { useLoader } from "@/context/LoaderContext";

export const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="flex gap-x-2">
        <div className="w-5 h-5 bg-[#d991c2] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};
