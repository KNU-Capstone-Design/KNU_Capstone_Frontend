// src/pages/QuizList.jsx

import React, { useState } from 'react';

const totalPages = 30;
const itemsPerPage = 10;
const pagesPerGroup = 3;

export default function QuizList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [groupStart, setGroupStart] = useState(1);

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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        {list.map((pg, idx) =>
          pg === 'prev' ? (
            <button
              key={idx}
              onClick={() => handlePageClick('prev')}
              style={{
                margin: '0 4px',
                padding: '6px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              …
            </button>
          ) : pg === 'next' ? (
            <button
              key={idx}
              onClick={() => handlePageClick('next')}
              style={{
                margin: '0 4px',
                padding: '6px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              …
            </button>
          ) : (
            <button
              key={idx}
              onClick={() => handlePageClick(pg)}
              style={{
                margin: '0 4px',
                padding: '6px 12px',
                border: currentPage === pg ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: 4,
                background: currentPage === pg ? '#e3f2ff' : '#fff',
                cursor: 'pointer',
              }}
            >
              {pg}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h2>문제 목록 (페이지 {currentPage})</h2>
      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <span style={{ fontWeight: 'bold', marginRight: 16 }}>{q.score}</span>
          <span>{q.text}</span>
        </div>
      ))}
      {renderPagination()}
    </div>
  );
}
