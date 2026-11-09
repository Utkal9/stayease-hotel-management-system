export type PhaseStatus = "current" | "planned";

export interface RoadmapPhase {
  phase: number;
  title: string;
  description: string;
  status: PhaseStatus;
}

// Mirrors the development roadmap in the README. Only the nearest phases are shown here.
export const roadmapPhases: RoadmapPhase[] = [
  { phase: 1, title: "Project foundation", description: "Monorepo, API skeleton, database container and this web app.", status: "current" },
  { phase: 2, title: "Database design", description: "ER diagram, Prisma schema and migrations.", status: "planned" },
  { phase: 3, title: "Accounts and access", description: "Sign-in and role-based permissions for guests and staff.", status: "planned" },
  { phase: 4, title: "Hotel and rooms", description: "Room types, rooms and amenities.", status: "planned" },
  { phase: 5, title: "Rates and availability", description: "Room rates and availability search.", status: "planned" },
];
