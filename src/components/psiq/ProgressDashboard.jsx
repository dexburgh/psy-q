import RadarChart from "@/components/psiq/RadarChart";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function ProgressDashboard({ protocols }) {
    const { completed, total, pct } = useMemo(() => {
        const total = protocols.length;
        const completed = protocols.filter(p => p.is_done).length;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { completed, total, pct };
    }, [protocols]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 bg-[rgba(13,18,28,0.65)] backdrop-blur-xl border border-white/[0.08] p-5 sm:p-8 lg:p-10 rounded shadow-[0_20px_40px_rgba(0,0,0,0.4)] mb-8"
        >
            <div className="flex flex-col justify-center">
                <div className="font-['Inter'] font-semibold text-[0.75rem] text-[#7d899f] uppercase tracking-[0.15em] mb-3">
                    System Integrity
                </div>
                <div className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-none tracking-tight">
                    <span>{completed}</span>
                    <span className="text-[#344054]">/</span>
                    <span className="text-[#344054]">{total}</span>
                </div>
                <div className="w-full h-1.5 bg-black/50 border border-white/[0.08] rounded-full relative overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, #0055ff, #00f0ff)',
                            boxShadow: '0 0 12px rgba(0,240,255,0.3)',
                        }}
                    />
                </div>
            </div>
            <div className="lg:border-l lg:border-dashed lg:border-white/[0.08] lg:pl-8 h-[200px] sm:h-[260px]">
                <RadarChart protocols={protocols} />
            </div>
        </motion.div>
    );
}