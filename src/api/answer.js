import axiosInstance from './axios';  

export const answerAPI = {
  submitAnswer: (questionId, answer) =>
    axiosInstance.post(`/answers/${questionId}`, { answer }), 

  getAnswer: (questionId) =>
    axiosInstance.get(`/answers/reveal/${questionId}`)
};
