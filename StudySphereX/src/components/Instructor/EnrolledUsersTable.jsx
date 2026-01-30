import { Skeleton } from "@/components/UI/skeleton";

export const EnrolledUsersTable = ({ enrolledStudents, loading }) => {
  if (loading) {
    return (
      <div className="w-[380px] sm:w-full overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-48" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-[380px] sm:w-full overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="w-full min-w-[600px] text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3">Student Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Total Paid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {enrolledStudents.length > 0 ? (
            enrolledStudents.map((student, index) => (
              <tr key={student.studentId || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {student.studentName}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {student.studentEmail}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {/* Using .toFixed(2) ensures standard currency formatting */}
                  ${Number(student.totalAmount).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                No enrolled students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
