import axiosInstance from './axios';

export const questionAPI = {
  question: (questionId) => 
    axiosInstance.get(`/questions/${questionId}`)
};
