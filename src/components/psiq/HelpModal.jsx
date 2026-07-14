import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

const SECTIONS = [
    {
        title: "01 // Overview",
        body: "PSI-Q is a mental architecture mapping system. It tracks psychological assessments across five categories — Core Identity, Processing, Relational, Shadow, and Architecture — and synthesizes the results into a unified profile.",
    },
    {
        title: "02 // Protocol Cards",
        body: "Each assessment appears as a card in the protocol grid. Click 'Execute Protocol' to open the external assessment. When finished, paste your raw results into the notes field — your input auto-saves as you type.",
    },
    {
        title: "03 // AI Analysis",
        body: "Click the 'Analyze' button on any card to run an AI-powered clinical analysis on your notes. The system appends a SYSTEM_ANALYSIS block beneath your raw data, providing insight into behavioral tendencies and shadow elements.",
    },
    {
        title: "04 // Sealing Archives",
        body: "Once you're satisfied with an assessment, click 'Seal Archive' to mark it complete. Sealed modules are dimmed and locked — click 'Archive Sealed' to reopen if you need to revise.",
    },
    {
        title: "05 // Category Tabs",
        body: "Use the category tabs above the protocol grid to filter by type (Core Identity, Processing, Relational, Shadow, Architecture). Each tab shows a live count of protocols in that category.",
    },
    {
        title: "06 // Master Synthesis",
        body: "Scroll to the Synthesis Engine at the bottom. Click 'Run Synthesis' to generate a master psychological profile from all your completed assessments. The synthesis auto-saves and can be edited manually.",
    },
    {
        title: "07 // Backup & Restore",
        body: "Use 'Backup' to export all protocols and synthesis as a JSON file. Use 'Load' to import a previous backup — this restores notes and completion status for matching protocols.",
    },
    {
        title: "08 // Dossier Extraction",
        body: "Click 'Extract Dossier' to generate a printable, classified-style report containing your master synthesis and all completed assessment data. The report opens in a new tab — use Ctrl+P to print.",
    },
];

export default function HelpModal({ open, onClose }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="relative w-full max-w-2xl max-h-[80vh] bg-[rgba(10,13,18,0.95)] backdrop-blur-xl border border-white/[0.1] rounded shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-cyan-400" />
                                <div>
                                    <h2 className="font-display text-xl text-white tracking-tight">PSI-Q Field Manual</h2>
                                    <p className="font-['Inter'] text-[0.6rem] uppercase tracking-[0.2em] text-[#7d899f] mt-0.5">
                                        Operator Guide v1.0
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-[#7d899f] hover:text-white hover:bg-white/5 rounded-sm transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto px-8 py-6 space-y-6">
                            {SECTIONS.map((section, i) => (
                                <div key={i}>
                                    <h3 className="font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.15em] text-cyan-400 mb-2">
                                        {section.title}
                                    </h3>
                                    <p className="font-['Inter'] text-sm text-[#a0afc4] leading-relaxed">
                                        {section.body}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-white/[0.06] text-center">
                            <span className="font-['Inter'] text-[0.55rem] uppercase tracking-[0.3em] text-[#344054]">
                                PSI-Q // Mental Architecture System
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}