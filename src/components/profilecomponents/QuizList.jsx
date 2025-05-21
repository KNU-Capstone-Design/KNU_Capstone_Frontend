// src/pages/QuizList.jsx

import React, { useState, useEffect } from 'react';
import styles from './QuizList.module.css';
import ProfileButton from './ProfileButton';
import ProfileForm from './ProfileForm';
import QuizPopup from './QuizPopup';
import { activitiesAPI } from '../../api/activities'; // API 임포트

const PAGES_PER_GROUP = 5;

export default function QuizList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [groupStart, setGroupStart] = useState(1);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // API 데이터 관련 상태 추가
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [userEmail, setUserEmail] = useState(''); // 이메일을 저장할 상태 추가
  const [limit] = useState(10); // 한 페이지에 표시할 항목 수

  // 컴포넌트 마운트 시 localStorage에서 이메일 정보 불러오기
  useEffect(() => {
    const storedMetaData = JSON.parse(localStorage.getItem('quizMetaData'));
    if (storedMetaData && storedMetaData.email) {
      setUserEmail(storedMetaData.email);
      setTotalPages(storedMetaData.totalPages || 0);
      setStreakDays(storedMetaData.streak || 0);
    }
  }, []);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // API 모듈을 통해 데이터 요청
        const response = await activitiesAPI.getActivities(currentPage, limit);
        
        // 데이터 형식 변환 (API 응답 -> 컴포넌트에서 사용하는 형식)
        const formattedQuestions = response.data.data.map(item => ({
          id: item._id,
          date: item.date,
          text: item.title,
          category: item.category,
          score: item.score
        }));
        
        setQuestions(formattedQuestions);
        
        // page=1 일 때만 메타데이터가 포함됨
        if (currentPage === 1) {
          const metaData = {
            email: response.data.email,
            page: response.data.page,
            limit: response.data.limit,
            total: response.data.total,
            totalPages: response.data.totalPages,
            streak: response.data.streak
          };
          
          // 메타데이터 localStorage에 저장
          localStorage.setItem('quizMetaData', JSON.stringify(metaData));
          
          // 상태 업데이트
          setTotalPages(response.data.totalPages);
          setStreakDays(response.data.streak);
          setUserEmail(response.data.email); // 이메일 정보 상태 업데이트
        } else {
          // page != 1일 때는 localStorage에서 메타데이터 불러오기
          const storedMetaData = JSON.parse(localStorage.getItem('quizMetaData'));
          if (storedMetaData) {
            setTotalPages(storedMetaData.totalPages);
            setStreakDays(storedMetaData.streak);
            // 이메일 정보가 없을 경우에만 업데이트 (이미 설정되어 있을 수 있음)
            if (!userEmail && storedMetaData.email) {
              setUserEmail(storedMetaData.email);
            }
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", err);
        setError("데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, limit, userEmail]);

  const handlePageClick = (page) => {
    if (page === 'prev') {
      const prevStart = Math.max(groupStart - PAGES_PER_GROUP, 1);
      setGroupStart(prevStart);
      setCurrentPage(prevStart);
    } else if (page === 'next') {
      const maxStart = totalPages - PAGES_PER_GROUP + 1;
      const nextStart = Math.min(groupStart + PAGES_PER_GROUP, maxStart);
      setGroupStart(nextStart);
      setCurrentPage(nextStart);
    } else {
      setCurrentPage(page);
    }
  };

  const handleProfileClick = () => {
    setShowProfileForm(true);
  };

  const handleCloseForm = () => {
    setShowProfileForm(false);
  };

  const handleMoreClick = async (question) => {
    try {
      // 팝업에서 보여줄 상세 정보를 API에서 가져오기
      const detailResponse = await activitiesAPI.getActivityDetail(question.id);
      const feedbackResponse = await activitiesAPI.getActivityFeedback(question.id);
      
      // 선택한 질문에 추가 데이터 병합
      const enrichedQuestion = {
        ...question,
        userAnswer: detailResponse.data.userAnswer,
        feedbackData: feedbackResponse.data,
        answerData: detailResponse.data.answerData
      };
      
      setSelectedQuestion(enrichedQuestion);
      setShowPopup(true);
      
    } catch (err) {
      console.error("상세 정보를 불러오는 중 오류가 발생했습니다:", err);
      // 기본 정보만으로 팝업 열기
      setSelectedQuestion(question);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedQuestion(null);
  };

  const renderPagination = () => {
    const list = [];

    if (groupStart > 1) {
      list.push(1);
      list.push('prev');
    }

    for (let p = groupStart; p < groupStart + PAGES_PER_GROUP && p <= totalPages; p++) {
      list.push(p);
    }

    if (groupStart + PAGES_PER_GROUP <= totalPages) {
      list.push('next');
      list.push(totalPages);
    }

    return (
      <div className={styles.paginationContainer}>
        {list.map((pg, idx) =>
          pg === 'prev' ? (
            <button
              key={idx}
              onClick={() => handlePageClick('prev')}
              className={styles.navButton}
            >
              …
            </button>
          ) : pg === 'next' ? (
            <button
              key={idx}
              onClick={() => handlePageClick('next')}
              className={styles.navButton}
            >
              …
            </button>
          ) : (
            <button
              key={idx}
              onClick={() => handlePageClick(pg)}
              className={`${styles.pageButton} ${currentPage === pg ? styles.activePageButton : ''}`}
            >
              {pg}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {/* 이메일 정보 표시 - 없으면 대체 텍스트 */}
          <span className={styles.email}>{userEmail || ""}</span>
          <span className={styles.welcomeText}>님 <span className={styles.highlight}>{streakDays}</span>일째 면도 중입니다.</span>
        </div>
      
        <div className={styles.profileButtonWrapper}>
          <ProfileButton onClick={handleProfileClick} />
        </div>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.questionList}>
        {loading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={idx}
              className={styles.questionItem}
            >
              <div className={styles.questionContent}>
                <div className={styles.questionDate}>{q.date}</div>
                <div className={styles.questionText}>{q.text}</div>
              </div>
              <div className={styles.scoreSection}>
                <span 
                  className={`${styles.scoreValue} ${
                    q.score >= 80 ? styles.scoreHigh : 
                    q.score >= 40 ? styles.scoreMedium : 
                    styles.scoreLow
                  }`}
                >
                  {q.score}점
                </span>
                <button 
                  className={styles.moreButton}
                  onClick={() => handleMoreClick(q)}
                  aria-label="더 보기"
                >
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {renderPagination()}
      
      {showProfileForm && <ProfileForm onCancel={handleCloseForm} />}

      {showPopup && <QuizPopup question={selectedQuestion} onClose={handleClosePopup} />}
    </div>
  );
}
