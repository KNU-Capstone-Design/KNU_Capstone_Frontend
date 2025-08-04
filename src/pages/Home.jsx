import phoneImage from '../assets/phone.png';
import SubscribeButton from '../components/SubscribeButton';
import Navbar from '../components/Navbar';
import styles from './Home.module.css';
import SubscribeForm from '../components/SubscribeForm';
import {useState, useEffect} from "react";

function Home() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showInfoSection, setShowInfoSection] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            setScrollProgress(scrollPercent);

            if (scrollTop > 100) {
                setShowInfoSection(true);
            } else {
                setShowInfoSection(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionIndex) => {
        if (sectionIndex === 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (sectionIndex === 1) {
            const infoSection = document.querySelector(`.${styles.infoSection}`);
            if (infoSection) {
                infoSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Custom Scroll Indicator */}
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollTrack}>
                    <div
                        className={styles.scrollThumb}
                        style={{ top: `${scrollProgress}%` }}
                    ></div>
                </div>
                <div className={styles.scrollSections}>
                    <div
                        className={`${styles.scrollSection} ${scrollProgress < 50 ? styles.active : ''}`}
                        onClick={() => scrollToSection(0)}
                        title="홈 섹션"
                    >
                        <span className={styles.sectionDot}></span>
                        <span className={styles.sectionLabel}>HOME</span>
                    </div>
                    <div
                        className={`${styles.scrollSection} ${scrollProgress >= 50 ? styles.active : ''}`}
                        onClick={() => scrollToSection(1)}
                        title="서비스 가이드"
                    >
                        <span className={styles.sectionDot}></span>
                        <span className={styles.sectionLabel}>GUIDE</span>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <Navbar onSubscribeClick={openForm} />

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <div className={styles.backgroundShapes}>
                        <div className={styles.shape1}></div>
                        <div className={styles.shape2}></div>
                        <div className={styles.shape3}></div>
                    </div>
                </div>

                <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <div className={styles.badgeContainer}>
                                <span className={styles.badge}>✨ 매일 5분 학습</span>
                            </div>
                            <h1 className={styles.heroTitle}>
                                개발자 면접,
                                <span className={styles.titleAccent}>하루 5분</span>이면 충분해요
                            </h1>
                            <p className={styles.heroDescription}>
                                핵심 기술 질문에 직접 답해보고 AI의 꼼꼼한 피드백을 받아보세요.
                                <br />
                                출퇴근길, 틈새시간에 실력을 쌓을 수 있습니다.
                            </p>
                            <div className={styles.heroActions}>
                                <SubscribeButton onClick={openForm} />
                                <div className={styles.heroStats}>
                                    <div className={styles.stat}>
                                        <span className={styles.statNumber}>9AM</span>
                                        <span className={styles.statLabel}>매일 발송</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statNumber}>AI</span>
                                        <span className={styles.statLabel}>피드백</span>
                                    </div>
                                </div>
                            </div>
                            {isFormOpen && <SubscribeForm onCancel={closeForm} />}
                        </div>

                        <div className={styles.heroImage}>
                            <div className={styles.phoneContainer}>
                                <img src={phoneImage} alt="서비스 미리보기" className={styles.phoneImage} />
                                <div className={styles.floatingElements}>
                                    <div className={styles.floatingCard1}>💡 CS 질문</div>
                                    <div className={styles.floatingCard2}>🤖 AI 피드백</div>
                                    <div className={styles.floatingCard3}>📊 학습 통계</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Info Section */}
            <section className={`${styles.infoSection} ${showInfoSection ? styles.visible : ''}`}>
                <div className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                        <div className={styles.sectionBadge}>
                            <span>🚀 SERVICE GUIDE</span>
                        </div>
                        <h2 className={styles.sectionTitle}>
                            어떻게 <span className={styles.titleHighlight}>학습</span>하나요?
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            매일 5분, 체계적인 학습으로 실력을 키워보세요
                        </p>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>⏰</div>
                                <div className={styles.cardBadge}>STEP 1</div>
                            </div>
                            <h3 className={styles.cardTitle}>매일 정시 발송</h3>
                            <p className={styles.cardDescription}>
                                매일 오전 9시에 엄선된 질문이 이메일로 자동 발송됩니다
                            </p>
                            <div className={styles.cardFeature}>
                                <span>📧 이메일 알림</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>🔄</div>
                                <div className={styles.cardBadge}>STEP 2</div>
                            </div>
                            <h3 className={styles.cardTitle}>균형잡힌 학습</h3>
                            <p className={styles.cardDescription}>
                                CS 기초와 선택 분야를 번갈아가며 균형있게 학습합니다
                            </p>
                            <div className={styles.cardFeature}>
                                <span>🎯 맞춤형 질문</span>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>🤖</div>
                                <div className={styles.cardBadge}>STEP 3</div>
                            </div>
                            <h3 className={styles.cardTitle}>AI 피드백</h3>
                            <p className={styles.cardDescription}>
                                답변 제출 후 AI가 상세한 피드백과 정답을 제공합니다
                            </p>
                            <p className={styles.limitNotice}>※ AI 요청은 하루 최대 20회 가능합니다.</p>
                            <div className={styles.cardFeature}>
                                <span>🎖️ 실력 향상</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.warningSection}>
                        <div className={styles.warningCard}>
                            <div className={styles.warningHeader}>
                                <div className={styles.warningIcon}>📧</div>
                                <h4 className={styles.warningTitle}>이메일 수신 확인 가이드</h4>
                            </div>
                            <div className={styles.warningContent}>
                                <p>
                                    원활한 서비스 이용을 위해 이메일 설정을 확인해주세요.
                                    <br />
                                    간혹 이메일이 스팸함으로 분류될 수 있습니다.
                                </p>
                                <div className={styles.warningTips}>
                                    <div className={styles.tip}>주소록에 발신자 등록</div>
                                    <div className={styles.tip}>스팸함 주기적 확인</div>
                                    <div className={styles.tip}>수신 허용 설정</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <footer className={styles.contactSection}>
                <div className={styles.contactContainer}>
                    <div className={styles.contactContent}>
                        <h3 className={styles.contactTitle}>Contact to Us</h3>
                        <p className={styles.contactEmail}>
                            <span className={styles.emailIcon}>✉️</span>
                            mailmyundo@gmail.com
                        </p>
                        <p className={styles.contactDescription}>
                            문의사항이나 제안사항이 있으시면 언제든지 연락주세요
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;