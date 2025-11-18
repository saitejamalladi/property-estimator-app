import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Selection, Config } from './types';
import { DEFAULT_CONFIG } from './config';
import { computeScore } from './computeScore';
import Header from './components/Header';
import FooterActions from './components/FooterActions';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  // Load config from localStorage or use default
  const [config, setConfig] = useState<Config>(() => {
    const saved = localStorage.getItem('propertyEstimatorConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Initialize selections with default option for each metric (or first non-gateFail if no default set)
  const initialSelections: Selection = useMemo(() => {
    const selections: Selection = {};
    Object.entries(config.metrics).forEach(([metricId, metric]) => {
      const defaultOption = metric.options.find(opt => opt.default);
      const fallbackOption = metric.options.find(opt => !opt.gateFail);
      const selectedOption = defaultOption || fallbackOption;
      if (selectedOption) {
        selections[metricId] = selectedOption.id;
      }
    });
    return selections;
  }, [config]);

  const [selections, setSelections] = useState<Selection>(initialSelections);

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
Property: Unnamed Property
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

  const handleSaveConfig = (newConfig: Config) => {
    setConfig(newConfig);
    localStorage.setItem('propertyEstimatorConfig', JSON.stringify(newConfig));
    // Reset selections to match new config
    const newSelections: Selection = {};
    Object.entries(newConfig.metrics).forEach(([metricId, metric]) => {
      const defaultOption = metric.options.find(opt => opt.default);
      const fallbackOption = metric.options.find(opt => !opt.gateFail);
      const selectedOption = defaultOption || fallbackOption;
      if (selectedOption) {
        newSelections[metricId] = selectedOption.id;
      }
    });
    setSelections(newSelections);
  };

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              config={config}
              selections={selections}
              scoreResult={scoreResult}
              onSelect={handleSelect}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              config={config}
              onSave={handleSaveConfig}
            />
          }
        />
      </Routes>
      <FooterActions
        onReset={handleReset}
        onCopy={handleCopy}
      />
    </div>
  );
}

export default App;
