import styles from './Navbar.module.css';
import logoImage from '../assets/logo.png';
import SubscribeButton from './SubscribeButton';

const baseURL = import.meta.env.VITE_API_BASEURL;

function Navbar({ showSubscribe = true, onSubscribeClick}) {
    const handleLogoClick = () => {
        window.location.href = baseURL;
    };

    return (
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logoContainer}>
            <button
              className={styles.logoButton}
              onClick={handleLogoClick}
              aria-label="홈으로 이동"
            >
              <img src={logoImage} alt="로고" className={styles.logoImage} />
            </button>
          </div>
  
          {showSubscribe && (
            <div className={styles.navSubscribeBtn}>
              <SubscribeButton onClick={onSubscribeClick}/>
            </div>
          )}
        </div>
      </nav>
    );
  }

export default Navbar;