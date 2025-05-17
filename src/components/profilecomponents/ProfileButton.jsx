import React from 'react';
import profileSettingIcon from '../../assets/Profilesettingbutton.svg'; 
import './ProfileButton.css'; // CSS 파일 import

function ProfileButton({ onClick }) {  
  const handleMoreClick = (question) => {
    // 여기에 더보기 관련 기능 구현
    console.log('더보기 클릭:', question);
    // 예: 모달 표시, 드롭다운 메뉴 등 구현
  };

  return (
    <>
      <button 
        className="profile-button"
        onClick={onClick}
      >
        <img 
          src={profileSettingIcon} 
          alt="프로필 설정" 
          className="profile-icon"
        />
      </button>
    </>
  );
}

export default ProfileButton;