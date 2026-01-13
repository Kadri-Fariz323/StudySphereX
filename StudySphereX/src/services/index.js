import axiosInstance from "../API/axiousInstance";


export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (onProgressCallback && typeof onProgressCallback === 'function') {
        onProgressCallback(percentCompleted);
      }
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function deleteCourseById(courseId) {
  const { data } = await axiosInstance.delete(
    `/instructor/course/delete/${courseId}`
  );

  return data;
}


export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function AddQuizInDB(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/${id}/final-quiz`,
    formData
  );

  return data;
}

// Contact 
export async function saveContactForm(formdata) {
  const { data } = await axiosInstance.post(`/contact`, formdata); // Adjusted route to match standard REST
  return data;
}



