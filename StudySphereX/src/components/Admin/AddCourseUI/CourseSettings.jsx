import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CourseSettings = () => {
  return (
    <Card>
         <CardHeader>
          <CardTitle>Course Settings</CardTitle>
         </CardHeader>
         <CardContent>
          <div className="flex flex-col gap-3">
            <label htmlFor="Thumbnail">Upload Course Thumbnail</label>
            <input type="file" name="Thumbnail" accept="image/*" className="mb-4" />
          </div>
         </CardContent>
    </Card>
  )
}
