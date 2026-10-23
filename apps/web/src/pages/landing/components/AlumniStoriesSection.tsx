import { Quote, Award, Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

const STORIES = [
  {
    id: "rina",
    name: "Rina Kusuma",
    role: "Quality Assurance Engineer",
    company: "Nippon Steel Corporation",
    location: "Osaka, Japan (大阪府)",
    program: "Teknik Material & Manufaktur",
    avatarInitial: "RK",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    quote:
      "Saya memulai persiapan dari nol. Melalui modul Keigo dan simulasi wawancara teknis di JIJP, saya langsung percaya diri saat berhadapan dengan HR Nippon Steel. Kontrak kerja resmi tanpa perantara membuat keluarga di rumah merasa tenang.",
    jlptPassed: "N3 Passed",
    tenure: "1.5 Tahun di Jepang",
  },
  {
    id: "fauzi",
    name: "Ahmad Fauzi",
    role: "Automated Line Specialist",
    company: "Aichi Automotive Components Co.",
    location: "Nagoya, Aichi (愛知県)",
    program: "Otomasi Industri & Robotika",
    avatarInitial: "AF",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote:
      "Bimbingan etika Hou-Ren-So dan Nemawashi dari mentor senior ex-Toyota sangat nyata manfaatnya. Begitu masuk lingkungan pabrik, saya tidak merasa asing dengan ritme kerja dan langsung dipercaya mengoperasikan mesin kontrol utama.",
    jlptPassed: "N3 Passed",
    tenure: "1 Tahun di Jepang",
  },
  {
    id: "dewi",
    name: "Dewi Rahayu",
    role: "Cloud Frontend Developer",
    company: "Tokyo IT Solutions Inc.",
    location: "Shinjuku, Tokyo (東京都)",
    program: "Sistem Informasi & Rekayasa Perangkat Lunak",
    avatarInitial: "DR",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    quote:
      "Proses pembuatan Rirekisho standar JIS otomatis di JIJP sangat mempermudah saya. Dokumen portofolio saya langsung lolos screening awal, dan proses visa Engineer diurus secara transparan hingga saya mendarat di Tokyo.",
    jlptPassed: "N2 Passed",
    tenure: "2 Tahun di Jepang",
  },
];

export function AlumniStoriesSection() {
  return (
    <section id="alumni" className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-3">
            <span>Kisah Nyata Alumni • 修了生の実績</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Dari Indonesia Menuju Pusat Industri Jepang
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Dengar langsung pengalaman para profesional muda yang telah menyelesaikan pembekalan JIJP dan kini berkarier resmi di Jepang.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="rounded-xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <div>
                <Quote className="w-6 h-6 text-slate-300 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center gap-3">
                  <img
                    src={story.photo}
                    alt={story.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {story.name}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{story.role}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{story.company}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] pt-3 border-t border-slate-200/60 text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {story.location}
                  </span>
                  <Badge variant="jlpt-n3" size="sm">
                    {story.jlptPassed}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mentor Spotlight Banner */}
        <div className="mt-10 rounded-2xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3">
              <div className="rounded-xl overflow-hidden border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                  alt="Yamamoto Kenji, Senior Industry Mentor"
                  className="w-full h-44 object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 text-xs font-mono font-medium mb-3">
                <Award className="w-3.5 h-3.5 text-red-400" />
                <span>Senior Mentor Network • シニアメンター代表</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                &ldquo;Karakter, kepatuhan keselamatan (5S), dan etika kerja adalah kunci keberlanjutan talenta global di industri Jepang.&rdquo;
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                Setiap kandidat tahap lanjutan didampingi tatap muka secara berkala oleh mantan eksekutif industri manufaktur Jepang untuk simulasi rapat bisnis dan pemahaman etika Keigo sebelum keberangkatan.
              </p>
              <div className="text-xs text-slate-400 font-mono">
                — Yamamoto Kenji (山本 健二), Former Quality Director (Retired — Toyota Group Supplier)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
