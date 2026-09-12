import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
  MapPin,
  Coins,
  Award,
  FileCheck2,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  const { isAuthenticated, user } = useAuth();

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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 text-slate-900 pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/80">
      {/* Subtle Japanese geometric grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:20px_20px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copywriting & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Program Resmi Bilateral Indonesia – Jepang</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-mono text-[11px]">
                日尼公式人材交流
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] mb-4">
              Karier Nyata di Pusat{" "}
              <span className="text-red-600 inline-block relative">
                Industri Jepang
              </span>
              <br />
              <span className="text-slate-800 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Resmi, Transparan, & Terpercaya.
              </span>
            </h1>

            {/* Subtitle bilingual */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 mb-6 tracking-wide">
              <span>
                {BRAND_NAME} — {BRAND_TAGLINE}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-slate-600 font-mono">
                日本企業直結の就職支援プラットフォーム
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Bimbingan pra-migrasi terintegrasi dari nol hingga penempatan
              kerja resmi. Kuasai bahasa & etika kerja industri (Hou-Ren-So),
              amankan berkas di Vault digital, dan dapatkan kontrak kerja
              langsung dari perusahaan Jepang terkemuka.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20 px-7 py-3.5 text-base transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Link
                  to="/student/jobs"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Jelajahi Lowongan Jepang</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold px-7 py-3.5 text-base shadow-2xs hover:border-slate-400"
              >
                <Link to={getDashboardPath()}>
                  {isAuthenticated
                    ? "Buka Portal Dashboard"
                    : "Daftar Calon Kandidat"}
                </Link>
              </Button>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 w-full text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  100% Visa Kerja Resmi (SSW & Gijinkoku)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Bimbingan Eksekutif Mentor ex-Toyota
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Standar Upah Transparan Tanpa Potongan
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Japanese Dual Card Stack */}
          <div className="lg:col-span-5 relative">
            {/* Background Hanko Stamp Watermark */}
            <div
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-4 border-dashed border-red-600/15 flex items-center justify-center rotate-12 pointer-events-none select-none"
            >
              <div className="text-center font-serif text-red-600/20 font-bold text-xs tracking-widest uppercase">
                JIJP OFFICIAL
                <br />
                公認認定
                <br />
                STANDARD
              </div>
            </div>

            {/* Stack Container */}
            <div className="relative space-y-4">
              {/* Card 1: Verified Candidate Talent Card */}
              <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-lg shadow-slate-200/50 relative z-10 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      AF
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">
                          Ahmad Fauzi
                        </span>
                        <span className="text-xs text-slate-400">
                          • Bandung
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        Otomasi & Rekayasa Mesin Presisi
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="success"
                    size="sm"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Talent</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400">
                      Kemampuan Bahasa
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      JLPT N3 Lulus
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400">
                      Skor Budaya & Keigo
                    </div>
                    <div className="text-xs font-bold text-emerald-600">
                      92% Ready
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400">
                      Status Berkas
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Vault Valid
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rirekisho JIS Terverifikasi</span>
                  </span>
                  <span className="font-semibold text-slate-700">
                    Kesiapan: Tahap 3 / 4
                  </span>
                </div>
              </div>

              {/* Card 2: Official Corporate Match & Offer Letter Preview */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 shadow-xl relative z-20 border border-slate-800">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                      <Building2 className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>Chubu Precision Co. • Aichi (愛知県)</span>
                      </div>
                      <div className="font-bold text-white text-sm">
                        Automated Line Quality Engineer
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="accent"
                    size="sm"
                    className="bg-red-500/20 text-red-300 border-red-500/30"
                  >
                    <Sparkles className="w-3 h-3 text-red-400" />
                    <span>94% Match</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 my-3">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Lokasi Kerja</span>
                    </div>
                    <div className="font-semibold text-slate-200 text-xs mt-0.5">
                      Toyota City, Aichi
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>Standar Gaji Bersih</span>
                    </div>
                    <div className="font-bold text-amber-400 text-xs mt-0.5">
                      ¥285,000 / bln
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Jalur Visa: Gijinkoku / SSW 2</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>COE Sponsorship Ready</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
