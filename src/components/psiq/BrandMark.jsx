import { motion } from "framer-motion";

export default function BrandMark() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
        >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <span className="font-['Inter'] text-[0.65rem] uppercase tracking-[0.3em] text-cyan-400">
                Protocol Active
            </span>
        </motion.div>
    );
}