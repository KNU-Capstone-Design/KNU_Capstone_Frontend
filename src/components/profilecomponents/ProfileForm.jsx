import { useState, useEffect } from 'react';
import styles from '../SubscribeForm.module.css';
import { subscribeAPI } from '../../api/subscribe.js';
import { usersAPI } from '../../api/users.js';

const fields = ['Android', 'iOS', 'Frontend', 'Backend'];

function ProfileForm({ onCancel }) {
    const [categories, setSelected] = useState([]);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [fieldError, setFieldError] = useState('');

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
    

    const handleSubmit = async() => {
        //console.log(import.meta.env.REACT_APP_BASEURL);
        const isEmailValid = validateEmail(email);
        const isFieldValid = categories.length > 0;
    
        if (!isEmailValid) {
            setEmailError('올바르지 않은 이메일 형식입니다.');
        } else {
            setEmailError('');
        }
    
        if (!isFieldValid) {
            setFieldError('하나 이상의 분야를 선택해야 합니다.');
        } else {
            setFieldError('');
        }
        
    
        if (isEmailValid && isFieldValid) {
            try {
                const response = await usersAPI.users(categories);
        
                if (response.status === 409) {
                    alert(response.data); // 또는 response.data.message 등 응답 구조에 맞게
                } else if (response.status === 500) {
                    alert(response.data);
                } else {
                    alert('정보 변경을 성공했어요!');
                }
        
                console.log('제출!', { email, categories });
                onCancel();
        
            } catch (error) {
                console.error('에러 발생:', error);
                alert('서버 요청 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                {/* 이메일 입력 */}
                <div className={styles.emailContainer}>
                    <label className={styles.emailLabel}>이메일</label>
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
