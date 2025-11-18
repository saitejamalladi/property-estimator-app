import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JsonEditor from 'react-json-editor-ajrm';
// @ts-expect-error - react-json-editor-ajrm types don't include locale
import locale from 'react-json-editor-ajrm/locale/en';
import Ajv from 'ajv';
import type { Config } from '../types';
import { calculatePercentages } from '../utils/normalizeWeights';
import './SettingsPage.css';

type SettingsPageProps = {
  config: Config;
  onSave: (config: Config) => void;
};

const ajv = new Ajv();
const schema = {
  type: 'object',
  properties: {
    aggregation: {
      type: 'object',
      properties: { basePoints: { type: 'number', minimum: 0 } },
      required: ['basePoints']
    },
    weights: {
      type: 'object',
      patternProperties: { '.*': { type: 'number', minimum: 0 } }
    },
    metrics: {
      type: 'object',
      patternProperties: {
        '.*': {
          type: 'object',
          properties: {
            label: { type: 'string' },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  label: { type: 'string' },
                  value: { type: 'number', minimum: 0.75, maximum: 1.5 },
                  gateFail: { type: 'boolean' }
                },
                required: ['id', 'label', 'value']
              }
            }
          },
          required: ['label', 'options']
        }
      }
    }
  },
  required: ['aggregation', 'weights', 'metrics']
};

function SettingsPage({ config, onSave }: SettingsPageProps) {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(config);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setJsonData(config);
  }, [config]);

  const validateConfig = (data: unknown): boolean => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      setErrors(validate.errors?.map(e => `${e.instancePath}: ${e.message}`) || []);
      return false;
    }
    setErrors([]);
    return true;
  };

  const handleSave = () => {
    if (validateConfig(jsonData)) {
      onSave(jsonData as Config);
      navigate('/');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      alert('Config copied to clipboard!');
    } catch {
      alert('Failed to copy. Please copy manually:\n' + JSON.stringify(jsonData, null, 2));
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="settings-page">
      <div className="settings-page__container">
        <h1 className="settings-page__title">Edit Configuration</h1>
        <p className="settings-page__description">
          Edit the JSON configuration for the property estimator. Changes will be validated and saved to local storage.
        </p>
        <div className="settings-page__editor">
          <JsonEditor
            placeholder={jsonData}
            onChange={(data: { jsObject?: Config }) => setJsonData(data.jsObject || jsonData)}
            theme="light_mitsuketa_tribute"
            height="500px"
            locale={locale}
            aria-label="JSON configuration editor"
          />
        </div>
        <div className="settings-page__percentages">
          <h3>Calculated Weight Percentages</h3>
          <div className="percentages-grid">
            {Object.entries(calculatePercentages(jsonData.weights)).map(([key, pct]) => (
              <div key={key} className="percentage-item">
                <span className="category-name">{key}:</span>
                <span className="raw-weight">{jsonData.weights[key]}</span>
                <span className="arrow">→</span>
                <span className="percentage">{Number(pct).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
        {errors.length > 0 && (
          <div className="settings-page__errors" role="alert" aria-live="polite">
            <h3>Validation Errors:</h3>
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
          </div>
        )}
        <div className="settings-page__actions">
          <button onClick={handleCopy} aria-label="Copy configuration to clipboard">
            Copy Config
          </button>
          <button
            onClick={handleSave}
            disabled={errors.length > 0}
            aria-label="Save configuration changes"
            aria-describedby={errors.length > 0 ? "settings-errors" : undefined}
          >
            Save
          </button>
          <button onClick={handleCancel} aria-label="Cancel and return to dashboard">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
