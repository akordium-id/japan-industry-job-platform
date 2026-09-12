import { Quote, Award, Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

const STORIES = [
  {
    id: "rina",
    name: "Rina Kusuma",
    role: "Quality Engineer",
    company: "Nippon Steel Corporation",
    location: "Osaka, Japan (大阪府)",
    program: "Teknik Material & Manufaktur",
    avatarInitial: "RK",
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
    quote:
      "Proses pembuatan Rirekisho standar JIS otomatis di JIJP sangat mempermudah saya. Dokumen portofolio saya langsung lolos screening awal, dan proses visa Engineer diurus secara transparan hingga saya mendarat di Tokyo.",
    jlptPassed: "N2 Passed",
    tenure: "2 Tahun di Jepang",
  },
];

export function AlumniStoriesSection() {
  return (
    <section id="alumni" className="py-20 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            <span>Kisah Sukses Alumni</span>
            <span>•</span>
            <span className="font-normal font-mono">修了生の声</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dari Indonesia Menuju Pusat Industri Jepang
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Dengar langsung pengalaman rekan-rekanmu yang telah menyelesaikan
            program persiapan JIJP dan kini membangun karier cemerlang di
            berbagai prefektur Jepang.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-red-500/40 mb-4" />
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {story.avatarInitial}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {story.name}
                    </div>
                    <div className="text-xs text-slate-600">{story.role}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
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

        {/* Mentor Spotlight Card */}
        <div className="mt-12 rounded-3xl bg-slate-900 text-white p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold mb-4">
                <Award className="w-3.5 h-3.5 text-red-400" />
                <span>Senior Mentor Network • シニアメンタープログラム</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                &ldquo;Karakter dan pemahaman etika kerja adalah kunci
                keberhasilan talenta global di Jepang.&rdquo;
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Para kandidat JIJP mendapatkan bimbingan tatap muka langsung
                secara daring dengan mentor senior purnatugas korporasi global
                Jepang seperti Toyota, Panasonic, dan Nippon Steel untuk
                memahami ekspektasi kerja sebelum menginjakkan kaki di Jepang.
              </p>
              <div className="text-xs text-slate-400 font-mono">
                — Yamamoto Kenji (山本 健二), Senior Industry Mentor (Retired —
                Toyota Motor Corporation)
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-3xl font-black text-amber-400 mb-1">
                100%
              </div>
              <div className="text-sm font-bold text-white mb-1">
                Executive Industry Mentorship
              </div>
              <div className="text-xs text-slate-400">
                Setiap kandidat tahap 3 didampingi mentor berpengalaman &gt;25
                tahun di industri Jepang.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
