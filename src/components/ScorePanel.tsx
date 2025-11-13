import type { ScoreResult, Config } from '../types';
import './ScorePanel.css';

type ScorePanelProps = {
  propertyTitle: string;
  scoreResult: ScoreResult;
  config: Config;
};

function ScorePanel({ propertyTitle, scoreResult, config }: ScorePanelProps) {
  const { status, score, failures } = scoreResult;

  return (
    <div className="score-panel">
      <div className="score-panel__header">
        <h2 className="score-panel__title">{propertyTitle || 'Property Score'}</h2>
        <div className={`score-panel__status ${status === 'GATEFAIL' ? 'score-panel__status--fail' : 'score-panel__status--ok'}`}>
          {status}
        </div>
      </div>

      <div className="score-panel__score">
        <div className="score-panel__score-value">{score}</div>
        <div className="score-panel__score-label">Final Score</div>
      </div>

      {status === 'GATEFAIL' && (
        <div className="score-panel__failures">
          <h3 className="score-panel__failures-title">Deal Breakers:</h3>
          <ul className="score-panel__failures-list">
            {failures.map((failure, index) => {
              const metricLabel = config.metrics[failure.metricId]?.label || 'Unknown';
              return (
                <li key={index} className="score-panel__failure-item">
                  {metricLabel}: {failure.reason}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ScorePanel;