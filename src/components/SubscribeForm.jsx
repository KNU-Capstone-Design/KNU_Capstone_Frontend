import {useState} from 'react';
import styles from './Subscribeform.module.css';

const fields = ['Android', 'iOS', 'Frontend', 'Backend'];

function SubscribeForm({ onCancel }) {
    const [selected, setSelected] = useState("none");

    return(
        
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
                        />
                    </div>
                    {/* 분야 선택 */}
                    <div className={styles.fieldContainer}>
                        <label className={styles.fieldLabel}>분야</label>
                        <div className={styles.fieldSelect}>
                            {fields.map((field) => (
                                <button
                                    key={field}
                                    className={` ${styles.fieldBtn} ${selected === field ? 'styles.selected' : ''}`}
                                    onClick={() => setSelected(field)}
                                >
                                    {field}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* 확인/취소 버튼 */}
                    <div className={styles.buttonContainer}>
                        <button className={styles.checkBtn}>확인</button>
                        <button className={styles.cancelBtn}
                        onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
    )
};
export default SubscribeForm