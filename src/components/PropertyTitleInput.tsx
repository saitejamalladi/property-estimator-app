import './PropertyTitleInput.css';

type PropertyTitleInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function PropertyTitleInput({ value, onChange }: PropertyTitleInputProps) {
  return (
    <div className="property-title-input">
      <label htmlFor="property-title" className="property-title-input__label">
        Property Title:
      </label>
      <input
        id="property-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter property name or address"
        className="property-title-input__input"
      />
    </div>
  );
}

export default PropertyTitleInput;