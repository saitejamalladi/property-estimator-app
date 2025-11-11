import type { Option } from '../types';
import './MetricTile.css';

type MetricTileProps = {
  option: Option;
  selected: boolean;
  onSelect: () => void;
};

function MetricTile({ option, selected, onSelect }: MetricTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`metric-tile ${selected ? 'metric-tile--selected' : ''} ${option.gateFail ? 'metric-tile--gatefail' : ''}`}
      aria-pressed={selected}
    >
      <div className="metric-tile__label">{option.label}</div>
      <div className="metric-tile__multiplier">{option.value.toFixed(2)}×</div>
      {option.gateFail && <div className="metric-tile__badge">Deal Breaker</div>}
    </button>
  );
}

export default MetricTile;