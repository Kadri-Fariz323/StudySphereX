import axiosInstance from "../API/axiousInstance";

export const fetchAdminStatsService = async () => {
  const { data } = await axiosInstance.get('/admin/stats');

  return data;
};

