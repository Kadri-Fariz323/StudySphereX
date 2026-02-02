import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FetchEnrolledStudents } from "@/services/index";
import { EnrolledUsersTable } from "@/components/Instructor/EnrolledUsersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have shadcn Input
import { RefreshCcw, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const ViewUsers = () => {
  const { auth } = useContext(AuthContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const instructorId = auth?.user?.id || auth?.user?._id;

  // Debounce Logic: Only update search term after user stops typing for 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchEnrolledStudents = useCallback(async () => {
    if (!instructorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Pass page, limit (10), and search term
      const response = await FetchEnrolledStudents(instructorId, page, 10, debouncedSearch);
      
      if (response.success) {
        setEnrolledStudents(response.data);
        // Update total pages from metadata
        if (response.pagination) {
            setTotalPages(response.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    } finally {
      setLoading(false);
    }
  }, [instructorId, page, debouncedSearch]);

  useEffect(() => {
    fetchEnrolledStudents();
  }, [fetchEnrolledStudents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search students..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Refresh Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchEnrolledStudents} 
          disabled={loading}
        >
          <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Syncing...' : 'Refresh'}
        </Button>
      </div>

      <EnrolledUsersTable
        enrolledStudents={enrolledStudents}
        loading={loading}
      />

      {/* Pagination Controls */}
      {!loading && enrolledStudents.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};