import { useState } from 'react';
import type { Config, Selection, ScoreResult } from '../types';
import PropertyTitleInput from '../components/PropertyTitleInput';
import MetricsGrid from '../components/MetricsGrid';
import ScorePanel from '../components/ScorePanel';

type DashboardPageProps = {
  config: Config;
  selections: Selection;
  scoreResult: ScoreResult;
  onSelect: (metricId: string, optionId: string) => void;
};

function DashboardPage({ config, selections, scoreResult, onSelect }: DashboardPageProps) {
  const [propertyTitle, setPropertyTitle] = useState('');

  return (
    <>
      <PropertyTitleInput
        value={propertyTitle}
        onChange={setPropertyTitle}
      />
      <div className="app__main">
        <MetricsGrid
          config={config}
          selections={selections}
          onSelect={onSelect}
        />
        <ScorePanel
          propertyTitle={propertyTitle}
          scoreResult={scoreResult}
          config={config}
        />
      </div>
    </>
  );
}

export default DashboardPage;
