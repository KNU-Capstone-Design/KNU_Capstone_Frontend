import React, { useState, useRef, useEffect } from 'react';
import Question from '../components/quizcomponents/Question';
import InputAnswer from '../components/quizcomponents/InputAnswer';
import Feedback from '../components/quizcomponents/Feedback';
import Answer from '../components/quizcomponents/Answer';
import Navbar from '../components/Navbar';
import { questionAPI } from '../api/question';
import { answerAPI } from '../api/answer';
import { useParams } from 'react-router-dom';
import styles from './Quiz.module.css';

function Quiz() {
  const { questionId } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const feedbackRef = useRef(null);
  const answerRef = useRef(null);

  useEffect(() => {
  
    const loadQuestion = async () => {
      try {
        const res = await questionAPI.question(questionId);
        setQuestionData(res.data); // { question, category }
      } catch (err) {
        console.error('질문 로딩 실패:', err);
      }
    };
    loadQuestion();
  }, [questionId]);

  const handleAnswerSubmit = async (answer) => {
    try {
      const res = await answerAPI.submitAnswer(questionId, answer);
      setUserAnswer(answer);
      setFeedbackData(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('답변 제출 실패:', err);
    }
  };

  const handleShowAnswer = async () => {
    try {
      setShowAnswer(true);
      const res = await answerAPI.getAnswer(questionId);
      // API가 전체 결과를 answer 필드에 JSON 문자열로 보낼 경우 파싱
      const apiData = res.data;
      const parsedData =
        typeof apiData.answer === 'string' &&
        apiData.answer.trim().startsWith('{')
          ? JSON.parse(apiData.answer)
          : apiData;
      setAnswerData(parsedData);

      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('정답 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    if (submitted && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [submitted]);

  return (
    <>
      <Navbar showSubscribe={false} />

      <div className={styles.quizContainer}>
        {/* 질문 */}
        {questionData && (
          <div className={styles.questionRow}>
            <Question data={questionData} />
            {!submitted && !showAnswer && (
              <button className={styles.solutionButton} onClick={handleShowAnswer}>
                모르겠어요
              </button>
            )}
          </div>
        )}

        {/* 사용자 답변 */}
        {submitted && (
          <div className={styles.userAnswerRow}>
            <div className={styles.userAnswerBox}>
              <p><strong>내 답변:</strong></p>
              <p>{userAnswer}</p>
            </div>
            <div className={styles.solutionSpacer} />
          </div>
        )}

        {/* 피드백 */}
        {submitted && feedbackData && (
          <div className={styles.questionRow} ref={feedbackRef}>
            <Feedback feedback={feedbackData} />
            {!showAnswer ? (
              <button className={styles.solutionButton} onClick={handleShowAnswer}>
                정답 보기
              </button>
            ) : (
              <div className={styles.solutionSpacer} />
            )}
          </div>
        )}

        {/* 정답 */}
        {showAnswer && answerData && (
          <div className={styles.questionRow} ref={answerRef}>
            <Answer answerData={answerData} />
           <div className={styles.solutionSpacer} />
           </div>
        )}
      </div>

      <div className={styles.stickyInput}>
        <InputAnswer
          questionId={questionId}
          onSubmitSuccess={handleAnswerSubmit}
          disabled={submitted}
          submitted={submitted}
          onShowSolution={handleShowAnswer}
        />
      </div>
    </>
  );
}

export default Quiz;