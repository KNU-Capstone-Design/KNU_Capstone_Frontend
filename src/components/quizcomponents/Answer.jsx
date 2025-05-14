import React from 'react';
import styles from './Answer.module.css';

function Answer({ answerData }) {
  if (!answerData) return null;

  return (
    <div className={styles.revealWrapper}>
      <h2>💡 정답</h2>
      <p>{answerData.answer}</p>

      {answerData.explanation && (
        <>
          <h3>📝 설명</h3>
          <p>{answerData.explanation}</p>
        </>
      )}

      {answerData.examples && answerData.examples.length > 0 && (
        <>
          <h3>📚 예시</h3>
          <ul>
            {answerData.examples.map((ex, idx) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        </>
      )}

      {answerData.notes && answerData.notes.length > 0 && (
        <>
          <h3>🔖 추가 노트</h3>
          <ul>
            {answerData.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Answer;