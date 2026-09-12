import { Link } from "react-router-dom";
import { Globe, Mail, MapPin } from "lucide-react";

import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col (2 cols span on large) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs tracking-tighter shadow-xs group-hover:scale-105 transition-transform">
                JP
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  {BRAND_NAME}
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  {BRAND_TAGLINE}
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Ekosistem pra-migrasi terpadu untuk talenta Indonesia menuju
              industri Jepang — dari fondasi bahasa, verifikasi dokumen aman,
              kurasi AI Smart Matching, hingga penempatan resmi.
            </p>

            <div className="text-[11px] font-mono text-slate-500">
              日尼公式クロスボーダー人材プラットフォーム
            </div>

            <div className="pt-2 space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Jakarta • Surabaya • Tokyo (Minato-ku)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>kontak resmi: support@jijp.id</span>
              </div>
            </div>
          </div>

          {/* Col 1: Program & Ekosistem */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Program & Pembekalan
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#pathway"
                  className="hover:text-white transition-colors"
                >
                  The Pathway to Japan
                </a>
              </li>
              <li>
                <Link
                  to="/student/courses"
                  className="hover:text-white transition-colors"
                >
                  Kurikulum Bahasa & Budaya
                </Link>
              </li>
              <li>
                <Link
                  to="/student/cv"
                  className="hover:text-white transition-colors"
                >
                  Rirekisho Format JIS
                </Link>
              </li>
              <li>
                <Link
                  to="/student/vault"
                  className="hover:text-white transition-colors"
                >
                  Brankas Berkas Terenkripsi
                </Link>
              </li>
              <li>
                <Link
                  to="/student/calendar"
                  className="hover:text-white transition-colors"
                >
                  Jadwal Sesi Mentoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Peluang Kerja */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Peluang Karier
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/student/jobs"
                  className="hover:text-white transition-colors"
                >
                  Papan Lowongan Kerja
                </Link>
              </li>
              <li>
                <Link
                  to="/student/jobs?spec=Engineering"
                  className="hover:text-white transition-colors"
                >
                  Teknik & Otomasi Manufaktur
                </Link>
              </li>
              <li>
                <Link
                  to="/student/jobs?spec=IT"
                  className="hover:text-white transition-colors"
                >
                  Software & Sistem Cloud
                </Link>
              </li>
              <li>
                <Link
                  to="/career"
                  className="hover:text-white transition-colors"
                >
                  Jenjang Karier Alumni
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Korporasi & Mitra */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              Untuk Perusahaan
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/corporate"
                  className="hover:text-white transition-colors"
                >
                  Portal Rekrutmen (企業ポータル)
                </Link>
              </li>
              <li>
                <Link
                  to="/corporate/jobs"
                  className="hover:text-white transition-colors"
                >
                  Kelola Lowongan Perusahaan
                </Link>
              </li>
              <li>
                <Link
                  to="/corporate/scout"
                  className="hover:text-white transition-colors"
                >
                  AI Talent Scout Engine
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Pusat Bantuan & FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            © {new Date().getFullYear()} {BRAND_NAME} ({BRAND_TAGLINE}). All
            rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Indonesia • 日本語 • English</span>
            </span>
            <span>Bilateral Cross-border Labor Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
