import axios from 'axios'

const baseurl = import.meta.env.VITE_API_BASEURL;

const axiosInstance = axios.create({
    baseurl,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export default axiosInstance;
  