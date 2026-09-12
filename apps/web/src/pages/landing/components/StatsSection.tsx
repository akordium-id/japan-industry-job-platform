import { TrendingUp, Users, Building2, Clock, CheckCircle2 } from "lucide-react";

import { PLATFORM_STATS } from "@/lib/constants";

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: `${PLATFORM_STATS.placementRate}%`,
      label: "Tingkat Penempatan Sukses",
      labelJp: "就職内定率",
      desc: "Dari kandidat yang menyelesaikan kurikulum persiapan tahap 3",
    },
    {
      icon: Users,
      value: `${PLATFORM_STATS.totalAlumni}+`,
      label: "Alumni Bersertifikat",
      labelJp: "認定修了生",
      desc: "Aktif berkarier di industri manufaktur & IT di seluruh Jepang",
    },
    {
      icon: Building2,
      value: `${PLATFORM_STATS.partnerCompanies}`,
      label: "Konsorsium Perusahaan Mitra",
      labelJp: "提携日本企業",
      desc: "Perusahaan Jepang yang rutin membuka kuota lowongan langsung",
    },
    {
      icon: Clock,
      value: `${PLATFORM_STATS.avgTimeToPlacement} bln`,
      label: "Rata-rata Waktu Penempatan",
      labelJp: "平均内定期間",
      desc: "Waktu efisien dari modul pertama hingga perolehan COE & visa",
    },
  ];

  return (
    <section id="stats" className="py-16 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.labelJp}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-1">
                    {item.value}
                  </div>

                  <div className="text-sm font-bold text-slate-800 mb-2">
                    {item.label}
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed pt-3 border-t border-slate-200/60">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bilateral Trust Footnote */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 text-center">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Terdaftar & Terpantau di Sistem Perlindungan Tenaga Kerja Bilateral
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Penempatan di Prefektur Utama: Tokyo, Osaka, Aichi, Kanagawa
          </span>
        </div>
      </div>
    </section>
  );
}
