import axiosInstance from './axios';

export const usersAPI = {
  updateCategories: (category) => 
    axiosInstance.patch('/users', { category }),
  
  getProfile: () =>
    axiosInstance.get('/users')
};

