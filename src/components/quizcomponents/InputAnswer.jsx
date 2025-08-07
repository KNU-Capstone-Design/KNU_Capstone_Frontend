import React, { useRef, useState, useEffect } from 'react';
import styles from './InputAnswer.module.css';

function InputAnswer({ onSubmitSuccess, disabled }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [answer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    try {
      setLoading(true);
      await onSubmitSuccess(answer);
      setAnswer('');
      setSubmitted(true);
    } catch (error) {
      setError('답변 제출 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  // 제출 완료 시 컴포넌트 숨기기
  if (submitted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.answerForm}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={answer}
          disabled={disabled || loading}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="답변을 입력하세요"
          className={styles.input}
          rows={1}
        />

        <button
          type="submit"
          className={styles.sendButton}
          disabled={disabled || loading}
        >
          ⬆︎
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default InputAnswer;