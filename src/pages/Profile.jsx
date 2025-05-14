import React from 'react'
import Navbar from '../components/Navbar'
import QuizList from '../components/profilecomponents/QuizList'
import './Profile.css' // CSS 파일 추가

function Profile() {
    return (
        <>
            <Navbar showSubscribe={false}/>
            <div className="content-container">
                <QuizList></QuizList>
            </div>
        </>
    )
}

export default Profile
