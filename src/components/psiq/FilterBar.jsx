
const FILTERS = [
    { key: "all", label: "All Modules" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Archived" },
];

export default function FilterBar({ currentFilter, onFilterChange }) {
    return (
        <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
                <button
                    key={f.key}
                    onClick={() => onFilterChange(f.key)}
                    className={`px-4 py-2 font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.1em] rounded-sm border transition-all duration-200 ${currentFilter === f.key
                            ? 'bg-white text-[#020408] border-white'
                            : 'bg-transparent text-[#7d899f] border-white/[0.08] hover:border-white/30 hover:text-white/80'
                        }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}