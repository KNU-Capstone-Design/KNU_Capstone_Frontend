import React, { useState, useEffect } from 'react';
import styles from './QuizPopup.module.css';
import { activitiesAPI } from '../../api/activities';
import { answerAPI } from '../../api/answer';

const QuizPopup = ({ question, onClose }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  
  // 팝업이 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // API에서 상세 데이터 가져오기
  useEffect(() => {
    const fetchDetailData = async () => {
      if (!question || !question.id) return;
      
      setLoading(true);
      try {
        const response = await activitiesAPI.getActivityDetail(question.id);
        setDetailData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("상세 정보를 불러오는 중 오류가 발생했습니다:", err);
        setError("데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [question]);

  // 정답 버튼 클릭 시 정답 데이터 가져오기
  useEffect(() => {
    if (!showAnswer || !question || !question.id) return;

    // 이미 상세 데이터에 정답이 있으면 추가 API 호출 필요 없음
    if (detailData && detailData.answer && detailData.answer.answer) return;

    const fetchAnswerData = async () => {
      setLoadingAnswer(true);
      try {
        console.log("정답 데이터 요청:", question.qid);
        const response = await answerAPI.getAnswer(question.qid);
        
        // API 응답 구조 변환 (example 문자열을 examples 배열로 변환)
        const formattedAnswer = {
          answer: response.data.answer || "",
          explanation: response.data.explanation || "",
          examples: response.data.example ? [response.data.example] : [],
          notes: response.data.notes ? response.data.notes.split(". ").filter(note => note.trim()) : []
        };
        
        setAnswerData(formattedAnswer);
        setLoadingAnswer(false);
      } catch (err) {
        console.error("정답 정보를 불러오는 중 오류가 발생했습니다:", err);
        setLoadingAnswer(false);
      }
    };

    fetchAnswerData();
  }, [showAnswer, question, detailData]);

  // API 응답을 컴포넌트에서 사용하는 형식으로 매핑
  const mapFeedbackData = () => {
    if (!detailData || !detailData.feedback) {
      return {
        score: question.score || 0,
        strengths: [],
        improvements: [],
        wrongPoints: []
      };
    }

    const { feedback } = detailData;
    
    return {
      score: question.score || 0,
      userAnswer: feedback.userAnswer || "",
      strengths: feedback.wellDone ? [feedback.wellDone] : [],
      improvements: feedback.improve ? [feedback.improve] : [],
      wrongPoints: feedback.mistake ? [feedback.mistake] : []
    };
  };

  // 피드백 데이터 가져오기
  const feedbackData = detailData ? mapFeedbackData() : {
    score: question.score || 0,
    strengths: [],
    improvements: [],
    wrongPoints: []
  };
  
  // 정답 데이터 가져오는 로직 - 우선순위: API 응답 > 상세 데이터 > 빈 데이터
  const finalAnswerData = answerData || 
    (detailData && detailData.answer ? detailData.answer : {
      answer: "",
      explanation: "",
      examples: [],
      notes: []
    });

  // 사용자 답변 가져오기
  const userAnswer = detailData && detailData.feedback ? 
    detailData.feedback.userAnswer : 
    question.userAnswer || "";

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div 
        className={styles.popupContent} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.popupHeader}>
          <h3>✨ 문제 상세 정보</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className={styles.popupBody}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>상세 정보를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className={styles.retryButton}
              >
                다시 시도
              </button>
            </div>
          ) : question && (
            <>
              {/* 날짜와 점수 정보 */}
              <div className={styles.infoBar}>
                <span className={styles.popupDate}>📅 날짜: {question.date}</span>
                <span className={styles.popupScore}>
                  점수: <span className={
                    question.score >= 80 ? styles.scoreHigh : 
                    question.score >= 40 ? styles.scoreMedium : 
                    styles.scoreLow
                  }>
                    {question.score}점
                  </span>
                </span>
              </div>
              
              {/* 문제 섹션 - 카테고리를 자연스럽게 표시 */}
              <div className={styles.section}>
                <div className={styles.titleRow}>
                  <h3 className={styles.sectionTitle}>❓ 문제</h3>
                  <span className={styles.smallCategory}>
                    {question.category || ""}
                  </span>
                </div>
                <p className={styles.popupQuestion}>{question.text}</p>
              </div>
              
              {/* 사용자 답변 섹션 */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>✏️ 내 답변</h3>
                <p className={styles.userAnswer}>
                  {userAnswer}
                </p>
              </div>
              
              {/* 피드백 섹션 */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📊 채점 결과</h3>
                
                {feedbackData.strengths.length > 0 && (
                  <div className={styles.feedbackItem}>
                    <h4>✅ 잘한 점</h4>
                    <ul>
                      {feedbackData.strengths.map((item, idx) => (
                        <li key={`strength-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {feedbackData.improvements.length > 0 && (
                  <div className={styles.feedbackItem}>
                    <h4>🛠️ 개선할 점</h4>
                    <ul>
                      {feedbackData.improvements.map((item, idx) => (
                        <li key={`improvement-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {feedbackData.wrongPoints.length > 0 && (
                  <div className={styles.feedbackItem}>
                    <h4>❌ 틀린 부분</h4>
                    <ul>
                      {feedbackData.wrongPoints.map((item, idx) => (
                        <li key={`wrong-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* 정답 보기 버튼 */}
              <div className={styles.answerSection}>
                <button 
                  onClick={() => setShowAnswer(!showAnswer)} 
                  className={styles.answerButton}
                >
                  {showAnswer ? '정답 숨기기' : '정답 보기'}
                </button>
                
                {/* 정답 섹션 */}
                {showAnswer && (
                  <div className={styles.answerBox}>
                    {loadingAnswer ? (
                      <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>정답을 불러오는 중...</p>
                      </div>
                    ) : (
                      <>
                        <h2>💡 정답</h2>
                        <p>{finalAnswerData.answer}</p>

                        {finalAnswerData.explanation && (
                          <>
                            <h3>📝 설명</h3>
                            <p>{finalAnswerData.explanation}</p>
                          </>
                        )}

                        {finalAnswerData.examples && finalAnswerData.examples.length > 0 && (
                          <>
                            <h3>📚 예시</h3>
                            <ul>
                              {finalAnswerData.examples.map((ex, idx) => (
                                <li key={idx}>{ex}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        {finalAnswerData.notes && finalAnswerData.notes.length > 0 && (
                          <>
                            <h3>🔖 추가 노트</h3>
                            <ul>
                              {finalAnswerData.notes.map((note, idx) => (
                                <li key={idx}>{note}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;