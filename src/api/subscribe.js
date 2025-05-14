import axiosInstance from './axios';

export const subscribeAPI = {
  subscribe: (email, categories) => 
    axiosInstance.post('/subscribe', { email, categories }),
  unsubscribe: (email) =>
    axiosInstance.patch('/subscribe', { email })
};

