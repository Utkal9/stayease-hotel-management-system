import type { RoadmapPhase } from "../pages/landingContent";

interface RoadmapListProps {
  phases: RoadmapPhase[];
}

export default function RoadmapList({ phases }: RoadmapListProps) {
  return (
    <ol className="divide-y divide-neutral-200 border-y border-neutral-200">
      {phases.map((item) => (
        <li key={item.phase} className="grid gap-1 py-5 sm:grid-cols-[5.5rem_1fr_auto] sm:items-baseline sm:gap-6">
          <span className="font-display text-lg text-neutral-600">Phase {item.phase}</span>
          <div>
            <h3 className="font-semibold text-navy-950">{item.title}</h3>
            <p className="mt-1 text-neutral-600">{item.description}</p>
          </div>
          <span
            className={
              item.status === "current"
                ? "w-fit rounded-full bg-navy-900 px-3 py-1 text-sm font-medium text-white"
                : "w-fit rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700"
            }
          >
            {item.status === "current" ? "In progress" : "Planned"}
          </span>
        </li>
      ))}
    </ol>
  );
}
