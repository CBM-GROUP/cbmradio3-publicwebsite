import type { ProgramSummary } from "@/types/program";

interface ProgramTabsProps {
  programs: ProgramSummary[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

export default function ProgramTabs({
  programs,
  selectedSlug,
  onSelect,
}: ProgramTabsProps) {
  return (
    <nav aria-label="Filter episodes by program" className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        <Tab selected={!selectedSlug} onClick={() => onSelect("")}>
          All Episodes
        </Tab>
        {programs.map((program) => (
          <Tab
            key={program.id}
            selected={selectedSlug === program.slug}
            onClick={() => onSelect(program.slug)}
          >
            {program.title}
          </Tab>
        ))}
      </div>
    </nav>
  );
}

function Tab({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        "min-h-11 rounded-full px-5 py-2.5 font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-teal-300 " +
        (selected
          ? "border-2 border-black bg-black text-[#04b093] font-black uppercase tracking-wider shadow-md"
          : "border-2 border-black/40 bg-black/10 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-white")
      }
    >
      {children}
    </button>
  );
}
