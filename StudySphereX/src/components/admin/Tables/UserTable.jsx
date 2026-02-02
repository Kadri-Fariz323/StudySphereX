import React, { useEffect, useState } from "react";
import { Search, Shield, Ban, CheckCircle } from "lucide-react";
import { fetchUsersService, toggleBlockUserService } from "@/services/AdminServices";

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsersService(page, 10, search);
      if (response.success) {
        setUsers(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      // Optimistic UI Update (Instant feedback before API responds)
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));

      await toggleBlockUserService(userId);
      // Optional: Show success toast here
    } catch (error) {
      // Revert if API fails
      console.error("Failed to update status", error);
      loadUsers(); 
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'instructor' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="w-3 h-3"/> : <Ban className="w-3 h-3"/>}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(user._id, user.status)}
                      className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                        user.status === 'active' 
                          ? 'border-red-200 text-red-600 hover:bg-red-50' 
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};