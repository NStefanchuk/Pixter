import { Link } from 'react-router-dom'
import styles from '../styles/header.module.css'
import logo from '../assets/Logo_t.svg'

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/feed" className={styles.logoLink}>
        <span className={styles.logoWrapper}>
          <img src={logo} alt="Pixter logo" className={styles.logo} />
        </span>
      </Link>
      <nav className={styles.nav}>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  )
}

export default Header
