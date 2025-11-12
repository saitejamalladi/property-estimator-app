import { useState, useEffect, useRef } from 'react';
import JsonEditor from 'react-json-editor-ajrm';
// @ts-expect-error - react-json-editor-ajrm types don't include locale
import locale from 'react-json-editor-ajrm/locale/en';
import Ajv from 'ajv';
import type { Config } from '../types';
import './ConfigEditorModal.css';

type ConfigEditorModalProps = {
  isOpen: boolean;
  config: Config;
  onSave: (config: Config) => void;
  onClose: () => void;
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
      patternProperties: { '.*': { type: 'number', minimum: 0, maximum: 1 } }
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

function ConfigEditorModal({ isOpen, config, onSave, onClose }: ConfigEditorModalProps) {
  const [jsonData, setJsonData] = useState(config);
  const [errors, setErrors] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setJsonData(config);
  }, [config]);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the modal
      modalRef.current?.focus();
    } else {
      // Return focus to the previously focused element
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const validateConfig = (data: unknown): boolean => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
      setErrors(validate.errors?.map(e => `${e.instancePath}: ${e.message}`) || []);
      return false;
    }
    // Additional check: weights sum to 1
    const weightSum = Object.values(data.weights).reduce((sum: number, w: number) => sum + w, 0);
    if (Math.abs(weightSum - 1) > 0.01) {
      setErrors(['Weights must sum to 1']);
      return false;
    }
    setErrors([]);
    return true;
  };

  const handleSave = () => {
    if (validateConfig(jsonData)) {
      onSave(jsonData as Config);
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="modal-title">Edit Configuration</h2>
        <p id="modal-description" className="sr-only">
          Edit the JSON configuration for the property estimator. Changes will be validated and saved to local storage.
        </p>
        <JsonEditor
          placeholder={jsonData}
          onChange={(data: { jsObject?: Config }) => setJsonData(data.jsObject || jsonData)}
          theme="light_mitsuketa_tribute"
          height="400px"
          locale={locale}
          aria-label="JSON configuration editor"
        />
        {errors.length > 0 && (
          <div className="modal-errors" role="alert" aria-live="polite">
            <h3>Validation Errors:</h3>
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
          </div>
        )}
        <div className="modal-actions">
          <button onClick={handleCopy} aria-label="Copy configuration to clipboard">
            Copy Config
          </button>
          <button
            onClick={handleSave}
            disabled={errors.length > 0}
            aria-label="Save configuration changes"
            aria-describedby={errors.length > 0 ? "modal-errors" : undefined}
          >
            Save
          </button>
          <button onClick={onClose} aria-label="Cancel and close modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigEditorModal;