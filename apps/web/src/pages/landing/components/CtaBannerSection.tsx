import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function CtaBannerSection() {
  return (
    <section className="py-16 lg:py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Formal Intake Batch Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Batch Pembekalan Kerja Kuartal Berjalan Dibuka</span>
          <span className="text-slate-500">|</span>
          <span className="text-red-400 font-semibold font-sans">公式募集受付中</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
          Langkah Pasti Memulai Karier di Pusat Industri Jepang
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Bangun penguasaan bahasa etika kerja, terbitkan berkas Rirekisho standar JIS, dan amankan kontrak kerja resmi tanpa perantara liar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <Button
            asChild
            size="lg"
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 text-sm rounded-lg shadow-xs w-full sm:w-auto cursor-pointer"
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2"
            >
              <span>Registrasi Calon Kandidat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold px-6 py-3.5 text-sm rounded-lg w-full sm:w-auto cursor-pointer"
          >
            <Link to="/corporate">
              <span>Konsorsium Perusahaan Mitra (企業専用)</span>
            </Link>
          </Button>
        </div>

        {/* Bilateral Integrity Guarantee */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            100% Kepatuhan Visa Kerja Resmi (SSW & Gijinkoku)
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            Tanpa Biaya Perantara Liar atau Pemotongan Gaji Sepihak
          </span>
        </div>
      </div>
    </section>
  );
}
