import React from 'react';
import styles from './Question.module.css';

function Question({ data }) {
  return (
    <div className={styles.questionBox}>
      <p className={styles.category}>[{data.category}에 관련된 질문이에요!]</p>
      <h2 className={styles.text}>{data.question}</h2>
    </div>
  );
}

export default Question;