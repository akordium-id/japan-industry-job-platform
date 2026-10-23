import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Live market pulse ticker items reflecting authentic bilateral hiring quotas
const LIVE_MARKET_SNAPSHOT = [
  {
    id: 1,
    role: "Precision Machining & CAM",
    roleJp: "精密加工・マシニング",
    company: "Chubu Precision Co.",
    prefecture: "Aichi (愛知県)",
    salary: "¥270,000 ~ ¥340,000",
    visa: "SSW 1 / Tokutei",
    jlpt: "N4",
    quota: "4 Posisi Terbuka",
  },
  {
    id: 2,
    role: "Automotive Quality Control",
    roleJp: "自動車電装・品質管理",
    company: "Kanto Auto Parts Corp.",
    prefecture: "Kanagawa (神奈川県)",
    salary: "¥285,000 ~ ¥360,000",
    visa: "Gijinkoku (Engineer)",
    jlpt: "N3",
    quota: "2 Posisi Terbuka",
  },
  {
    id: 3,
    role: "Cloud Infrastructure Eng.",
    roleJp: "クラウドインフラ技術者",
    company: "NextGen Media Tokyo",
    prefecture: "Tokyo (東京都)",
    salary: "¥350,000 ~ ¥450,000",
    visa: "Gijinkoku (Engineer)",
    jlpt: "N2",
    quota: "3 Posisi Terbuka",
  },
];

export function HeroSection() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedJlpt, setSelectedJlpt] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSpecialization) params.set("specialization", selectedSpecialization);
    if (selectedJlpt) params.set("minJlpt", selectedJlpt);
    navigate(`/student/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const getDashboardPath = () => {
    if (!isAuthenticated) return "/register";
    switch (user?.role) {
      case "student":
        return "/student";
      case "corporate":
        return "/corporate";
      case "educator_bilingual":
      case "educator_silver":
        return "/educator";
      case "alumni":
        return "/career";
      case "admin":
        return "/admin/verifications";
      default:
        return "/student";
    }
  };

  return (
    <section className="relative bg-white border-b border-slate-200">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
        {/* Top Header Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-8 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-xs bg-red-600" />
            <span className="font-bold text-slate-900 uppercase tracking-wider">Japan Industry Job Platform</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 font-sans font-medium">日尼公式産業人材プラットフォーム</span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Resmi Bilateral (SSW & 技・人・国)
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Zero Exploitation Standard</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Direct Value Proposition & Live Search */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] mb-5">
              Jembatan Karier Profesional Menuju{" "}
              <span className="underline decoration-red-600 decoration-3 underline-offset-4">
                Pusat Industri Jepang
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-2xl">
              Platform bilateral terstandarisasi untuk talenta teknik, manufaktur, IT, dan profesional Indonesia.
              Mulai dari pelatihan bahasa industri, sertifikasi Rirekisho JIS (履歴書), hingga kontrak penempatan resmi bersama konsorsium industri Jepang.
            </p>

            {/* Practical Quick Search & Filter Bar */}
            <form
              onSubmit={handleSearch}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs mb-6"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 mb-2 flex items-center justify-between">
                <span>Pencarian Cepat Kuota Lowongan</span>
                <span className="text-[11px] font-normal lowercase text-slate-400">filter kualifikasi awal</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full h-11 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-red-600 font-medium"
                    aria-label="Pilih Bidang Spesialisasi"
                  >
                    <option value="">Semua Bidang Keahlian</option>
                    <option value="Engineering">Rekayasa & Manufaktur Presisi</option>
                    <option value="IT">IT, Cloud & Rekayasa Perangkat Lunak</option>
                    <option value="Hospitality">Hospitality & Manajemen Layanan</option>
                    <option value="Agriculture">Pertanian Presisi & Pangan</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedJlpt}
                    onChange={(e) => setSelectedJlpt(e.target.value)}
                    className="w-full h-11 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-red-600 font-medium"
                    aria-label="Pilih Target JLPT"
                  >
                    <option value="">Level JLPT</option>
                    <option value="N4">Minimal N4</option>
                    <option value="N3">Minimal N3</option>
                    <option value="N2">Minimal N2</option>
                    <option value="N1">N1 Mahir</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Search className="w-4 h-4" />
                    <span>Cari Kuota</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Action Links & Portal Access */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-1.5 text-slate-900 hover:text-red-600 transition-colors"
              >
                <span>{isAuthenticated ? "Masuk ke Dashboard Anda" : "Registrasi Calon Kandidat Baru"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                to="/corporate"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Portal Rekrutmen Perusahaan Mitra (企業窓口)</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Hero Photo Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-100">
              {/* Authentic Unsplash Editorial Image: High-Tech Modern Japanese Industrial Environment */}
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"
                alt="Talenta teknik dan otomasi bekerja di industri Jepang"
                className="w-full h-80 sm:h-96 object-cover object-center"
                loading="eager"
              />

              {/* Gradient Overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Floating Badge on Photo */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>愛知県豊田市 • Aichi Prefecture Hub</span>
              </div>

              {/* Live Hiring Ledger Overlay inside Hero */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-red-400" />
                    Lowongan Terverifikasi Aktif
                  </span>
                  <span className="text-emerald-400 font-semibold">Aktif Hari Ini</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {LIVE_MARKET_SNAPSHOT.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="truncate max-w-[180px] font-medium text-slate-100">
                        {item.role}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-amber-300 font-semibold">{item.salary}</span>
                        <Badge variant="default" size="sm" className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] py-0 px-1.5">
                          {item.jlpt}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Standar Upah Minimum Regional
                  </span>
                  <Link to="/student/jobs" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
                    Lihat 120+ Posisi <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
