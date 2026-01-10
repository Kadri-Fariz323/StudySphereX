import { MdEdit, MdDeleteForever } from "react-icons/md";

export const CourseTable = ({ listOfCourses }) => {
  return (
    <div className="w-[380px] sm:w-full overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Course</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Students</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Revenue</th>
            <th className="px-4 py-3 font-medium text-center whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {listOfCourses?.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {course?.title}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {course?.students?.length}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                ${course?.pricing}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <button className="p-1 hover:bg-red-100 rounded-full transition-colors">
                    <MdDeleteForever className="text-xl text-red-500" />
                  </button>

                  <button className="p-1 hover:bg-green-100 rounded-full transition-colors">
                    <MdEdit className="text-xl text-green-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
