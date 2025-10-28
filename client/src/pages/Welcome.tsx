import { useNavigate } from 'react-router-dom'
import styles from '../styles/welcome.module.css'
import logoUrl from '../assets/Logo_t.svg' 

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <img
          src={logoUrl}            
          alt="Pixter logo"
          className={styles.logo}
          loading="eager"
          decoding="async"
        />

        <h1 className={styles.title}>Create. Capture. Connect.</h1>
        <p className={styles.subtitle}>
          A social hub for photographers — share your work, get feedback, and
          grow together.
        </p>

        <button
          className={`${styles.btn} ${styles.primary}`}
          onClick={() => navigate('/auth')}
        >
          Get started
        </button>

        <p className={styles.hint}>Join now and be part of a creative community.</p>
      </div>
    </main>
  )
}

export default Welcome
