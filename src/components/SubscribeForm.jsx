import { useState, useEffect } from 'react';
import styles from './SubscribeForm.module.css';

const fields = ['Android', 'iOS', 'Frontend', 'Backend'];

function SubscribeForm({ onCancel }) {
    const [selected, setSelected] = useState([]);
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
    

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (email === '') {
            setEmailError('');
        } else if (!validateEmail(email)) {
            setEmailError('올바르지 않은 이메일 형식입니다.');
        } else {
            setEmailError('');
        }
    }, [email]);

    const handleSubmit = () => {
        const isEmailValid = validateEmail(email);
        const isFieldValid = selected.length > 0;
    
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
            alert('면도를 구독하셨습니다! 구독한 메일로 환영 메일을 보냈습니다!');
            console.log('제출!', { email, selected });
            onCancel(); 
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                {/* 이메일 입력 */}
                <div className={styles.emailContainer}>
                    <label className={styles.emailLabel}>이메일</label>
                    <input 
                        className={styles.emailInput}
                        title='이메일'
                        type="email"
                        placeholder='example@google.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <div className={styles.emailError}>{emailError}</div>}
                </div>

                {/* 분야 선택 */}
                <div className={styles.fieldContainer}>
                    <label className={styles.fieldLabel}>분야</label>
                    <div className={styles.fieldSelect}>
                        {fields.map((field) => (
                            <button
                                key={field}
                                className={`${styles.fieldBtn} ${selected.includes(field) ? styles.selected : ''}`}
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

export default SubscribeForm;
