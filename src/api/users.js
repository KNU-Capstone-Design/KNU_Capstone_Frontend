import axiosInstance from './axios';

export const usersAPI = {
  users: (categories) => 
    axiosInstance.patch('/api/users', { categories }),
};

