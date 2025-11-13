import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="header__title">Property Estimator</h1>
      <Link to="/settings" className="header__edit-button">
        Edit Settings
      </Link>
    </header>
  );
}

export default Header;