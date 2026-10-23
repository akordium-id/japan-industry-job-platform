import {
  TrendingUp,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { PLATFORM_STATS } from "@/lib/constants";

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: `${PLATFORM_STATS.placementRate}%`,
      unit: "Tingkat Kelolosan",
      label: "Peserta Terseleksi Tahap 3",
      labelJp: "就職内定率",
      benchmark: "Vs. 48% rata-rata industri",
    },
    {
      icon: Users,
      value: `${PLATFORM_STATS.totalAlumni}+`,
      unit: "Tenaga Ahli Resmi",
      label: "Aktif di Prefektur Jepang",
      labelJp: "認定修了生",
      benchmark: "Visa SSW & Gijinkoku",
    },
    {
      icon: Building2,
      value: `${PLATFORM_STATS.partnerCompanies}`,
      unit: "Konsorsium Perusahaan",
      label: "Mitra Industri Terdaftar",
      labelJp: "提携日本企業",
      benchmark: "Manufaktur, IT, & Layanan",
    },
    {
      icon: Clock,
      value: `${PLATFORM_STATS.avgTimeToPlacement} bln`,
      unit: "Siklus Penempatan",
      label: "Dari Modul Hingga COE",
      labelJp: "平均内定期間",
      benchmark: "Proses cepat & transparan",
    },
  ];

  return (
    <section id="stats" className="bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Bilateral Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          {stats.map((item, idx) => (
            <div key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                  <span>{item.unit}</span>
                  <span className="text-[11px] font-sans text-slate-500 font-medium">{item.labelJp}</span>
                </div>
                <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {item.label}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{item.benchmark}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bilateral Trust Footnote */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 px-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span className="font-semibold text-slate-800">Standar Kepatuhan Resmi:</span>
            <span>Ketenagakerjaan Bilateral Indonesia (Kemenaker) & Imigrasi Jepang (ISA)</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Prefektur Utama: Aichi • Tokyo • Kanagawa • Osaka • Fukuoka
          </div>
        </div>
      </div>
    </section>
  );
}
