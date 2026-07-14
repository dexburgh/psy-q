import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadar, ResponsiveContainer } from "recharts";

const CATEGORIES = ["Core Identity", "Processing", "Relational", "Shadow", "Architecture"];

export default function RadarChart({ protocols }) {
    const chartData = useMemo(() => {
        return CATEGORIES.map(cat => {
            const inCat = protocols.filter(p => p.category === cat);
            const done = inCat.filter(p => p.is_done);
            const pct = inCat.length === 0 ? 0 : Math.round((done.length / inCat.length) * 100);
            return { category: cat, value: pct, fullMark: 100 };
        });
    }, [protocols]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsRadar data={chartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: '#7d899f', fontSize: 10, fontFamily: "'Inter', sans-serif" }}
                />
                <Radar
                    name="Integrity"
                    dataKey="value"
                    stroke="#00f0ff"
                    fill="rgba(0,240,255,0.1)"
                    strokeWidth={1.5}
                    dot={{ r: 3, fill: '#fff', stroke: '#00f0ff', strokeWidth: 1.5 }}
                />
            </RechartsRadar>
        </ResponsiveContainer>
    );
}