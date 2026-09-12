import {
  BookOpen,
  FileCheck2,
  Sparkles,
  PlaneTakeoff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const PATHWAY_STEPS = [
  {
    step: "01",
    phase: "Tahap Fondasi",
    title: "Bahasa & Budaya Kerja",
    titleJp: "基礎日本語 & 職場文化",
    icon: BookOpen,
    color: "from-blue-500/20 to-blue-600/5 text-blue-600 border-blue-200",
    badgeVariant: "student" as const,
    points: [
      "Kurikulum terarah N5–N3 untuk kebutuhan nyata industri",
      "Latihan etika kerja Jepang: Hou-Ren-So, Nemawashi, Tatemae",
      "Bimbingan tutor bilingual Indonesia-Jepang bersertifikat",
    ],
  },
  {
    step: "02",
    phase: "Tahap Standardisasi",
    title: "Vault Berkas & Rirekisho",
    titleJp: "書類審査 & 履歴書完成",
    icon: FileCheck2,
    color:
      "from-purple-500/20 to-purple-600/5 text-purple-600 border-purple-200",
    badgeVariant: "corporate" as const,
    points: [
      "Pembuatan otomatis Rirekisho & Shokumu Keirekisho format JIS",
      "Verifikasi integritas berkas (Ijazah, KTP, Sertifikat JLPT)",
      "Brankas terenkripsi dengan proteksi privasi ketat",
    ],
  },
  {
    step: "03",
    phase: "Tahap Kurasi",
    title: "AI Match & Interview Mentor",
    titleJp: "AIマッチング & 模擬面接",
    icon: Sparkles,
    color: "from-amber-500/20 to-amber-600/5 text-amber-600 border-amber-200",
    badgeVariant: "warning" as const,
    points: [
      "Algoritma AI memetakan kompetensimu ke lowongan paling relevan",
      "Simulasi wawancara bisnis langsung bersama eksekutif purnatugas",
      "Pelatihan Keigo tingkat lanjut untuk komunikasi profesional",
    ],
  },
  {
    step: "04",
    phase: "Tahap Penempatan",
    title: "Visa COE & Relokasi Resmi",
    titleJp: "ビザ発給 & 定着支援",
    icon: PlaneTakeoff,
    color:
      "from-emerald-500/20 to-emerald-600/5 text-emerald-600 border-emerald-200",
    badgeVariant: "success" as const,
    points: [
      "Penerbitan kontrak kerja resmi tanpa potongan gaji liar",
      "Pengurusan visa kerja resmi (SSW / Gijinkoku) & COE imigrasi",
      "Pendampingan karier jangka panjang & jaringan alumni di Jepang",
    ],
  },
];

export function PathwaySection() {
  return (
    <section
      id="pathway"
      className="py-20 bg-slate-50 border-y border-slate-200/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-700 uppercase tracking-wider mb-3">
            <span>The Pathway to Japan</span>
            <span>•</span>
            <span className="font-normal font-mono">
              日本就職のロードマップ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            4 Tahap Pasti Menuju Karier Profesional di Jepang
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Tidak perlu bingung harus mulai dari mana. JIJP menyediakan
            ekosistem terpadu yang memandu setiap langkahmu dari persiapan dasar
            hingga penempatan kerja resmi.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PATHWAY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  {/* Top Row: Number & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-red-500 transition-colors">
                      {step.step}
                    </span>
                    <Badge variant={step.badgeVariant} size="sm">
                      {step.phase}
                    </Badge>
                  </div>

                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-slate-700 group-hover:text-red-600 transition-colors" />
                  </div>

                  {/* Title & JP */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {step.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mb-4">
                    {step.titleJp}
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {step.points.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subfooter */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Langkah {idx + 1} dari 4</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pathway Callout Box */}
        <div className="mt-12 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                Transparansi 100% & Kepatuhan Regulasi Bilateral
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Seluruh program dan mitra perusahaan terdaftar resmi di bawah
                kerangka kerja sama industri Indonesia-Jepang.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="primary"
            size="md"
            className="shrink-0 font-semibold"
          >
            <Link to="/student/courses">Lihat Modul Persiapan</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
