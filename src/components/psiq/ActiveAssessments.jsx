import { motion } from "framer-motion";
import { ArrowUpRight, Circle } from "lucide-react";

const CATEGORY_COLORS = {
    "Core Identity": "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    "Processing": "text-violet-400 border-violet-400/30 bg-violet-400/10",
    "Relational": "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    "Shadow": "text-rose-400 border-rose-400/30 bg-rose-400/10",
    "Architecture": "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

export default function ActiveAssessments({ protocols }) {
    const active = protocols.filter(p => !p.is_done);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[rgba(13,18,28,0.65)] backdrop-blur-xl border border-white/[0.08] rounded shadow-[0_20px_40px_rgba(0,0,0,0.4)] mb-8 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
                    <h3 className="font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.15em] text-[#7d899f]">
                        Active Assessments
                    </h3>
                </div>
                <span className="font-['Inter'] text-[0.65rem] text-[#344054] uppercase tracking-[0.1em]">
                    {active.length} {active.length === 1 ? "module" : "modules"} in progress
                </span>
            </div>

            {/* List */}
            {active.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-[#344054] text-sm uppercase tracking-[0.15em]">
                        All modules archived. No active assessments.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-white/[0.04]">
                    {active.map((p, i) => {
                        const hasNotes = p.notes && p.notes.trim().length > 0;
                        const hasAnalysis = p.notes && p.notes.includes("SYSTEM_ANALYSIS");
                        const progressLabel = hasAnalysis ? "Analyzed" : hasNotes ? "In Progress" : "Not Started";
                        const progressPct = hasAnalysis ? 75 : hasNotes ? 35 : 0;
                        const colorClass = CATEGORY_COLORS[p.category] || "text-gray-400 border-white/10 bg-white/5";

                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.04 }}
                                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 hover:bg-white/[0.02] transition-colors group"
                            >
                                {/* Index */}
                                <span className="font-['Inter'] text-[0.6rem] text-[#344054] w-5 sm:w-6 shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                {/* Title + link */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-['Inter'] text-sm text-white truncate group-hover:text-cyan-400 transition-colors">
                                            {p.title}
                                        </span>
                                        {p.link && (
                                            <a
                                                href={p.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 text-[#344054] hover:text-cyan-400 transition-colors"
                                            >
                                                <ArrowUpRight className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    {/* Mini progress bar */}
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="flex-1 max-w-[80px] sm:max-w-[120px] h-0.5 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${progressPct}%`,
                                                    background: hasAnalysis
                                                        ? "linear-gradient(90deg, #b562ff, #00f0ff)"
                                                        : hasNotes
                                                            ? "#00f0ff"
                                                            : "transparent",
                                                }}
                                            />
                                        </div>
                                        <span className={`font-['Inter'] text-[0.55rem] uppercase tracking-[0.1em] ${hasAnalysis ? "text-violet-400" : hasNotes ? "text-cyan-400" : "text-[#344054]"
                                            }`}>
                                            {progressLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Category badge */}
                                <span className={`hidden sm:inline-block shrink-0 px-2.5 py-1 font-['Inter'] font-semibold text-[0.55rem] uppercase tracking-[0.1em] rounded-sm border ${colorClass}`}>
                                    {p.category}
                                </span>

                                {/* Status dot */}
                                <div className="shrink-0 w-5 sm:w-6 flex justify-center">
                                    <Circle className={`w-3 h-3 ${hasAnalysis ? "fill-violet-400/20 text-violet-400" : hasNotes ? "fill-cyan-400/20 text-cyan-400" : "text-[#1e2530]"
                                        }`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}