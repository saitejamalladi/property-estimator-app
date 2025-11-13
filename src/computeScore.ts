import type { Config, Selection, ScoreResult } from './types';
import { normalizeWeights } from './utils/normalizeWeights';

export function computeScore(cfg: Config, sel: Selection): ScoreResult {
  const base = cfg.aggregation.basePoints;
  const failures: { metricId: string; reason: string }[] = [];
  let product = 1;

  // Normalize weights to [0, 1] range
  const normalizedWeights = normalizeWeights(cfg.weights);

  for (const [metricId, metric] of Object.entries(cfg.metrics)) {
    const optionId = sel[metricId];
    const opt = metric.options.find(o => o.id === optionId);
    if (!opt) continue; // treat as not selected (no change)

    if (opt.gateFail) {
      failures.push({ metricId, reason: opt.label });
    }

    const w = normalizedWeights[metricId] ?? 0;
    const m = opt.value; // expected in [0.75, 1.5]
    product *= (1 + (m - 1) * w);
  }

  const score = Math.round(base * product * 100) / 100;
  const status = failures.length > 0 ? "GATEFAIL" : "OK";

  return { status, score, product, failures };
}