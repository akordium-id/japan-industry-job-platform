import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

const ROLES_DATA = [
  {
    id: "candidate",
    label: "Kandidat & Mahasiswa",
    labelJp: "学生・候補者",
    icon: GraduationCap,
    headline: "Wujudkan Karier Profesional di Pusat Industri Dunia",
    description:
      "Akses persiapan terstruktur dan terakreditasi untuk bekerja di Jepang. Tanpa perantara ilegal, tanpa pungutan liar, dengan bimbingan penuh hingga kamu beradaptasi di Jepang.",
    benefits: [
      "Kurikulum bahasa Jepang industri & simulasi rapat bisnis",
      "Brankas dokumen aman & pembuatan otomatis Rirekisho format JIS",
      "Pencocokan langsung dengan perusahaan mitra terkemuka di Jepang",
      "Dukungan jaringan alumni resmi JIJP di Tokyo, Osaka, dan Nagoya",
    ],
    ctaText: "Mulai Daftar Sebagai Kandidat",
    ctaLink: "/register",
    badgeText: "Untuk Talenta Muda",
  },
  {
    id: "corporate",
    label: "Perusahaan Jepang",
    labelJp: "日本企業・採用担当",
    icon: Building2,
    headline: "Rekrut Talenta Kerja yang Tervalidasi Kesiapan Budayanya",
    description:
      "Temukan tenaga ahli dan teknisi muda terampil melalui sistem scoring kesiapan komprehensif (bahasa, budaya, teknis) untuk meminimalkan risiko mismatch dan turnover.",
    benefits: [
      "AI Smart Matching berbasis skor kesiapan kompetensi riil",
      "Profil kandidat lengkap dengan video wawancara & rekaman Keigo",
      "Dukungan legalitas visa kerja, COE, dan compliance ketenagakerjaan",
      "Dashboard scout langsung untuk mengirim tawaran kerja (Scout)",
    ],
    ctaText: "Masuk Portal Rekrutmen Korporat",
    ctaLink: "/corporate",
    badgeText: "Untuk HR & Pemberi Kerja",
  },
  {
    id: "educator",
    label: "Pendidik & Mentor Senior",
    labelJp: "教育者・シニアメンター",
    icon: Users,
    headline: "Transfer Pengetahuan Berharga Kepada Generasi Penerus",
    description:
      "Wadah kolaborasi bagi instruktur bilingual dan para purnatugas eksekutif industri manufaktur Jepang (Silver Mentors) untuk membimbing talenta menuju standar tertinggi.",
    benefits: [
      "Jadwal pelatihan fleksibel dengan kelas daring interaktif",
      "Dashboard evaluasi perkembangan kompetensi siswa real-time",
      "Ruang simulasi negosiasi bisnis dan etika korporasi Jepang",
      "Kompensasi profesional & pengakuan kontribusi bilateral",
    ],
    ctaText: "Akses Portal Pendidik & Mentor",
    ctaLink: "/educator",
    badgeText: "Untuk Pengajar & Mentor",
  },
];

export function RoleAudienceSection() {
  const [activeTab, setActiveTab] = useState("candidate");
  const currentRole =
    ROLES_DATA.find((r) => r.id === activeTab) ?? ROLES_DATA[0]!;
  const IconComponent = currentRole.icon;

  return (
    <section id="roles" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            <span>Peran Ekosistem</span>
            <span>•</span>
            <span className="font-normal font-mono">対象別プログラム</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Satu Platform, Solusi untuk Seluruh Pemangku Kepentingan
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            JIJP menyatukan pencari kerja berkualitas, korporasi pemberi kerja
            di Jepang, dan para ahli industri dalam satu alur terintegrasi.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs gap-1.5 max-w-full overflow-x-auto">
            {ROLES_DATA.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <RoleIcon
                    className={`w-4 h-4 ${isSelected ? "text-red-400" : "text-slate-500"}`}
                  />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left detail info */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-200">
                <span>{currentRole.badgeText}</span>
                <span>•</span>
                <span className="font-mono">{currentRole.labelJp}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
                {currentRole.headline}
              </h3>

              <p className="text-base text-slate-600 leading-relaxed mb-8">
                {currentRole.description}
              </p>

              {/* Benefits checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {currentRole.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" variant="primary" className="font-bold">
                <Link
                  to={currentRole.ctaLink}
                  className="inline-flex items-center gap-2"
                >
                  <span>{currentRole.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Right visual card showcase */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-6">
                  <IconComponent className="w-7 h-7" />
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-300">
                        Standar Kompetensi
                      </span>
                      <span className="text-emerald-400 font-bold">
                        100% Verified
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Memastikan kesiapan bahasa, kesopanan etika bisnis
                      (Keigo), dan pemahaman keselamatan kerja (5S).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-300">
                        Jaminan Kemitraan
                      </span>
                      <span className="text-sky-400 font-bold">
                        Resmi Bilateral
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Sinergi langsung antara institusi pendidikan Indonesia
                      dengan konsorsium industri Jepang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
