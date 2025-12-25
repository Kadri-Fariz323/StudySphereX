import axiosInstance from "../API/axiousInstance";

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/check-auth", formData);

  return data;
}
