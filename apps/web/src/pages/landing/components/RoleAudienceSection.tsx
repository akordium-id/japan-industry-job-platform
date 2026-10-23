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
      "Akses persiapan terstruktur dan terakreditasi untuk bekerja di Jepang. Tanpa perantara gelap, tanpa pungutan liar, dengan bimbingan penuh hingga kamu beradaptasi di tempat kerja.",
    benefits: [
      "Kurikulum bahasa Jepang industri & simulasi rapat bisnis",
      "Brankas dokumen aman & pembuatan otomatis Rirekisho format JIS",
      "Pencocokan langsung dengan perusahaan mitra terkemuka di Jepang",
      "Dukungan jaringan alumni resmi JIJP di Tokyo, Osaka, dan Nagoya",
    ],
    ctaText: "Mulai Daftar Sebagai Kandidat",
    ctaLink: "/register",
    badgeText: "Untuk Talenta Muda",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    imageCaption: "Pembekalan bahasa & simulasi budaya kerja industri di kelas intensif JIJP",
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
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    imageCaption: "Kantor perwakilan dan mitra korporat industri di Tokyo & Aichi",
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
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    imageCaption: "Bimbingan tatap muka Keigo dan etika industri bersama Silver Mentors",
  },
];

export function RoleAudienceSection() {
  const [activeTab, setActiveTab] = useState("candidate");
  const currentRole =
    ROLES_DATA.find((r) => r.id === activeTab) ?? ROLES_DATA[0]!;

  return (
    <section id="roles" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200/80 border border-slate-300 text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-3">
            <span>Program Spesifik Pemangku Kepentingan</span>
            <span>•</span>
            <span className="font-normal font-sans">対象別プログラム</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Satu Ekosistem untuk Seluruh Pihak Terlibat
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            JIJP menyatukan pencari kerja berkualitas, korporasi pemberi kerja di Jepang, dan para ahli industri dalam satu alur terintegrasi.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs gap-1.5 max-w-full overflow-x-auto">
            {ROLES_DATA.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
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
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left detail info */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold mb-3 border border-red-200">
                <span>{currentRole.badgeText}</span>
                <span>•</span>
                <span className="font-mono">{currentRole.labelJp}</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                {currentRole.headline}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                {currentRole.description}
              </p>

              {/* Benefits checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentRole.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="md" variant="primary" className="bg-red-600 hover:bg-red-700 font-bold">
                <Link
                  to={currentRole.ctaLink}
                  className="inline-flex items-center gap-2"
                >
                  <span>{currentRole.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Right photography showcase */}
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm relative group">
                <img
                  src={currentRole.image}
                  alt={currentRole.headline}
                  className="w-full h-72 sm:h-80 object-cover object-center transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-medium text-[11px] truncate">{currentRole.imageCaption}</span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">JIJP FIELD DOCUMENTATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
