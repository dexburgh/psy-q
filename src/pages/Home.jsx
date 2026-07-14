import { base44 } from "@/api/base44Client";
import ActionBar from "@/components/psiq/ActionBar";
import ActiveAssessments from "@/components/psiq/ActiveAssessments";
import BrandHeader from "@/components/psiq/BrandHeader";
import BrandLogo from "@/components/psiq/BrandLogo";
import CategoryTabs from "@/components/psiq/CategoryTabs";
import FilterBar from "@/components/psiq/FilterBar";
import HelpModal from "@/components/psiq/HelpModal";
import InjectModal from "@/components/psiq/InjectModal";
import ProgressDashboard from "@/components/psiq/ProgressDashboard";
import ProtocolCard from "@/components/psiq/ProtocolCard";
import SynthesisEngine from "@/components/psiq/SynthesisEngine";
import TopNav from "@/components/psiq/TopNav";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [protocols, setProtocols] = useState([]);
  const [synthesis, setSynthesis] = useState(null);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [prots, synths] = await Promise.all([
      base44.entities.Protocol.list("sort_order", 100),
      base44.entities.Synthesis.list("-updated_date", 1),
    ]);
    setProtocols(prots);
    setSynthesis(synths[0] || null);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = protocols.filter(p => {
    if (filter === "pending" && p.is_done) return false;
    if (filter === "completed" && !p.is_done) return false;
    if (category !== "all" && p.category !== category) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <BrandLogo variant="icon" className="w-16 h-16 animate-pulse" />
          <span className="font-['Inter'] text-[0.65rem] text-[#7d899f] uppercase tracking-[0.3em]">
            Initializing Protocol...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav onHelp={() => setHelpOpen(true)} />

      {/* Header */}
      <header id="dashboard" className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-10 border-b border-white/[0.08] scroll-mt-14">
        <BrandHeader />

        <ProgressDashboard protocols={protocols} />

        <ActiveAssessments protocols={protocols} />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
          <ActionBar
            protocols={protocols}
            synthContent={synthesis?.content}
            onInject={() => setModalOpen(true)}
            onRefresh={loadData}
          />
        </div>
      </header>

      {/* Category Tabs */}
      <div id="protocols" className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 scroll-mt-14">
        <CategoryTabs
          activeCategory={category}
          onCategoryChange={setCategory}
          protocols={protocols}
        />
      </div>

      {/* Protocol Cards */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((p, i) => (
          <ProtocolCard key={p.id} protocol={p} index={i} onUpdate={loadData} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-[#344054] text-sm uppercase tracking-[0.15em]">
              {filter === "completed" ? "No archived modules yet." : filter === "pending" ? "All modules archived." : "No protocols loaded."}
            </p>
          </div>
        )}
      </main>

      {/* Synthesis */}
      <div id="synthesis" className="scroll-mt-14">
        <SynthesisEngine protocols={protocols} synthRecord={synthesis} onUpdate={loadData} />
      </div>

      {/* Inject Modal */}
      <InjectModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={loadData} />

      {/* Help Modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}