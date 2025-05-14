import React from 'react';
import styles from './Feedback.module.css';

function Feedback({ feedback }) {
  if (!feedback) return null;

  const { score, strengths, improvements, wrongPoints } = feedback;

  return (
    <div className={styles.feedbackBox}>
      <h3>📊 채점 결과</h3>
      <p><strong>점수:</strong> {score}점</p>

      {strengths.length > 0 && (
        <div>
          <h4>✅ 잘한 점</h4>
          <ul>
            {strengths.map((item, idx) => (
              <li key={`strength-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {improvements.length > 0 && (
        <div>
          <h4>🛠️ 개선할 점</h4>
          <ul>
            {improvements.map((item, idx) => (
              <li key={`improvement-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {wrongPoints.length > 0 && (
        <div>
          <h4>❌ 틀린 부분</h4>
          <ul>
            {wrongPoints.map((item, idx) => (
              <li key={`wrong-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Feedback;