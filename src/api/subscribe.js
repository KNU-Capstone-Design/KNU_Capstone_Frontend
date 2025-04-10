import axiosInstance from './axios';

export const subscribeAPI = {
  subscribe: (email, categories) => 
    axiosInstance.post('/api/subscribe', { email, categories }),
};

