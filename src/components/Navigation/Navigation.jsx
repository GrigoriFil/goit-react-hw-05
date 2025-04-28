import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';
import clsx from 'clsx';

const buildLinkClass = ({ isActive }) => {
  return clsx(styles.link, isActive && styles.active);
};

const Navigation = () => {
  return (
    <header className={styles.header}>
       <nav className={styles.nav}>
         <NavLink to="/" className={buildLinkClass}>
           Home
         </NavLink>
         <NavLink to="/movies" className={buildLinkClass}>
           Movies
         </NavLink>
       </nav>
    </header>
  );
};

export default Navigation;