import './FooterActions.css';

type FooterActionsProps = {
  onReset: () => void;
  onCopy: () => void;
};

function FooterActions({ onReset, onCopy }: FooterActionsProps) {
  return (
    <footer className="footer-actions">
      <button type="button" onClick={onReset} className="footer-actions__button footer-actions__button--reset">
        Reset Selections
      </button>
      <button type="button" onClick={onCopy} className="footer-actions__button footer-actions__button--copy">
        Copy Summary
      </button>
    </footer>
  );
}

export default FooterActions;