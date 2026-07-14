import BrandLogo from "@/components/psiq/BrandLogo";
import { motion } from "framer-motion";
import { HelpCircle, LayoutGrid, Sparkles } from "lucide-react";

export default function TopNav({ onHelp }) {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-40 bg-[rgba(8,11,15,0.85)] backdrop-blur-xl border-b border-white/[0.06]"
        >
            <div className="max-w-[1300px] mx-auto px-6 lg:px-8 flex items-center justify-between h-14">
                {/* Left: Logo + brand */}
                <div className="flex items-center gap-3">
                    <BrandLogo variant="icon" className="w-7 h-7" />
                    <span className="font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.2em] text-white">
                        PSI-Q
                    </span>
                </div>

                {/* Center: Section links */}
                <div className="hidden md:flex items-center gap-1">
                    <button
                        onClick={() => scrollTo("dashboard")}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-['Inter'] font-semibold text-[0.65rem] uppercase tracking-[0.1em] text-[#7d899f] hover:text-white transition-colors rounded-sm"
                    >
                        <LayoutGrid className="w-3 h-3" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => scrollTo("protocols")}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-['Inter'] font-semibold text-[0.65rem] uppercase tracking-[0.1em] text-[#7d899f] hover:text-white transition-colors rounded-sm"
                    >
                        Protocols
                    </button>
                    <button
                        onClick={() => scrollTo("synthesis")}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-['Inter'] font-semibold text-[0.65rem] uppercase tracking-[0.1em] text-[#7d899f] hover:text-white transition-colors rounded-sm"
                    >
                        <Sparkles className="w-3 h-3" />
                        Synthesis
                    </button>
                </div>

                {/* Right: Help */}
                <button
                    onClick={onHelp}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-['Inter'] font-semibold text-[0.65rem] uppercase tracking-[0.1em] text-cyan-400 border border-cyan-400/20 rounded-sm hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all"
                >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Manual</span>
                </button>
            </div>
        </motion.nav>
    );
}