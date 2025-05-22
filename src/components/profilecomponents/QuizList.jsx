// src/pages/QuizList.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  // 문제: 같은 질문을 여러 번 열 때마다 새로운 API 요청
  const [cachedDetails, setCachedDetails] = useState({});

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
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // API 모듈을 통해 데이터 요청
      const response = await activitiesAPI.getActivities(currentPage, limit);
      
      // 데이터 형식 변환 (API 응답 -> 컴포넌트에서 사용하는 형식)
      const formattedQuestions = response.data.data.map(item => ({
        qid: item.questionId,
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
        
        // 기존 데이터와 비교 후 변경됐을 때만 저장
        const existingData = JSON.parse(localStorage.getItem('quizMetaData') || '{}');
        if (JSON.stringify(existingData) !== JSON.stringify(metaData)) {
          localStorage.setItem('quizMetaData', JSON.stringify(metaData));
        }
        
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
    } catch (err) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", err);
      setError("데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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

  const handleMoreClick = useCallback(async (question) => {
    // 캐시 확인
    if (cachedDetails[question.id]) {
      setSelectedQuestion({
        ...question,
        ...cachedDetails[question.id]
      });
      setShowPopup(true);
      return;
    }
    
    try {
      const detailResponse = await activitiesAPI.getActivityDetail(question.id);
      
      const questionDetails = {
        userAnswer: detailResponse.data.feedback?.userAnswer || "",
        feedbackData: detailResponse.data.feedback || {},
        answerData: detailResponse.data.answer || {}
      };
      
      // 캐시에 저장
      setCachedDetails(prev => ({
        ...prev,
        [question.id]: questionDetails
      }));
      
      setSelectedQuestion({
        ...question,
        ...questionDetails
      });
      setShowPopup(true);
    } catch (err) {
      console.error("상세 정보를 불러오는 중 오류가 발생했습니다:", err);
      setSelectedQuestion(question);
      setShowPopup(true);
    }
  }, [cachedDetails]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedQuestion(null);
  };

  const questionsList = useMemo(() => {
    return questions.map((q, idx) => (
      <div
        key={q.id || idx} // id가 더 안정적이므로 우선 사용
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
    ));
  }, [questions, handleMoreClick]);

  const pagination = useMemo(() => {
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
  }, [groupStart, totalPages, PAGES_PER_GROUP, currentPage]);

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
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button 
              onClick={() => fetchQuestions()} 
              className={styles.retryButton}
            >
              다시 시도
            </button>
          </div>
        ) : (
          questionsList
        )}
      </div>
      
      {pagination}
      
      {showProfileForm && <ProfileForm onCancel={handleCloseForm} />}

      {showPopup && <QuizPopup question={selectedQuestion} onClose={handleClosePopup} />}
    </div>
  );
}
