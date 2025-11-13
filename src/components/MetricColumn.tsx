import type { Metric } from '../types';
import MetricTile from './MetricTile';
import './MetricColumn.css';

type MetricColumnProps = {
  metricId: string;
  metric: Metric;
  weight: number;
  selectedOptionId: string;
  onSelect: (metricId: string, optionId: string) => void;
  categoryColor: string;
};

function MetricColumn({ metricId, metric, weight, selectedOptionId, onSelect, categoryColor }: MetricColumnProps) {
  return (
    <div className={`metric-column metric-column--${metricId}`} style={{ backgroundColor: categoryColor }}>
      <div className="metric-column__header">
        <h3 className="metric-column__title">{metric.label}</h3>
        <span className="metric-column__weight">{(weight * 100).toFixed(0)}%</span>
      </div>
      <div className="metric-column__tiles">
        {metric.options.map((option) => (
          <MetricTile
            key={option.id}
            option={option}
            selected={selectedOptionId === option.id}
            onSelect={() => onSelect(metricId, option.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MetricColumn;