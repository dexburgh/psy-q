import { motion } from "framer-motion";

const LOGO_URL = "https://media.base44.com/images/public/6a49cb16a6415019211414c0/6346c3e90_image.png";
const ICON_URL = "https://media.base44.com/images/public/6a49cb16a6415019211414c0/118ea865b_image.png";

export default function BrandLogo({ variant = "full", className = "" }) {
    const url = variant === "icon" ? ICON_URL : LOGO_URL;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`relative ${className}`}
        >
            <img
                src={url}
                alt="PSI-Q"
                className="w-full h-auto object-contain"
                style={{
                    filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.15))',
                }}
            />
        </motion.div>
    );
}