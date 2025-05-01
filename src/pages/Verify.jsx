import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      const redirect = searchParams.get('redirect') || '';
      
      console.log('Token:', token);
      console.log('Redirect path:', redirect);
      
      if (!token) {
        console.log('No token found, redirecting to home');
        navigate('/', { replace: true });
        return;
      }

      try {
        console.log('Sending verification request...');
        const response = await axiosInstance.post('/auth/verify', { token });
        console.log('Verification response:', response);
        console.log('Redirecting to:', `/${redirect}`);
        navigate(`/${redirect}`, { replace: true });
      } catch (error) {
        console.error('인증 실패:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        navigate('/', { replace: true });
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return <div>인증 처리 중...</div>;
};

export default Verify;