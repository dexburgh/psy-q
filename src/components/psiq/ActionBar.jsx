import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Download, FileText, Plus, Upload } from "lucide-react";
import React from "react";

export default function ActionBar({ protocols, synthContent, onInject, onRefresh }) {
    const { toast } = useToast();
    const fileInputRef = React.useRef(null);

    const handleExport = () => {
        const state = {
            protocols: protocols.map(p => ({
                protocol_id: p.protocol_id,
                title: p.title,
                category: p.category,
                description: p.description,
                link: p.link,
                notes: p.notes,
                is_done: p.is_done,
                is_default: p.is_default,
            })),
            synthesis: synthContent || "",
        };
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PSI_Q_CLASSIFIED_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Data secured to local drive." });
    };

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        try {
            const data = JSON.parse(text);
            if (!data.protocols) {
                toast({ title: "File corrupted", variant: "destructive" });
                return;
            }
            // Update existing protocols by matching protocol_id
            for (const imp of data.protocols) {
                const existing = protocols.find(p => p.protocol_id === imp.protocol_id);
                if (existing) {
                    await base44.entities.Protocol.update(existing.id, { notes: imp.notes || "", is_done: imp.is_done || false });
                } else if (!imp.is_default) {
                    await base44.entities.Protocol.create({
                        protocol_id: imp.protocol_id,
                        title: imp.title,
                        category: imp.category,
                        description: imp.description || "",
                        link: imp.link || "",
                        notes: imp.notes || "",
                        is_done: imp.is_done || false,
                        is_default: false,
                        sort_order: 99,
                    });
                }
            }
            onRefresh();
            toast({ title: "Backup loaded successfully." });
        } catch {
            toast({ title: "Parse failure", variant: "destructive" });
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDossier = () => {
        const completed = protocols.filter(p => p.is_done);
        const total = protocols.length;
        const pct = total === 0 ? 0 : Math.round((completed.length / total) * 100);
        const d = new Date();
        const stamp = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} :: ${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")} HRS`;

        let entries = completed.map(test => `
      <div class="dossier-entry">
        <div class="entry-head">
          <span class="entry-title">${test.title}</span>
          <span class="entry-cat">[ SUB-SECTION: ${test.category.toUpperCase()} ]</span>
        </div>
        <div class="entry-data">${test.notes || '// NO DATA INPUT DETECTED'}</div>
      </div>
    `).join("");

        const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>CLASSIFIED_DOSSIER</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
body{font-family:'DM Mono',monospace;background:#f4f4f4;color:#000;line-height:1.5;padding:0;margin:0}
.page-border{margin:20px;border:3px solid #000;padding:40px;position:relative;min-height:calc(100vh - 40px);background:#fff}
.page-border::before{content:'TOP SECRET // EYES ONLY';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#fff;padding:0 15px;font-weight:bold;letter-spacing:4px;font-size:.8rem}
.header-grid{display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #000;padding-bottom:20px;margin-bottom:40px}
h1{font-size:2rem;margin:0;text-transform:uppercase;letter-spacing:-1px}
.meta-data{text-align:right;font-size:.85rem;text-transform:uppercase}
.section-title{background:#000;color:#fff;padding:5px 15px;display:inline-block;text-transform:uppercase;letter-spacing:2px;margin:40px 0 20px;font-size:.9rem}
.synthesis-block{border:1px solid #000;padding:25px;margin-bottom:40px;font-size:.95rem;white-space:pre-wrap;background:#fafafa}
.dossier-entry{padding:20px 0;page-break-inside:avoid;border-bottom:1px dashed #ccc}
.entry-head{display:flex;justify-content:space-between;margin-bottom:15px;align-items:baseline}
.entry-title{font-weight:bold;font-size:1.1rem;text-transform:uppercase}
.entry-cat{color:#555;font-size:.75rem;letter-spacing:1px}
.entry-data{white-space:pre-wrap;font-size:.9rem;color:#111;padding-left:20px;border-left:3px solid #000}
.redacted{background-color:#000;color:#000;padding:0 5px}
@media print{body{background:#fff}.page-border{border:none;margin:0;padding:0}.page-border::before{display:none}}
</style></head><body>
<div class="page-border">
  <div class="header-grid">
    <div><div style="font-size:.7rem;letter-spacing:2px;margin-bottom:5px">AGENCY: PSI-Q INTERNAL</div><h1>PSYCHOLOGICAL DOSSIER</h1></div>
    <div class="meta-data">
      <div><strong>Subject ID:</strong> <span class="redacted">CLASSIFIED</span></div>
      <div><strong>Timestamp:</strong> ${stamp}</div>
      <div><strong>System Integrity:</strong> ${pct}%</div>
    </div>
  </div>
  <div class="section-title">01 // MASTER SYNTHESIS</div>
  <div class="synthesis-block">${synthContent || '// NO SYNTHESIS DRAFTED.'}</div>
  <div class="section-title">02 // RAW INTELLIGENCE DATA</div>
  ${entries || '<p>Awaiting data upload.</p>'}
  <div style="text-align:center;margin-top:60px;font-size:.7rem;letter-spacing:3px;font-weight:bold">*** END OF FILE ***</div>
</div></body></html>`;

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
                onClick={onInject}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 font-['Inter'] font-semibold text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.1em] text-[#7d899f] border border-white/[0.08] rounded-sm hover:text-white hover:border-white/20 transition-all"
            >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inject Protocol</span>
                <span className="sm:hidden">Inject</span>
            </button>
            <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 font-['Inter'] font-semibold text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.1em] text-[#7d899f] border border-white/[0.08] rounded-sm hover:text-white hover:border-white/20 transition-all"
            >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Backup</span>
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 font-['Inter'] font-semibold text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.1em] text-[#7d899f] border border-white/[0.08] rounded-sm hover:text-white hover:border-white/20 transition-all"
            >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Load</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button
                onClick={handleDossier}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 font-['Inter'] font-semibold text-[0.6rem] sm:text-[0.7rem] uppercase tracking-[0.1em] text-cyan-400 bg-cyan-400/[0.15] border border-cyan-400/30 rounded-sm hover:bg-cyan-400 hover:text-[#020408] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
            >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Extract Dossier</span>
                <span className="sm:hidden">Dossier</span>
            </button>
        </div>
    );
}