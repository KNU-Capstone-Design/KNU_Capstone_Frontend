import phoneImage from '../assets/phone.png';
import SubscribeButton from '../components/SubscribeButton';
import Navbar from '../components/Navbar';
import styles from './Home.module.css';
import SubscribeForm from '../components/SubscribeForm';
import {useState} from "react";

function Home() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    const handleTestVerify = () => {
        //window.location.href = "/verify?token=ef32f82e717b9f40713950e69c01c837474f74c16ff8855f842d1179a23b9aa6&redirect=profile";
        window.location.href = "verify?token=ef32f82e717b9f40713950e69c01c837474f74c16ff8855f842d1179a23b9aa6&question=67f76e27cf776341c0c813cc&redirect=quiz";
    };

    return (
        <>
            {/* Navbar */}
            <Navbar onSubscribeClick={openForm} />

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.infoTxt}>
                        <h1 className={styles.title}>개발자 면접,<br />하루 5분이면 충분해요.</h1>
                        <p className={styles.description}>
                        핵심 기술 질문에 직접 답해보세요.<br />
                        AI가 꼼꼼하게 해석해드릴게요.<br />
                        출퇴근길, 틈새시간에 실력 쌓기!!
                        </p>
                        <div className={styles.ctaButtonWrapper}>
                            <SubscribeButton onClick={openForm} />
                            {/* 테스트용 인증 버튼 추가 */}
                            <button 
                                onClick={handleTestVerify}
                                className={styles.testVerifyButton}
                            >
                                테스트 인증
                            </button>
                            {isFormOpen && <SubscribeForm onCancel={closeForm} />}
                        </div>
                    </div>
                    <div className={styles.infoImage}>
                        <img src={phoneImage} alt="핸드폰 화면" className={styles.phoneImage} />
                    </div>
                </div>
            </main>
        </>
    );
}

export default Home;