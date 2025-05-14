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

  const questions = Array.from({ length: itemsPerPage }, (_, i) => ({
    score: `${Math.floor(Math.random() * 100)}점`,
    text: `샘플 문제 #${(currentPage - 1) * itemsPerPage + i + 1}`,
  }));

  const handlePageClick = (page) => {
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

  const renderPagination = () => {
    const list = [];

    // 앞 그룹이 있다면
    if (groupStart > 1) {
      list.push(1);
      list.push('prev');
    }

    // 현재 그룹 페이지들
    for (let p = groupStart; p < groupStart + pagesPerGroup && p <= totalPages; p++) {
      list.push(p);
    }

    // 뒷 그룹이 있다면
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>문제 목록 (페이지 {currentPage})</h2>
        <ProfileButton onClick={handleProfileClick} />
      </div>
      
      {questions.map((q, idx) => (
        <div
          key={idx}
          className={styles.questionItem}
        >
          <span className={styles.score}>{q.score}</span>
          <span>{q.text}</span>
        </div>
      ))}
      {renderPagination()}
      
      {/* 조건부 렌더링으로 ProfileForm 팝업 표시 */}
      {showProfileForm && <ProfileForm onCancel={handleCloseForm} />}
    </div>
  );
}
