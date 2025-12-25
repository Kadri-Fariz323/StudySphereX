import { Card, CardContent, CardHeader, CardTitle } from "../../components/UI/Card";
import { CourseTable } from "@/components/UI/CourseTable";
export const AddCourse = () => {
  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <button className="p-6">Create a New Course</button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto ">
          <CourseTable />
        </div>
      </CardContent>
    </Card>
  );
};
