import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ExternalLink, Lock, Sparkles, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProtocolCard({ protocol, index, onUpdate }) {
    const [notes, setNotes] = useState(protocol.notes || "");
    const [analyzing, setAnalyzing] = useState(false);
    const [sealing, setSealing] = useState(false);
    const { toast } = useToast();
    const saveTimeout = useRef(null);
    const isDone = protocol.is_done;

    useEffect(() => {
        setNotes(protocol.notes || "");
    }, [protocol.notes]);

    const handleNotesChange = (val) => {
        setNotes(val);
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(async () => {
            await base44.entities.Protocol.update(protocol.id, { notes: val });
            onUpdate();
        }, 800);
    };

    const handleAnalyze = async () => {
        if (!notes.trim()) {
            toast({ title: "Insufficient data", description: `Provide raw input for ${protocol.title} first.`, variant: "destructive" });
            return;
        }
        setAnalyzing(true);
        try {
            const prompt = `The subject has completed a psychological assessment: ${protocol.title} (Category: ${protocol.category}).
Raw data input:
"${notes}"

Provide a highly insightful, clinical, yet profound one-paragraph analysis of what these specific results indicate about their mental architecture, behavioral tendencies, or shadow elements. Keep it direct, sharp, and styled like an intelligence briefing. Do not repeat the scores.`;

            const result = await base44.integrations.Core.InvokeLLM({ prompt });
            const newNotes = notes + `\n\n> // SYSTEM_ANALYSIS:\n> ${result.trim()}`;
            setNotes(newNotes);
            await base44.entities.Protocol.update(protocol.id, { notes: newNotes });
            onUpdate();
            toast({ title: "Analysis complete", description: `Neural analysis finalized for ${protocol.title}.` });
        } catch {
            toast({ title: "Analysis failed", description: "Neural link interrupted.", variant: "destructive" });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleToggleSeal = async () => {
        setSealing(true);
        await base44.entities.Protocol.update(protocol.id, { is_done: !isDone });
        onUpdate();
        setSealing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`group relative flex flex-col rounded-sm border p-5 sm:p-8 transition-all duration-300 ${isDone
                    ? 'bg-[rgba(8,11,15,0.4)] border-white/[0.03]'
                    : 'bg-[rgba(13,18,28,0.65)] backdrop-blur-xl border-white/[0.08] hover:border-cyan-400/30 hover:shadow-[0_8px_30px_rgba(0,240,255,0.03)] hover:-translate-y-0.5'
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <h2 className={`font-display text-xl sm:text-2xl leading-tight tracking-tight ${isDone ? 'text-[#344054]' : 'text-white'}`}>
                    {protocol.title}
                </h2>
                <span className={`shrink-0 ml-3 px-2.5 py-1 font-['Inter'] font-semibold text-[0.6rem] uppercase tracking-[0.1em] rounded-sm border ${isDone
                        ? 'bg-transparent text-[#344054] border-white/[0.06]'
                        : 'bg-cyan-400/[0.15] text-cyan-400 border-cyan-400/20'
                    }`}>
                    {protocol.category}
                </span>
            </div>

            {/* Description */}
            <p className={`text-sm mb-6 flex-grow leading-relaxed ${isDone ? 'text-[#344054]' : 'text-[#7d899f]'}`}>
                {protocol.description}
            </p>

            {/* Link */}
            {protocol.link && (
                <a
                    href={protocol.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] font-['Inter'] font-semibold mb-6 transition-colors duration-200 ${isDone
                            ? 'text-[#344054] pointer-events-none'
                            : 'text-white hover:text-cyan-400'
                        }`}
                >
                    Execute Protocol
                    <ExternalLink className="w-3 h-3" />
                </a>
            )}

            {/* Notes */}
            <div className="relative mb-5">
                <textarea
                    value={notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    placeholder="Record raw intelligence here..."
                    className={`w-full min-h-[140px] resize-y rounded-sm p-5 pb-12 font-mono text-sm leading-relaxed transition-all duration-200 focus:outline-none ${isDone
                            ? 'bg-black/20 border border-transparent text-[#7d899f]'
                            : 'bg-black/30 border border-white/[0.08] text-cyan-400 placeholder-[#344054] focus:border-cyan-400/50 focus:bg-cyan-400/[0.02]'
                        }`}
                />
                {!isDone && (
                    <div className="absolute bottom-2 right-2">
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.05em] font-['Inter'] font-semibold rounded-sm border border-purple-400/30 text-purple-400 bg-transparent transition-all duration-200 hover:bg-purple-400/20 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(181,98,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="w-3 h-3" />
                            {analyzing ? "Processing..." : "Analyze"}
                        </button>
                    </div>
                )}
            </div>

            {/* Seal Button */}
            <button
                onClick={handleToggleSeal}
                disabled={sealing}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.1em] rounded-sm border transition-all duration-200 disabled:opacity-40 ${isDone
                        ? 'border-white/[0.06] text-[#344054] border-solid hover:border-white/10 hover:text-[#7d899f]'
                        : 'border-dashed border-white/[0.08] text-[#7d899f] hover:border-solid hover:border-white/20 hover:text-white'
                    }`}
            >
                {isDone ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {isDone ? 'Archive Sealed' : 'Seal Archive'}
            </button>
        </motion.div>
    );
}