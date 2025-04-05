import styles from './Navbar.module.css';
import logoImage from '../assets/logo.png';
import SubscribeButton from './SubscribeButton';

function Navbar({ showSubscribe = true }) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logoContainer}>
            <img src={logoImage} alt="로고" className={styles.logoImage} />
          </div>
  
          {showSubscribe && (
            <div className={styles.navSubscribeBtn}>
              <SubscribeButton />
            </div>
          )}
        </div>
      </nav>
    );
  }

export default Navbar;