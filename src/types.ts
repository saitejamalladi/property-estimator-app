export type Option = {
  id: string;
  label: string;
  value: number;
  gateFail?: boolean;
};

export type Metric = {
  label: string;
  weight: number;
  options: Option[];
};

export type Config = {
  aggregation: {
    basePoints: number;
    formula: string;
  };
  metrics: Record<string, Metric>;
};

export type Selection = Record<string, string>; // metricId -> optionId

export type ScoreResult = {
  status: "OK" | "GATEFAIL";
  score: number;
  product: number;
  failures: { metricId: string; reason: string }[];
};

export type AppState = {
  propertyTitle: string;
  selections: Selection;
};
