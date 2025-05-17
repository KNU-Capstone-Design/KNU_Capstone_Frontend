// src/pages/QuizList.jsx

import React, { useState } from 'react';
import styles from './QuizList.module.css';
import ProfileButton from './ProfileButton';
import ProfileForm from './ProfileForm';

const totalPages = 30;
const itemsPerPage = 10;
const pagesPerGroup = 3;

export default function QuizList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [groupStart, setGroupStart] = useState(1);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // 샘플 문제 데이터 생성 (이미지처럼 날짜와 설명 포함)
  const questions = Array.from({ length: itemsPerPage }, (_, i) => ({
    date: "05.02",
    score: Math.floor(Math.random() * 50) + 50, // 50~100점 사이 무작위 점수
    text: "Layout XML 파일의 기본 구조와 주요 속성을 간단히 설명해 주세요."
  }));

  const handlePageClick = (page) => {
    // 기존 페이지 전환 로직 유지
    if (page === 'prev') {
      const prevStart = Math.max(groupStart - pagesPerGroup, 1);
      setGroupStart(prevStart);
      setCurrentPage(prevStart);
    } else if (page === 'next') {
      const maxStart = totalPages - pagesPerGroup + 1;
      const nextStart = Math.min(groupStart + pagesPerGroup, maxStart);
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

  const handleMoreClick = (question) => {
    // 더보기 버튼 클릭 시 동작 추가
    console.log('More button clicked for question:', question);
  };

  // 페이지네이션 렌더링 로직 유지
  const renderPagination = () => {
    // 기존 코드 유지
    const list = [];

    if (groupStart > 1) {
      list.push(1);
      list.push('prev');
    }

    for (let p = groupStart; p < groupStart + pagesPerGroup && p <= totalPages; p++) {
      list.push(p);
    }

    if (groupStart + pagesPerGroup <= totalPages) {
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

  // 서버에서 받은 스트릭 날짜
  const streakDays = 7; // 예시 값

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <span className={styles.email}>example@google.com</span>
          <span className={styles.welcomeText}>님 <span className={styles.highlight}>{streakDays}</span>일째 면도 중입니다.</span>
        </div>
      
        <div className={styles.profileButtonWrapper}>
          <ProfileButton onClick={handleProfileClick} />
        </div>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.questionList}>
        {questions.map((q, idx) => (
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
        ))}
      </div>
      
      {renderPagination()}
      
      {showProfileForm && <ProfileForm onCancel={handleCloseForm} />}
    </div>
  );
}
