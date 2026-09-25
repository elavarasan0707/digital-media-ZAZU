import React, { useState } from 'react';
import { sampleAnalyticsData } from '../data/agencyData';
import { BarChart3, TrendingUp, Layers, Users, Info, Calendar } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30D' | '90D' | '180D'>('90D');
  const [activeChartMetric, setActiveChartMetric] = useState<'traffic' | 'leads'>('leads');

  const timeframeInfo = sampleAnalyticsData.timeframeData[selectedTimeframe];
  const chartValues = activeChartMetric === 'traffic' ? timeframeInfo.traffic : timeframeInfo.leads;
  const maxValue = Math.max(...chartValues);

  return (
    <section id="analytics" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F5C542]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
              <span>QUANTITATIVE RIGOR</span>
              <span aria-hidden="true">/</span>
              <span>GROWTH ARCHITECTURE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
              DATA-DRIVEN <span className="gold-gradient-text">PERFORMANCE MATRIX</span>
            </h2>

            <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
              We monitor campaign velocity, attribution cohorts, and CAC-to-LTV ratios with surgical precision. Explore our representative telemetry and conversion frameworks below.
            </p>
          </div>

          {/* Mandatory Sample Data Disclaimer Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 text-[11px] text-[#FFD966]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">CLEARLY LABELED SAMPLE BENCHMARK DATA</span>
          </div>
        </div>

        {/* Dashboard Shell */}
        <div className="rounded-2xl bg-[#111111] border border-[#222222] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 sm:p-8 space-y-8">
          
          {/* Top Control Bar: Timeframe Selector & Metric Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A0A0A0] font-mono-data uppercase mr-2">Timeframe:</span>
              {(['30D', '90D', '180D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-data font-semibold transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-[#F5C542] text-[#080808] shadow-[0_0_12px_rgba(245,197,66,0.3)]'
                      : 'bg-black/50 text-[#A0A0A0] hover:text-white border border-white/5'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A0A0A0] font-mono-data uppercase mr-2">Chart Metric:</span>
              <button
                onClick={() => setActiveChartMetric('leads')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChartMetric === 'leads'
                    ? 'bg-[#FFD966] text-[#080808]'
                    : 'bg-black/50 text-[#A0A0A0] hover:text-white border border-white/5'
                }`}
              >
                Inbound Leads
              </button>
              <button
                onClick={() => setActiveChartMetric('traffic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeChartMetric === 'traffic'
                    ? 'bg-[#FFD966] text-[#080808]'
                    : 'bg-black/50 text-[#A0A0A0] hover:text-white border border-white/5'
                }`}
              >
                Traffic Volume
              </button>
            </div>
          </div>

          {/* 4 Sample Stat Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleAnalyticsData.summaryMetrics.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-[#F5C542]/30 transition-colors"
              >
                <div className="flex items-center justify-between text-[#A0A0A0] mb-2">
                  <span className="text-xs">{m.label}</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#F5C542]" />
                </div>
                <div className="text-2xl font-mono-data font-bold text-white mb-1">
                  {m.value}
                </div>
                <span className="text-[11px] text-[#A0A0A0] block">
                  {m.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* Visual Grid: Interactive Growth Chart & Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Chart Column (7 cols) */}
            <div className="lg:col-span-7 rounded-xl bg-black/50 border border-white/5 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {activeChartMetric === 'leads' ? 'Lead Inflow Progression' : 'Commercial Traffic Growth'}
                  </h4>
                  <span className="text-xs text-[#A0A0A0] font-mono-data">
                    {selectedTimeframe} Window • Total Sample Volume: {timeframeInfo.leadsTotal} Leads
                  </span>
                </div>
                <span className="text-xs font-mono-data text-[#FFD966] bg-[#F5C542]/10 px-2.5 py-1 rounded border border-[#F5C542]/20">
                  Avg ROAS: {timeframeInfo.roas}
                </span>
              </div>

              {/* Bar / Column Chart Visual */}
              <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-white/10">
                {chartValues.map((val, i) => {
                  const heightPercent = Math.max(15, (val / maxValue) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <span className="text-[10px] font-mono-data text-[#FFD966] opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-[#F5C542]/30 via-[#F5C542]/80 to-[#FFD966] group-hover:shadow-[0_0_15px_rgba(245,197,66,0.6)] transition-all duration-300"
                      />
                      <span className="text-[10px] font-mono-data text-[#A0A0A0]">
                        W{i + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#A0A0A0] pt-1">
                <span>Week 1 (Baseline Discovery)</span>
                <span>Week 7 (Scaled Expansion)</span>
              </div>
            </div>

            {/* Funnel Column (5 cols) */}
            <div className="lg:col-span-5 rounded-xl bg-black/50 border border-white/5 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Conversion Funnel Visualization
                </h4>
                <span className="text-[11px] font-mono-data text-[#A0A0A0]">Sample Pipeline</span>
              </div>

              <div className="space-y-3 pt-2">
                {sampleAnalyticsData.funnelStages.map((stage, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">{stage.name}</span>
                      <span className="font-mono-data font-bold text-[#FFD966]">{stage.volume}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        style={{ width: stage.percentage.includes('%') ? stage.percentage.split('%')[0] + '%' : '100%' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#F5C542] to-[#FFD966]"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#A0A0A0]">
                      <span>{stage.note}</span>
                      <span>{stage.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Transparency Disclaimer */}
          <div className="text-center text-xs text-[#777777] border-t border-white/5 pt-4">
            Notice: All metrics and graphs presented above are illustrative sample frameworks to demonstrate our analytics capabilities and reporting standards. ZAZU Digital Media never displays confidential client figures or fabricated achievements.
          </div>

        </div>

      </div>
    </section>
  );
};
