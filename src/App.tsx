import { useState, useMemo } from 'react';
import type { Selection } from './types';
import { scoringConfig } from './config';
import { computeScore } from './computeScore';
import Header from './components/Header';
import PropertyTitleInput from './components/PropertyTitleInput';
import MetricsGrid from './components/MetricsGrid';
import ScorePanel from './components/ScorePanel';
import FooterActions from './components/FooterActions';
import './App.css';

function App() {
  const [propertyTitle, setPropertyTitle] = useState('');

  // Initialize selections with first non-gateFail option for each metric
  const initialSelections: Selection = useMemo(() => {
    const selections: Selection = {};
    Object.entries(scoringConfig.metrics).forEach(([metricId, metric]) => {
      const firstNonGateFail = metric.options.find(opt => !opt.gateFail);
      if (firstNonGateFail) {
        selections[metricId] = firstNonGateFail.id;
      }
    });
    return selections;
  }, []);

  const [selections, setSelections] = useState<Selection>(initialSelections);

  const scoreResult = useMemo(() => {
    return computeScore(scoringConfig, selections);
  }, [selections]);

  const handleSelect = (metricId: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [metricId]: optionId
    }));
  };

  const handleReset = () => {
    setSelections(initialSelections);
  };

  const handleCopy = async () => {
    const summary = `
Property: ${propertyTitle || 'Unnamed Property'}
Status: ${scoreResult.status}
Final Score: ${scoreResult.score}

Selections:
${Object.entries(selections).map(([metricId, optionId]) => {
  const metric = scoringConfig.metrics[metricId];
  const option = metric.options.find(opt => opt.id === optionId);
  return `${metric.label}: ${option?.label} (${option?.value}×)`;
}).join('\n')}

${scoreResult.failures.length > 0 ? `\nDeal Breakers:\n${scoreResult.failures.map(f => `- ${f.reason}`).join('\n')}` : ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard. Please copy manually:\n\n' + summary);
    }
  };

  return (
    <div className="app">
      <Header />
      <PropertyTitleInput
        value={propertyTitle}
        onChange={setPropertyTitle}
      />
      <div className="app__main">
        <MetricsGrid
          config={scoringConfig}
          selections={selections}
          onSelect={handleSelect}
        />
        <ScorePanel
          propertyTitle={propertyTitle}
          scoreResult={scoreResult}
        />
      </div>
      <FooterActions
        onReset={handleReset}
        onCopy={handleCopy}
      />
    </div>
  );
}

export default App;
