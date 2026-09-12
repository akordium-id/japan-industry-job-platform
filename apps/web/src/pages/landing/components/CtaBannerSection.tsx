import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function CtaBannerSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Visual background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-red-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-red-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Batch Pembekalan Baru Telah Dibuka</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-300">募集開始</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Siap Membuka Pintu Kariermu di{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
            Pusat Industri Jepang?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Jangan tunda lagi. Mulai bangun fondasi bahasa, susun Rirekisho standar JIS, dan raih kesempatan wawancara dengan perusahaan Jepang terkemuka hari ini.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button
            asChild
            size="lg"
            variant="primary"
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 text-base shadow-xl shadow-red-900/30 w-full sm:w-auto"
          >
            <Link to="/register" className="inline-flex items-center justify-center gap-2">
              <span>Daftar Akun Kandidat Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold px-6 py-4 text-base w-full sm:w-auto"
          >
            <Link to="/student/courses">
              Pelajari Modul Kurikulum
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-6 border-t border-slate-800/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pendaftaran Bebas Biaya Awal</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enkripsi Berkas Digital Tingkat Lanjut</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pendampingan Resmi Hingga Penempatan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
