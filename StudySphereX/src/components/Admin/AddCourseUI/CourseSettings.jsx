import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseContext } from "../../../context/CourseContext";
import { useContext } from "react";

import { mediaUploadService } from "@/services";

import { FiUploadCloud, FiImage, FiTrash2 } from 'react-icons/fi';



export const CourseSettings = () => {
  
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(CourseContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        const res = await mediaUploadService(imageFormData);
        if (res.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: res.data.url,
          });

        }
      } catch (error) {
        console.log(error);
      }
    }
    
  }

 return (
    <Card className="w-full border-gray-200 shadow-sm overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-xl font-semibold text-indigo-950">
          Course Media
        </CardTitle>
        <p className="text-sm text-gray-500">
          Upload the thumbnail that will be displayed on your course card.
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {courseLandingFormData?.image ? (
          // --- Image Preview State ---
          <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            <div className="relative group w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <img
                src={courseLandingFormData.image}
                alt="Course Thumbnail"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <label 
                  htmlFor="change-image" 
                  className="cursor-pointer flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg font-medium text-sm"
                >
                  <FiImage className="w-4 h-4" /> Change
                </label>
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors shadow-lg font-medium text-sm"
                >
                  <FiTrash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400">
              Hover over the image to change or remove it.
            </p>
            
            {/* Hidden input for the "Change" button in overlay */}
            <input
              id="change-image"
              type="file"
              accept="image/*"
              onChange={handleImageUploadChange}
              className="hidden"
            />
          </div>
        ) : (
          // --- Upload State ---
          <div className="w-full">
            <label
              htmlFor="Thumbnail"
              className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FiUploadCloud className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="mb-2 text-sm font-semibold text-indigo-900">
                  Click to upload <span className="text-indigo-600 font-normal">or drag and drop</span>
                </p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  SVG, PNG, JPG or GIF (Recommended 1200x630px)
                </p>
              </div>
              <input
                id="Thumbnail"
                type="file"
                name="Thumbnail"
                accept="image/*"
                onChange={handleImageUploadChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
