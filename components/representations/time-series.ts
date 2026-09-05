// The toy input sequence and the fake hidden-state update that
// TimeSeriesVisualizer steps through.

// Simulated ECG-like sequence
export const sequence = [0.1, 0.2, 0.5, 0.9, -0.6, -0.2, 0.1, 0.2, 0.3, 0.1];
export const maxPositiveValue = Math.max(...sequence, 0);
export const maxNegativeMagnitude = Math.max(...sequence.map((value) => Math.max(Math.abs(Math.min(value, 0)), 0)));
export const positiveChartPercent = 65;
export const negativeChartPercent = 35;

// A dummy function to simulate "hidden state" update
// We'll just generate some "features" based on the input and previous state to look cool.
export const computeNextState = (x: number, prevState: number[]) => {
  return [
    Math.tanh(prevState[0] * 0.5 + x * 0.8),
    Math.tanh(prevState[1] * -0.4 + x * 1.2),
    Math.tanh(prevState[2] * 0.9 + x * -0.5),
  ];
};
