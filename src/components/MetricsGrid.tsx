import type { Config, Selection } from '../types';
import MetricColumn from './MetricColumn';
import './MetricsGrid.css';

type MetricsGridProps = {
  config: Config;
  selections: Selection;
  onSelect: (metricId: string, optionId: string) => void;
};

function MetricsGrid({ config, selections, onSelect }: MetricsGridProps) {
  return (
    <div className="metrics-grid">
      {Object.entries(config.metrics).map(([metricId, metric]) => (
        <MetricColumn
          key={metricId}
          metricId={metricId}
          metric={metric}
          weight={config.weights[metricId]}
          selectedOptionId={selections[metricId]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default MetricsGrid;