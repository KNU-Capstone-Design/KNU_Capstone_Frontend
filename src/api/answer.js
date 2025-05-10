import axios from 'axios';

export const answerAPI = {
  submitAnswer: (questionId, answer) =>
    axios.post(`/answers/${questionId}`, { answer }),

  getAnswer: (questionId) =>
    axios.get(`/answers/reveal/${questionId}`)
  
};
