import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SynthesisEngine({ protocols, synthRecord, onUpdate }) {
    const [content, setContent] = useState(synthRecord?.content || "");
    const [generating, setGenerating] = useState(false);
    const { toast } = useToast();
    const saveTimeout = useRef(null);

    useEffect(() => {
        setContent(synthRecord?.content || "");
    }, [synthRecord?.content]);

    const handleChange = (val) => {
        setContent(val);
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(async () => {
            if (synthRecord) {
                await base44.entities.Synthesis.update(synthRecord.id, { content: val });
            } else {
                await base44.entities.Synthesis.create({ content: val });
            }
            onUpdate();
        }, 1000);
    };

    const handleGenerate = async () => {
        const completed = protocols.filter(p => p.is_done && p.notes?.trim());
        if (completed.length === 0) {
            toast({ title: "Data sparse", description: "Archive modules with notes before synthesis.", variant: "destructive" });
            return;
        }
        setGenerating(true);
        try {
            const dataDump = completed.map(t => `Module: ${t.title} (${t.category})\nRaw Data: ${t.notes}`).join("\n\n");

            const prompt = `You are an elite clinical psychologist and profiler writing a classified psychological dossier.
The subject has provided the following raw psychometric data:

${dataDump}

Write a cohesive, profound 3-paragraph "Master Synthesis" of this subject's psychological architecture.
- Paragraph 1: Core Engine (How they operate at baseline, identity, decision making).
- Paragraph 2: Relational Matrix (How they bond, attach, or defend in relationships).
- Paragraph 3: The Shadow & Vulnerability (Where the system fractures, repressed elements, stress trajectory).

Tone: Direct, sharply insightful, premium, clinical but deeply human. Format it like an executive briefing.`;

            const result = await base44.integrations.Core.InvokeLLM({ prompt });
            const synthText = result.trim();
            setContent(synthText);

            if (synthRecord) {
                await base44.entities.Synthesis.update(synthRecord.id, { content: synthText });
            } else {
                await base44.entities.Synthesis.create({ content: synthText });
            }
            onUpdate();
            toast({ title: "Synthesis compiled", description: "Master protocol finalized." });
        } catch {
            toast({ title: "Synthesis engine aborted", variant: "destructive" });
        } finally {
            setGenerating(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-[1300px] mx-auto mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8"
        >
            <div className="bg-[rgba(13,18,28,0.65)] backdrop-blur-xl border border-white/[0.08] border-t-2 border-t-red-500 p-5 sm:p-8 lg:p-12 relative">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-red-500 mb-3 leading-none">
                            Master Synthesis
                        </h2>
                        <p className="text-[#7d899f] text-sm max-w-xl leading-relaxed">
                            Cross-reference your data. Map how your core identity triggers relational patterns, and where the shadow bleeds through.
                        </p>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.05em] font-['Inter'] font-semibold rounded-sm border border-purple-400/30 text-purple-400 bg-transparent transition-all duration-200 hover:bg-purple-400/20 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(181,98,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        {generating ? "Synthesizing..." : "Initiate AI Synthesis"}
                    </button>
                </div>
                <textarea
                    value={content}
                    onChange={e => handleChange(e.target.value)}
                    placeholder="Draft overarching architecture here... or initialize AI profiling to parse raw data."
                    className="w-full min-h-[250px] sm:min-h-[300px] resize-y bg-black/40 border border-white/[0.08] text-white p-4 sm:p-6 font-mono text-sm leading-[1.8] rounded-sm focus:outline-none focus:border-red-500/40 focus:shadow-[inset_0_0_20px_rgba(255,42,77,0.05)]"
                />
            </div>
        </motion.section>
    );
}