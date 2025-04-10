import axiosInstance from './axios.js';

export const subscribeAPI = {
  subscribe: (email, categories) => 
    axiosInstance.post('/api/subscribe', { email, categories }),
};

