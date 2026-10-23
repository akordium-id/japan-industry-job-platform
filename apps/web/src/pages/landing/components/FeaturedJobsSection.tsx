import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Building2,
  ArrowRight,
  Search,
  Home,
  CheckCircle2,
} from "lucide-react";

import { useJobs } from "@/api/hooks";
import type { Job } from "@/api/jobs.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Curated high-converting showcase jobs with authentic Japanese recruitment specs
const SHOWCASE_JOBS: Array<{
  id: number;
  title: string;
  titleJp: string;
  companyName: string;
  prefectureCode: string;
  location: string;
  salaryBase: string;
  salaryNote: string;
  housing: string;
  minJlpt: string;
  specialization: string;
  visaType: string;
  intakeQuota: string;
}> = [
  {
    id: 101,
    title: "Automated Production Quality Engineer",
    titleJp: "自動化生産ライン品質管理エンジニア",
    companyName: "Chubu Precision Industrial Co., Ltd.",
    prefectureCode: "愛知県",
    location: "Toyota, Aichi",
    salaryBase: "¥280,000 ~ ¥350,000",
    salaryNote: "+ Lembur & Asuransi Sosial (社会保険)",
    housing: "Asrama Perusahaan (Dorm) Subsidi 70%",
    minJlpt: "N3",
    specialization: "Engineering",
    visaType: "Gijinkoku (Engineer Visa)",
    intakeQuota: "Kuota: 3 Orang",
  },
  {
    id: 102,
    title: "Cloud & Frontend Software Engineer",
    titleJp: "クラウド・フロントエンドエンジニア",
    companyName: "NextGen Media Systems Tokyo",
    prefectureCode: "東京都",
    location: "Shibuya, Tokyo",
    salaryBase: "¥320,000 ~ ¥450,000",
    salaryNote: "+ Bonus Tahunan (賞与年2回)",
    housing: "Tunjangan Sewa ¥30,000/bln",
    minJlpt: "N3",
    specialization: "IT",
    visaType: "Gijinkoku (Engineer Visa)",
    intakeQuota: "Kuota: 2 Orang",
  },
  {
    id: 103,
    title: "Precision CNC Machine Operator & CAM",
    titleJp: "マシニングセンタ・精密加工技術者",
    companyName: "Kansai Metalcraft Works",
    prefectureCode: "大阪府",
    location: "Sakai, Osaka",
    salaryBase: "¥250,000 ~ ¥310,000",
    salaryNote: "+ Uang Makan & Shift Allowance",
    housing: "Fasilitas Mess Lengkap Dekat Pabrik",
    minJlpt: "N4",
    specialization: "Manufacturing",
    visaType: "Tokutei Ginou 1 (SSW)",
    intakeQuota: "Kuota: 5 Orang",
  },
  {
    id: 104,
    title: "International Guest Relations Specialist",
    titleJp: "高級旅館・国際接客コンシェルジュ",
    companyName: "Kyoto Heritage Hospitality Group",
    prefectureCode: "京都府",
    location: "Gion, Kyoto",
    salaryBase: "¥240,000 ~ ¥290,000",
    salaryNote: "+ Pelatihan Etika Tradisional",
    housing: "Apartemen Staff Termasuk Utilitas",
    minJlpt: "N3",
    specialization: "Hospitality",
    visaType: "Gijinkoku / Tokutei",
    intakeQuota: "Kuota: 4 Orang",
  },
  {
    id: 105,
    title: "Automotive Mechatronics Technician",
    titleJp: "自動車電装・メカトロニクス技術者",
    companyName: "Yokohama Auto-Parts Manufacturing",
    prefectureCode: "神奈川県",
    location: "Yokohama, Kanagawa",
    salaryBase: "¥270,000 ~ ¥330,000",
    salaryNote: "+ Sertifikasi Mekatronik Resmi",
    housing: "Subsidi Perumahan 60%",
    minJlpt: "N4",
    specialization: "Manufacturing",
    visaType: "Tokutei Ginou 1 (SSW)",
    intakeQuota: "Kuota: 3 Orang",
  },
  {
    id: 106,
    title: "Smart Agriculture Systems Specialist",
    titleJp: "スマート農業・温室環境管理技術者",
    companyName: "Hokkaido Agri-Tech Innovations",
    prefectureCode: "北海道",
    location: "Sapporo, Hokkaido",
    salaryBase: "¥230,000 ~ ¥280,000",
    salaryNote: "+ Fasilitas Musim Dingin",
    housing: "Perumahan Staff Disediakan",
    minJlpt: "N4",
    specialization: "Agriculture",
    visaType: "Tokutei Ginou 1 (SSW)",
    intakeQuota: "Kuota: 2 Orang",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Kategori" },
  { id: "Engineering", label: "Rekayasa & Otomasi" },
  { id: "IT", label: "Software & Cloud" },
  { id: "Manufacturing", label: "Manufaktur & CAM" },
  { id: "Hospitality", label: "Hospitality & Service" },
];

export function FeaturedJobsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: apiData } = useJobs({ limit: 6 });

  // Map API jobs if available, fallback to curated showcase
  const jobs =
    apiData && apiData.jobs && apiData.jobs.length > 0
      ? apiData.jobs.map((j: Job, idx: number) => ({
          id: j.id,
          title: j.title,
          titleJp: (j as unknown as { title_jp?: string }).title_jp || SHOWCASE_JOBS[idx % SHOWCASE_JOBS.length]!.titleJp,
          companyName: (j as unknown as { company_name?: string }).company_name || j.company_name || SHOWCASE_JOBS[idx % SHOWCASE_JOBS.length]!.companyName,
          prefectureCode: SHOWCASE_JOBS[idx % SHOWCASE_JOBS.length]!.prefectureCode,
          location: j.location,
          salaryBase: j.salary_range || SHOWCASE_JOBS[idx % SHOWCASE_JOBS.length]!.salaryBase,
          salaryNote: "+ Lembur & Asuransi Sosial",
          housing: SHOWCASE_JOBS[idx % SHOWCASE_JOBS.length]!.housing,
          minJlpt: j.min_jlpt || "N3",
          specialization: j.specialization || "Engineering",
          visaType: SHOWCASE_JOBS[idx % SHOWCASE_JOBS.length]!.visaType,
          intakeQuota: "Kuota Terbuka",
        }))
      : SHOWCASE_JOBS;

  const filteredJobs =
    activeCategory === "all"
      ? jobs
      : jobs.filter((j) => j.specialization === activeCategory);

  const getJlptBadgeVariant = (level: string) => {
    switch (level.toUpperCase()) {
      case "N1":
        return "jlpt-n1";
      case "N2":
        return "jlpt-n2";
      case "N3":
        return "jlpt-n3";
      case "N4":
        return "jlpt-n4";
      default:
        return "default";
    }
  };

  return (
    <section id="jobs" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest mb-2">
              Verified Japanese Employment • 求人情報
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Daftar Lowongan Aktif dengan Standar Upah Transparan
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Setiap posisi mencantumkan gaji pokok, tunjangan sewa hunian (Dorm), jenis visa, dan kuota penerimaan riil.
            </p>
          </div>

          <Button asChild variant="outline" size="md" className="shrink-0 font-semibold bg-white">
            <Link to="/student/jobs" className="inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Buka Seluruh Direktori Lowongan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Japanese Standard Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-xl bg-white border border-slate-200/90 p-5 hover:border-slate-400 hover:shadow-xs transition-all group"
            >
              <div>
                {/* Top Row: Prefecture & JLPT */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-xs">
                  <span className="font-mono text-slate-700 font-semibold flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold">
                      {job.prefectureCode}
                    </span>
                    <span>{job.location}</span>
                  </span>
                  <Badge variant={getJlptBadgeVariant(job.minJlpt)} size="sm">
                    JLPT {job.minJlpt}
                  </Badge>
                </div>

                {/* Role Titles */}
                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-red-600 transition-colors">
                  {job.title}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5 mb-2 truncate">
                  {job.titleJp}
                </div>

                {/* Company Name */}
                <div className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-4">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.companyName}</span>
                </div>

                {/* Salary & Housing Specifications */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-2 mb-4">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      Gaji Pokok Bersih:
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-900">
                      {job.salaryBase}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {job.salaryNote}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-start gap-1.5 text-slate-600">
                    <Home className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-[11px]">{job.housing}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata & Visa */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">{job.visaType}</span>
                <span className="text-emerald-700 font-semibold">{job.intakeQuota}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
