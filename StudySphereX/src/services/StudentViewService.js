import axiosInstance from "../API/axiousInstance";

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
} 

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export async function submitQuizService(userId, courseId, quizId, answers) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/quiz/submit`,
    {
      userId,
      courseId,
      quizId,
      answers,
    }
  );

  return data;
}


export const unlockCertificateService = async (userId, courseId) => {
  // ✅ FIXED: Added "-progress" to match server.js
  const { data } = await axiosInstance.post('/student/course-progress/certificate/unlock', {
    userId,
    courseId,
    certificateId: `${userId}-${courseId}` 
  });
  
  return data; 
};

export const fetchStudentCertificatesService = async (userId) => {
  const { data } = await axiosInstance.get(`/student/course-progress/certificates/${userId}`);

  return data;
};

export const fetchStudentStatsService = async (studentId) => {
  const { data } = await axiosInstance.get(`/student/course/stats/${studentId}`);

  return data;
};

export const fetchTechNewsService = async (category) => {
  const { data } = await axiosInstance.get(
    `/api/news/tech-news`,
    { params: { category } }
  );
  return data;
};
