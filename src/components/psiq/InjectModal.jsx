import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const CATEGORIES = ["Core Identity", "Processing", "Relational", "Shadow", "Architecture"];

export default function InjectModal({ open, onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Core Identity");
    const [link, setLink] = useState("");
    const [desc, setDesc] = useState("");
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const handleSave = async () => {
        if (!title.trim()) {
            toast({ title: "Protocol designation required", variant: "destructive" });
            return;
        }
        setSaving(true);
        await base44.entities.Protocol.create({
            protocol_id: "custom_" + Date.now().toString(36),
            title: title.trim(),
            category,
            description: desc.trim(),
            link: link.trim(),
            notes: "",
            is_done: false,
            is_default: false,
            sort_order: 99,
        });
        toast({ title: `Protocol [${title.trim()}] injected into matrix.` });
        setTitle(""); setCategory("Core Identity"); setLink(""); setDesc("");
        setSaving(false);
        onCreated();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-[#0d121c] border border-cyan-400/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-display text-3xl text-white">Inject Protocol</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 mt-4">
                    <div>
                        <label className="block font-['Inter'] font-semibold text-[0.65rem] text-cyan-400 uppercase tracking-[0.15em] mb-2">
                            Diagnostic Designation
                        </label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. CliftonStrengths"
                            className="w-full bg-black/50 border border-white/[0.08] text-white px-4 py-3 font-mono text-sm rounded-sm focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div>
                        <label className="block font-['Inter'] font-semibold text-[0.65rem] text-cyan-400 uppercase tracking-[0.15em] mb-2">
                            Sector Matrix
                        </label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full bg-black/50 border border-white/[0.08] text-white px-4 py-3 font-mono text-sm rounded-sm focus:outline-none focus:border-cyan-400"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-['Inter'] font-semibold text-[0.65rem] text-cyan-400 uppercase tracking-[0.15em] mb-2">
                            Target Vector (URL)
                        </label>
                        <input
                            value={link}
                            onChange={e => setLink(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-black/50 border border-white/[0.08] text-white px-4 py-3 font-mono text-sm rounded-sm focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div>
                        <label className="block font-['Inter'] font-semibold text-[0.65rem] text-cyan-400 uppercase tracking-[0.15em] mb-2">
                            Parameter Description
                        </label>
                        <input
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="What does this map?"
                            className="w-full bg-black/50 border border-white/[0.08] text-white px-4 py-3 font-mono text-sm rounded-sm focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.1em] text-[#7d899f] border border-white/[0.08] rounded-sm hover:text-white hover:border-white/20 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2.5 font-['Inter'] font-semibold text-[0.7rem] uppercase tracking-[0.1em] text-cyan-400 bg-cyan-400/[0.15] border border-cyan-400/30 rounded-sm hover:bg-cyan-400 hover:text-[#020408] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-40"
                        >
                            Inject
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}