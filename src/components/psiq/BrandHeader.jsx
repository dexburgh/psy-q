import { motion } from "framer-motion";

const LOGO_URL = "https://media.base44.com/images/public/6a49cb16a6415019211414c0/6346c3e90_image.png";
const ICON_URL = "https://media.base44.com/images/public/6a49cb16a6415019211414c0/118ea865b_image.png";

export default function BrandHeader() {
    return (
        <div className="flex flex-col items-start">
            {/* Status indicator */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 mb-6"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                <span className="font-['Inter'] text-[0.65rem] uppercase tracking-[0.3em] text-cyan-400">
                    Protocol Active
                </span>
            </motion.div>

            {/* Unified brand block: icon + wordmark side by side */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 sm:gap-5 mb-4"
            >
                <div
                    className="relative shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-sm overflow-hidden"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(255,42,77,0.2))' }}
                >
                    <img src={ICON_URL} alt="PSI-Q Icon" className="w-full h-full object-cover" />
                </div>
                <div
                    className="relative h-12 lg:h-16 w-auto"
                    style={{ filter: 'drop-shadow(0 0 16px rgba(0,240,255,0.15))' }}
                >
                    <img src={LOGO_URL} alt="PSI-Q" className="h-full w-auto object-contain" />
                </div>
            </motion.div>

            {/* Single subtitle line */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[#7d899f] text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-8 sm:mb-10"
            >
                Mental Architecture & Threat Intelligence
            </motion.p>
        </div>
    );
}