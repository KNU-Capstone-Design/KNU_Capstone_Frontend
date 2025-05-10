import React from 'react';
import styles from './Answer.module.css';

function Answer({ answer }) {
  return (
    <div className={styles.answerBox}>
      <h3>정답 및 해설</h3>
      <p>{answer}</p>
    </div>
  );
}

export default Answer;