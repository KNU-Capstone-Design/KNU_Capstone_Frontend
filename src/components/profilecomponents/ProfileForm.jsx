import { useState, useEffect } from 'react';
import styles from '../SubscribeForm.module.css';
import { subscribeAPI } from '../../api/subscribe.js';
import { usersAPI } from '../../api/users.js';

// API 응답에 맞게 필드 목록 업데이트
const fields = ['Android', 'iOS', 'Frontend', 'Backend'];

// validateEmail 함수 추가 (함수가 없는 경우)
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function ProfileForm({ onCancel }) {
    const [categories, setSelected] = useState([]);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트 마운트 시 사용자 정보 불러오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await usersAPI.getProfile();

                
                // 데이터가 배열 형태로 오는 경우 처리
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    const userData = response.data[0]; // 배열의 첫 번째 요소 사용
                    setEmail(userData.email);
                    setSelected(userData.categories || []);
                    setIsSubscribed(userData.subscriptionStatus);
                } else if (response.data) {
                    // 기존 방식도 지원 (객체로 오는 경우)
                    setEmail(response.data.email);
                    setSelected(response.data.categories || response.data.category || []);
                    setIsSubscribed(response.data.subscriptionStatus);
                }
            } catch (error) {
                console.error('사용자 정보 불러오기 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    const toggleField = (field) => {
        setSelected((prev) => {
            const updated =
                prev.includes(field)
                    ? prev.filter((f) => f !== field)
                    : [...prev, field];
    
            if (updated.length > 0) {
                setFieldError('');
            }
    
            return updated;
        });
    };

    // 구독해지 함수 추가
    const handleUnsubscribe = async () => {
        if (!email || !validateEmail(email)) {
            setEmailError('올바른 이메일 주소를 입력하세요');
            return;
        }

        // 구독 상태 확인
        if (!isSubscribed) {
            alert('이미 구독이 해지된 상태입니다.');
            return;
        }

        // 사용자 확인
        if (window.confirm('정말로 구독을 해지하시겠습니까?')) {
            try {
                await subscribeAPI.unsubscribe(email);
                setIsSubscribed(false);
                alert('구독이 해지되었습니다.');
            } catch (error) {
                console.error('구독 해지 중 오류:', error);
                alert('구독 해지 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSubmit = async() => {
        const isFieldValid = categories.length > 0;
    
        if (!isFieldValid) {
            setFieldError('하나 이상의 분야를 선택해야 합니다.');
            return;
        }
        
        try {
            await usersAPI.updateCategories(categories);
            alert('정보 변경을 성공했어요!');
            onCancel();
        } catch (error) {
            console.error('에러 발생:', error);
            alert('서버 요청 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.overlay}>
                <div className={styles.formContainer}>
                    <p style={{ textAlign: 'center', padding: '20px' }}>정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer} style={{ 
                padding: '30px', 
                maxWidth: '500px',
                margin: '0 auto'
            }}>
                {/* 이메일 레이블과 구독해지 버튼을 같은 줄에 배치 */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '10px',
                    padding: '0 10px'
                }}>
                    <label style={{ fontWeight: '600', fontSize: '16px' }}>이메일</label>
                    <button 
                        style={{ 
                            color: isSubscribed ? 'red' : '#999', 
                            background: 'transparent', 
                            border: 'none', 
                            cursor: isSubscribed ? 'pointer' : 'default', 
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                        onClick={handleUnsubscribe}
                        disabled={!isSubscribed}
                    >
                        구독해지
                    </button>
                </div>
                
                {/* 이메일 값 중앙 정렬로 표시 */}
                <div style={{ 
                    fontSize: '15px',
                    padding: '12px 0',
                    borderBottom: '1px solid #eee',
                    marginBottom: '24px',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    {email}
                </div>

                {/* 분야 선택 */}
                <div className={styles.fieldContainer}>
                    <label className={styles.fieldLabel}>분야</label>
                    <div className={styles.fieldSelect}>
                        {fields.map((field) => (
                            <button
                                key={field}
                                className={`${styles.fieldBtn} ${categories.includes(field) ? styles.categories : ''}`}
                                onClick={() => toggleField(field)}
                            >
                                {field}
                            </button>
                        ))}
                    </div>
                    {fieldError && <div className={styles.fieldError}>{fieldError}</div>}
                </div>

                {/* 확인/취소 버튼 */}
                <div className={styles.buttonContainer}>
                    <button className={styles.checkBtn} onClick={handleSubmit}>확인</button>
                    <button className={styles.cancelBtn} onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileForm;
