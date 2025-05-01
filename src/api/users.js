import axiosInstance from './axios';

export const usersAPI = {
  updateCategories: (categories) => 
    axiosInstance.patch('/users', { categories }),
  
  getProfile: () =>
    axiosInstance.get('/users')
};

