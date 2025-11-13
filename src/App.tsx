import { useState, useMemo } from 'react';
import type { Selection, Config } from './types';
import { DEFAULT_CONFIG } from './config';
import { computeScore } from './computeScore';
import Header from './components/Header';
import PropertyTitleInput from './components/PropertyTitleInput';
import MetricsGrid from './components/MetricsGrid';
import ScorePanel from './components/ScorePanel';
import FooterActions from './components/FooterActions';
import ConfigEditorModal from './components/ConfigEditorModal';
import './App.css';

function App() {
  const [propertyTitle, setPropertyTitle] = useState('');

  // Load config from localStorage or use default
  const [config, setConfig] = useState<Config>(() => {
    const saved = localStorage.getItem('propertyEstimatorConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Initialize selections with first non-gateFail option for each metric
  const initialSelections: Selection = useMemo(() => {
    const selections: Selection = {};
    Object.entries(config.metrics).forEach(([metricId, metric]) => {
      const firstNonGateFail = metric.options.find(opt => !opt.gateFail);
      if (firstNonGateFail) {
        selections[metricId] = firstNonGateFail.id;
      }
    });
    return selections;
  }, [config]);

  const [selections, setSelections] = useState<Selection>(initialSelections);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scoreResult = useMemo(() => {
    return computeScore(config, selections);
  }, [config, selections]);

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
  const metric = config.metrics[metricId];
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

  const handleEditSettings = () => {
    setIsModalOpen(true);
  };

  const handleSaveConfig = (newConfig: Config) => {
    setConfig(newConfig);
    localStorage.setItem('propertyEstimatorConfig', JSON.stringify(newConfig));
    // Reset selections to match new config
    const newSelections: Selection = {};
    Object.entries(newConfig.metrics).forEach(([metricId, metric]) => {
      const firstNonGateFail = metric.options.find(opt => !opt.gateFail);
      if (firstNonGateFail) {
        newSelections[metricId] = firstNonGateFail.id;
      }
    });
    setSelections(newSelections);
  };

  return (
    <div className="app">
      <Header onEditSettings={handleEditSettings} />
      <PropertyTitleInput
        value={propertyTitle}
        onChange={setPropertyTitle}
      />
      <div className="app__main">
        <MetricsGrid
          config={config}
          selections={selections}
          onSelect={handleSelect}
        />
        <ScorePanel
          propertyTitle={propertyTitle}
          scoreResult={scoreResult}
          config={config}
        />
      </div>
      <FooterActions
        onReset={handleReset}
        onCopy={handleCopy}
      />
      <ConfigEditorModal
        isOpen={isModalOpen}
        config={config}
        onSave={handleSaveConfig}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
