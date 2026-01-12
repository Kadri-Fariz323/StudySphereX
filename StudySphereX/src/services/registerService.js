import axiosInstance from "../API/axiousInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
  });

  return data;
}