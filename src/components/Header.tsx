import './Header.css';

type HeaderProps = {
  onEditSettings: () => void;
};

function Header({ onEditSettings }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">Property Estimator</h1>
      <button className="header__edit-button" onClick={onEditSettings}>
        Edit Settings
      </button>
    </header>
  );
}

export default Header;