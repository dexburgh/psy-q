import React from "react";

const CATEGORIES = [
    "Core Identity",
    "Processing",
    "Relational",
    "Shadow",
    "Architecture",
];

export default function CategoryTabs({ activeCategory, onCategoryChange, protocols }) {
    const counts = React.useMemo(() => {
        const map = {};
        CATEGORIES.forEach(c => { map[c] = 0; });
        protocols.forEach(p => {
            if (map[p.category] !== undefined) map[p.category]++;
        });
        return map;
    }, [protocols]);

    const tabs = [{ key: "all", label: "All" }, ...CATEGORIES.map(c => ({ key: c, label: c }))];

    return (
        <div className="flex gap-1 flex-wrap border-b border-white/[0.08]">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => onCategoryChange(tab.key)}
                    className={`px-4 py-2.5 font-['Inter'] font-semibold text-[0.65rem] uppercase tracking-[0.12em] border-b-2 transition-all duration-200 -mb-px ${activeCategory === tab.key
                            ? 'text-cyan-400 border-cyan-400'
                            : 'text-[#7d899f] border-transparent hover:text-white/70 hover:border-white/20'
                        }`}
                >
                    {tab.label}
                    <span className="ml-2 text-[0.6rem] opacity-50">
                        {tab.key === "all" ? protocols.length : (counts[tab.key] || 0)}
                    </span>
                </button>
            ))}
        </div>
    );
}