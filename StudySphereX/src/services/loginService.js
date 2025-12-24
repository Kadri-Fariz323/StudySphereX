import axiosInstance from "../API/axiousInstance";

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}
