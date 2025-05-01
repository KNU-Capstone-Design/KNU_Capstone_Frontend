import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASEURL;

if (!baseURL) {
  console.error('API URL is not defined in .env file');
}

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 글로벌 에러 핸들링
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Authentication error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else {
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
