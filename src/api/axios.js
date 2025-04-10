import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASEURL;

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export default axiosInstance;
  