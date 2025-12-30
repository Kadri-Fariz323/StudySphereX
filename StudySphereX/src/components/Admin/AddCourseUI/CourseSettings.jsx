import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseContext } from "../../../context/CourseContext";
import { useContext } from "react";

import { mediaUploadService } from "@/services";

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
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <label htmlFor="Thumbnail">Upload Course Thumbnail</label>
            <input
              onChange={handleImageUploadChange}
              type="file"
              name="Thumbnail"
              accept="image/*"
              className="mb-4"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
