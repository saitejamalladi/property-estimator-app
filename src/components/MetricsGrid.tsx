import type { Config, Selection } from '../types';
import MetricColumn from './MetricColumn';
import { getCategoryColor } from '../utils/categoryColors';
import './MetricsGrid.css';

type MetricsGridProps = {
  config: Config;
  selections: Selection;
  onSelect: (metricId: string, optionId: string) => void;
};

function MetricsGrid({ config, selections, onSelect }: MetricsGridProps) {
  return (
    <div className="metrics-grid">
      {Object.entries(config.metrics).map(([metricId, metric]) => {
        const categoryColor = getCategoryColor(metricId);
        return (
          <MetricColumn
            key={metricId}
            metricId={metricId}
            metric={metric}
            weight={metric.weight}
            allWeights={Object.fromEntries(Object.entries(config.metrics).map(([id, m]) => [id, m.weight]))}
            selectedOptionId={selections[metricId]}
            onSelect={onSelect}
            categoryColor={categoryColor}
          />
        );
      })}
    </div>
  );
}

export default MetricsGrid;