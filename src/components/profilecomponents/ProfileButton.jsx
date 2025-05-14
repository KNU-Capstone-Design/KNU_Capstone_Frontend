import React from 'react';
import profileSettingIcon from '../../assets/Profilesettingbutton.png'; 
import './ProfileButton.css'; // CSS 파일 import

function ProfileButton({ onClick }) {  
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