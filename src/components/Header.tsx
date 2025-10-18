import { Link } from 'react-router-dom'
import styles from '../styles/header.module.css'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <span className={styles.logoWrapper}>
          <img src={logo} alt="Pixter logo" className={styles.logo} />
        </span>
      </Link>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/profile/u_9f2a">Profile</Link>
      </nav>
    </header>
  )
}

export default Header
