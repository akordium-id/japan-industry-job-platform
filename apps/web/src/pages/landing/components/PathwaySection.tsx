import {
  BookOpen,
  FileCheck2,
  Users2,
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
    step: "STEP 01",
    phase: "Fondasi Kompetensi",
    title: "Bahasa & Etika Industri",
    titleJp: "語学力 & 労働安全・マナー",
    points: [
      "Kurikulum terarah N5–N3 untuk kebutuhan nyata industri kerja",
      "Latihan etika kerja Jepang: Hou-Ren-So, Nemawashi, Tatemae",
      "Bimbingan tutor bilingual bersertifikasi pengajaran industri",
    ],
    output: "Sertifikasi Kesiapan Bahasa N3/N4",
  },
  {
    step: "STEP 02",
    phase: "Standardisasi Berkas",
    title: "Rirekisho JIS & Vault Digital",
    titleJp: "JIS規格履歴書 & 身元保証",
    points: [
      "Pembuatan otomatis Rirekisho & Shokumu Keirekisho format JIS",
      "Verifikasi berkas legal (Ijazah, KTP, Transkrip & Kualifikasi)",
      "Brankas enkripsi digital untuk portofolio siap review HR Jepang",
    ],
    output: "Verified Dossier Siap Seleksi",
  },
  {
    step: "STEP 03",
    phase: "Kurasi & Wawancara",
    title: "Interview Langsung & Keigo",
    titleJp: "模擬面接 & 企業選考",
    points: [
      "Pencocokan kualifikasi dengan lowongan perusahaan mitra terdaftar",
      "Simulasi wawancara teknis bersama mantan eksekutif industri (Silver Mentors)",
      "Penguasaan bahasa hormat Keigo untuk rapat & seleksi kerja",
    ],
    output: "Surat Penawaran (Naitei / 内定)",
  },
  {
    step: "STEP 04",
    phase: "Penempatan & Legalitas",
    title: "COE, Visa Kerja, & Berangkat",
    titleJp: "在留資格COE & 渡航支援",
    points: [
      "Pengurusan Certificate of Eligibility (COE) imigrasi resmi",
      "Penerbitan visa kerja (Tokutei Ginou 1 & 2 / Gijinkoku)",
      "Briefing keberangkatan, penyediaan asrama, & monitoring karier",
    ],
    output: "Penempatan Kerja Resmi di Jepang",
  },
];

export function PathwaySection() {
  return (
    <section id="pathway" className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest mb-2">
              Standard Compliance Pipeline • 日本就職ロードマップ
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              4 Tahap Resmi Menuju Karier Profesional di Jepang
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Alur terstruktur dan bergaransi legalitas tanpa perantara gelap. Setiap kandidat dibekali dokumen standar industri dan pendampingan visa lengkap.
            </p>
          </div>
          <Button asChild variant="outline" size="md" className="shrink-0 font-semibold">
            <Link to="/student" className="inline-flex items-center gap-2">
              <span>Mulai Tahap 1 Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* 4 Pipeline Columns with Clean Tabular Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PATHWAY_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 p-5 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs font-mono">
                  <span className="font-bold text-slate-900">{item.step}</span>
                  <span className="text-slate-500 font-medium">{item.phase}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5 mb-4">
                  {item.titleJp}
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Hasil Terverifikasi:
                </div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
