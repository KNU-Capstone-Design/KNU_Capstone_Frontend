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
      const questionId = searchParams.get('question');
      
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      try {
        await axiosInstance.post('/auth/verify', { token });
        if (redirect) {
          if(questionId) {
            navigate(`/quiz/${questionId}`, { replace: true });
            return;
          }
          navigate(`/${redirect}`, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Verification failed:', error);
        navigate('/', { replace: true });
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return <div>인증 처리 중...</div>;
};

export default Verify;