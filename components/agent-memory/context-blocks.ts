// The context-window contents that ContextWindowVisualizer renders, with the
// bloated variant used by the raw CRM export mode.

export type ContextBlock = {
  id: string;
  name: string;
  category: "system" | "rules" | "history" | "records" | "tools" | "plan";
  tokens: number;
  tokensBloated?: number;
  description: string;
  meterClass: string;
};

export const BLOCKS: ContextBlock[] = [
  {
    id: "system",
    name: "Support Agent Instructions",
    category: "system",
    tokens: 2500,
    tokensBloated: 2500,
    description: "The agent's support role, available actions, and safety boundaries.",
    meterClass: "bg-fd-foreground/20",
  },
  {
    id: "rules",
    name: "Support Policies",
    category: "rules",
    tokens: 4000,
    tokensBloated: 4000,
    description: "Refund eligibility, identity verification, privacy, and escalation rules.",
    meterClass: "bg-fd-foreground/25",
  },
  {
    id: "history",
    name: "Current Case Conversation",
    category: "history",
    tokens: 12000,
    tokensBloated: 12000,
    description: "Messages between the customer, the human support agent, and the AI assistant.",
    meterClass: "bg-fd-foreground/30",
  },
  {
    id: "records",
    name: "Customer & Order Records",
    category: "records",
    tokens: 18000,
    tokensBloated: 18000,
    description: "Customer profile, order history, billing records, and related support cases.",
    meterClass: "bg-fd-foreground/35",
  },
  {
    id: "tools",
    name: "CRM & API Results",
    category: "tools",
    tokens: 16000,
    tokensBloated: 68000, // Bloated mode: huge 2,000-line CRM export
    description: "CRM searches, payment-provider responses, and knowledge-base results.",
    meterClass: "bg-fd-foreground/45",
  },
  {
    id: "plan",
    name: "Case Resolution Plan",
    category: "plan",
    tokens: 1500,
    tokensBloated: 1500,
    description: "The current diagnosis, next support action, and escalation status.",
    meterClass: "bg-fd-foreground/55",
  },
];

export const TOTAL_CAPACITY = 128000; // 128k Context Window
