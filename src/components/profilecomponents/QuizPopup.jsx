import React, { useState } from 'react';
import styles from './QuizPopup.module.css';

const QuizPopup = ({ question, onClose }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  
  // 팝업이 열릴 때 스크롤 방지
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 피드백 데이터 구조화 (API 연동시 이 부분은 서버에서 받아올 예정)
  const feedbackData = question.feedbackData || {
    score: question.score || 80,
    strengths: [
      "기본적인 Layout XML 파일 구조에 대한 설명이 정확합니다.",
      "주요 속성인 layout_width, layout_height에 대한 설명이 적절합니다.",
      "android:id 속성에 대한 설명이 명확합니다."
    ],
    improvements: [
      "ViewGroup의 종류(LinearLayout, RelativeLayout 등)와 각각의 특징에 대한 설명이 누락되었습니다.",
      "layout_margin과 padding 속성에 대한 설명을 추가하면 좋을 것 같습니다."
    ],
    wrongPoints: [
      "특별한 오개념은 없으나 일부 중요 속성이 빠져있습니다."
    ]
  };
  
  // 정답 데이터 구조화 (API 연동시 이 부분은 서버에서 받아올 예정)
  const answerData = question.answerData || {
    answer: "Layout XML 파일은 Android 앱의 사용자 인터페이스를 정의하는 XML 파일입니다. 기본 구조는 루트 요소(ViewGroup)로 시작하여 중첩된 View 또는 ViewGroup 요소들로 구성됩니다.",
    explanation: "Layout XML은 Android에서 UI 컴포넌트의 계층 구조와 속성을 선언적으로 정의하는 방법입니다. 이는 코드와 디자인을 분리하여 유지보수성을 높입니다.",
    examples: [
      "LinearLayout - 자식 요소를 수직 또는 수평으로 정렬하는 레이아웃",
      "RelativeLayout - 요소들 간의 상대적 위치를 지정하는 레이아웃",
      "ConstraintLayout - 제약 조건을 사용해 복잡한 레이아웃을 평면적으로 구현하는 레이아웃"
    ],
    notes: [
      "android:layout_width, android:layout_height: 뷰의 너비와 높이를 설정(match_parent, wrap_content)",
      "android:id: 뷰의 고유 식별자 설정(@+id/name)",
      "android:padding, android:margin: 내부 여백과 외부 여백 설정",
      "android:gravity, android:layout_gravity: 내용물 정렬과 자신의 위치 정렬"
    ]
  };

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
          {question && (
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
              
              {/* 문제 섹션 */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>❓ 문제</h3>
                <p className={styles.popupQuestion}>{question.text}</p>
              </div>
              
              {/* 사용자 답변 섹션 */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>✏️ 내 답변</h3>
                <p className={styles.userAnswer}>
                  {question.userAnswer || "Layout XML은 Android 앱의 UI를 정의하는 파일로, 루트 요소와 중첩된 뷰 또는 뷰그룹으로 구성됩니다. 주요 속성으로는 layout_width, layout_height가 있으며 각각 wrap_content, match_parent 등의 값을 가질 수 있습니다. android:id 속성으로 뷰에 고유 식별자를 부여하고, android:text와 같은 속성으로 텍스트 내용을 설정할 수 있습니다."}
                </p>
              </div>
              
              {/* 피드백 섹션 */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📊 채점 결과</h3>
                <p><strong>점수:</strong> {feedbackData.score}점</p>
                
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
                
                {/* 정답 섹션 - Answer.jsx와 동일한 구조로 변경 */}
                {showAnswer && (
                  <div className={styles.answerBox}>
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