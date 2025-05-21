import axiosInstance from './axios';

export const activitiesAPI = {
  // 활동 목록 조회 (페이지네이션 포함)
  getActivities: (page, limit) =>
    axiosInstance.get(`/activities?page=${page}&limit=${limit}`),
  
  // 특정 활동 상세 조회 
  getActivityDetail: (activityId) =>
    axiosInstance.get(`/activities/${questionId}`),
  
};