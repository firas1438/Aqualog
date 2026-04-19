export type LivabilityInput = {
  salinity: number;
  ph: number;
  secchi_depth: number;
  water_depth: number;
  water_temp: number;
  air_temp: number;
};

export type LivabilityPrediction = {
  class_id: number;
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
};
