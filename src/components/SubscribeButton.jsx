import styles from './SubscribeButton.module.css';
import SubscribeForm from './SubscribeForm';

function SubscribeButton({ onClick }) {
  return (
    <>
      <button className={styles.subscribeBtn}
      onClick={onClick}>
          구독하기
      </button>
    </>
  );
}

export default SubscribeButton;