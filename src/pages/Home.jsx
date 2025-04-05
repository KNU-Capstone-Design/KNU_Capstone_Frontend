import phoneImage from '../assets/phone.png';
import SubscribeButton from '../components/SubscribeButton';
import Navbar from '../components/Navbar';
import styles from './Home.module.css';

function Home() {
    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.infoTxt}>
                        <h1 className={styles.title}>개발자 면접,<br />하루 5분이면 충분해요.</h1>
                        <p className={styles.description}>
                        핵심 기술 질문에 직접 답해보세요.<br />
                        AI가 꼼꼼하게 해석해드릴게요.<br />
                        출퇴근길, 틈새시간에 실력 쌓기!
                        </p>
                        <div className={styles.ctaButtonWrapper}>
                            <SubscribeButton />
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