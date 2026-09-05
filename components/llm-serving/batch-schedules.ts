// The two batching schedules InFlightBatchingBus plays back, the queue at each
// step, and the derived wasted-seat tally.

export type Mode = "static" | "inflight";

export type Seat = {
  name: string;
  remaining: number;
  status?: "finishes" | "boards" | "waiting";
};

export const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const waitingInFlight: Record<number, string[]> = {
  1: [],
  2: ["D"],
  3: [],
  4: ["E"],
  5: ["E"],
  6: ["E", "F"],
  7: [],
  8: [],
  9: [],
};

export const waitingStatic: Record<number, string[]> = {
  1: [],
  2: ["D"],
  3: ["D"],
  4: ["D", "E"],
  5: ["D", "E"],
  6: ["D", "E", "F"],
  7: ["D", "E", "F"],
  8: ["D", "E", "F"],
  9: ["D", "E", "F"],
};

export const staticSchedule: Record<number, Seat[]> = {
  1: [
    { name: "A", remaining: 7 },
    { name: "B", remaining: 1 },
    { name: "C", remaining: 5 },
  ],
  2: [
    { name: "A", remaining: 6 },
    { name: "B", remaining: 0, status: "finishes" },
    { name: "C", remaining: 4 },
  ],
  3: [
    { name: "A", remaining: 5 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 3 },
  ],
  4: [
    { name: "A", remaining: 4 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 2 },
  ],
  5: [
    { name: "A", remaining: 3 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 1 },
  ],
  6: [
    { name: "A", remaining: 2 },
    { name: "empty", remaining: 0 },
    { name: "C", remaining: 0, status: "finishes" },
  ],
  7: [
    { name: "A", remaining: 1 },
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
  ],
  8: [
    { name: "A", remaining: 0, status: "finishes" },
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
  ],
  9: [
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
    { name: "empty", remaining: 0 },
  ],
};

export const inFlightSchedule: Record<number, Seat[]> = {
  1: [
    { name: "A", remaining: 7 },
    { name: "B", remaining: 1 },
    { name: "C", remaining: 5 },
  ],
  2: [
    { name: "A", remaining: 6 },
    { name: "B", remaining: 0, status: "finishes" },
    { name: "C", remaining: 4 },
  ],
  3: [
    { name: "A", remaining: 5 },
    { name: "D", remaining: 3, status: "boards" },
    { name: "C", remaining: 3 },
  ],
  4: [
    { name: "A", remaining: 4 },
    { name: "D", remaining: 2 },
    { name: "C", remaining: 2 },
  ],
  5: [
    { name: "A", remaining: 3 },
    { name: "D", remaining: 1 },
    { name: "C", remaining: 1 },
  ],
  6: [
    { name: "A", remaining: 2 },
    { name: "D", remaining: 0, status: "finishes" },
    { name: "C", remaining: 0, status: "finishes" },
  ],
  7: [
    { name: "A", remaining: 1 },
    { name: "F", remaining: 2, status: "boards" },
    { name: "E", remaining: 2, status: "boards" },
  ],
  8: [
    { name: "A", remaining: 0, status: "finishes" },
    { name: "F", remaining: 1 },
    { name: "E", remaining: 1 },
  ],
  9: [
    { name: "empty", remaining: 0 },
    { name: "F", remaining: 0, status: "finishes" },
    { name: "E", remaining: 0, status: "finishes" },
  ],
};

export const modeCopy: Record<Mode, { title: string; detail: string }> = {
  static: {
    title: "Static batch",
    detail: "Seats freed early stay empty until the last rider finishes.",
  },
  inflight: {
    title: "In-flight batch",
    detail: "The bus never stops. Seats refill at token boundaries.",
  },
};

// A seat-step is wasted when a slot sits idle while a request is still queued --
// exactly the waste in-flight batching removes. Counted only through the step the
// reader is on, so the tally builds alongside the seats instead of spoiling the
// total up front, and derived from the schedules so it can never drift from them.
export const countWastedSeatSteps = (
  schedule: Record<number, Seat[]>,
  queue: Record<number, string[]>,
  throughStep: number
) =>
  steps.reduce(
    (total, item) =>
      item > throughStep || queue[item].length === 0
        ? total
        : total + schedule[item].filter((seat) => seat.name === "empty").length,
    0
  );
