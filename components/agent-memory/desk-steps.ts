// The support-desk story that AgentDeskVisualizer steps through. Presentation
// (tone classes, layout) stays in the component.

export type CardTone = "default" | "active" | "muted" | "success";

export type MemoryCard = {
  id: string;
  title: string;
  detail: string;
  tone?: CardTone;
};

export type DeskStep = {
  title: string;
  description: string;
  contextUsage: number;
  desk: MemoryCard[];
  cabinet: MemoryCard[];
  handbook?: MemoryCard;
};

export const steps: DeskStep[] = [
  {
    title: "A customer reports a duplicate charge",
    description: "Lisa opens the case with the customer's message and plenty of room in the context window.",
    contextUsage: 18,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Customer sees two card charges for order #1842",
        tone: "active",
      },
    ],
    cabinet: [],
  },
  {
    title: "The case fills the desk",
    description: "Conversation, CRM lookups, and payment results accumulate while Lisa investigates.",
    contextUsage: 92,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Customer sees two card charges for order #1842",
      },
      {
        id: "conversation",
        title: "Customer conversation",
        detail: "Card appeared to be charged twice after checkout",
      },
      {
        id: "payment",
        title: "Payment API",
        detail: "One charge settled; one authorization is pending",
        tone: "active",
      },
      {
        id: "attempts",
        title: "Actions considered",
        detail: "Refund, reversal check, or billing escalation",
        tone: "muted",
      },
    ],
    cabinet: [],
  },
  {
    title: "Compaction clears the desk",
    description: "The investigation becomes one checkpoint, preserving the useful facts without every lookup.",
    contextUsage: 34,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Resolve the duplicate-charge report for order #1842",
      },
      {
        id: "checkpoint",
        title: "Progress checkpoint",
        detail: "One payment settled; one authorization pending; do not refund yet",
        tone: "active",
      },
    ],
    cabinet: [],
  },
  {
    title: "Lisa's session ends",
    description: "The next session starts empty, but the case checkpoint survives in external storage.",
    contextUsage: 0,
    desk: [],
    cabinet: [
      {
        id: "checkpoint",
        title: "Case #1842 checkpoint",
        detail: "One settled payment and one pending authorization",
        tone: "active",
      },
    ],
  },
  {
    title: "John receives a similar case",
    description: "The agent retrieves Lisa's useful checkpoint instead of replaying her entire session.",
    contextUsage: 38,
    desk: [
      {
        id: "case",
        title: "Current case",
        detail: "Investigate two card charges for order #1977",
      },
      {
        id: "retrieved",
        title: "Retrieved memory",
        detail: "Compare transaction IDs and settlement states before refunding",
        tone: "active",
      },
    ],
    cabinet: [
      {
        id: "checkpoint",
        title: "Case #1842 checkpoint",
        detail: "Retrieved for this similar billing case",
        tone: "muted",
      },
      {
        id: "delivery",
        title: "Delivery delay case",
        detail: "Unrelated support history stays filed away",
        tone: "muted",
      },
    ],
  },
  {
    title: "The resolution becomes a procedure",
    description: "The agent keeps the useful lesson, so the next support case starts with a proven check.",
    contextUsage: 22,
    desk: [
      {
        id: "resolved",
        title: "Case resolved",
        detail: "The pending authorization reversed without a second charge",
        tone: "success",
      },
    ],
    cabinet: [
      {
        id: "session",
        title: "Case #1842",
        detail: "The full support transcript is archived",
        tone: "muted",
      },
    ],
    handbook: {
      id: "procedure",
      title: "Suspected duplicate charge",
      detail: "Compare transaction IDs and settlement states before refunding",
      tone: "active",
    },
  },
];
