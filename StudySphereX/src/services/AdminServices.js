import axiosInstance from "../API/axiousInstance";

export const fetchAdminStatsService = async () => {
  const { data } = await axiosInstance.get('/admin/stats');

  return data;
};

export const fetchUsersService = async (page = 1, limit = 10, search = '') => {
  const { data } = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
  return data;
};

export const toggleBlockUserService = async (userId) => {
  const { data } = await axiosInstance.put(`/admin/users/${userId}/block`);
  return data;
};

export const updateContactStatusService = async (id, status) => {
  const { data } = await axiosInstance.put(`/admin/contacts/${id}/status`, { status });
  return data;
};

export const fetchContactsService = async (page = 1, limit = 10, search = '') => {
  const { data } = await axiosInstance.get(`/admin/contacts?page=${page}&limit=${limit}&search=${search}`);
  return data;
};

export const fetchCoursesService = async (page = 1, limit = 10, search = '') => {
  const { data } = await axiosInstance.get(`/admin/courses?page=${page}&limit=${limit}&search=${search}`);
  return data;
};

export const updateCourseApprovalService = async (
  courseId,
  action,
  rejectionReason = null
) => {
  const payload = { action };

  if (action === "reject" && rejectionReason) {
    payload.rejectionReason = rejectionReason;
  }

  const { data } = await axiosInstance.put(
    `/admin/courses/${courseId}/approval`,
    payload
  );

  return data;
};

export const fetchCourseDetailsService = async (id) => {
  const { data } = await axiosInstance.get(`/admin/courses/${id}`);
  return data;
};