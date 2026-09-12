import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Coins,
  Building2,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

import { useJobs } from "@/api/hooks";
import type { Job } from "@/api/jobs.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Curated high-converting showcase jobs as fallback / initial state
const SHOWCASE_JOBS: Array<{
  id: number;
  title: string;
  titleJp: string;
  companyName: string;
  location: string;
  salaryRange: string;
  minJlpt: string;
  specialization: string;
  employmentType: string;
  isHot?: boolean;
}> = [
  {
    id: 101,
    title: "Automated Production Quality Engineer",
    titleJp: "自動化生産ライン品質管理エンジニア",
    companyName: "Chubu Precision Industrial Co., Ltd.",
    location: "Toyota, Aichi (愛知県)",
    salaryRange: "¥280,000 – ¥350,000 / bln",
    minJlpt: "N3",
    specialization: "Engineering",
    employmentType: "Full-Time (Gijinkoku)",
    isHot: true,
  },
  {
    id: 102,
    title: "Cloud & Frontend Software Engineer",
    titleJp: "クラウド・フロントエンドエンジニア",
    companyName: "NextGen Media Systems Tokyo",
    location: "Shibuya, Tokyo (東京都)",
    salaryRange: "¥320,000 – ¥450,000 / bln",
    minJlpt: "N3",
    specialization: "IT",
    employmentType: "Full-Time (Engineer Visa)",
    isHot: true,
  },
  {
    id: 103,
    title: "Precision CNC Machine Operator & CAM",
    titleJp: "マシニングセンタ・精密加工技術者",
    companyName: "Kansai Metalcraft Works",
    location: "Sakai, Osaka (大阪府)",
    salaryRange: "¥250,000 – ¥310,000 / bln",
    minJlpt: "N4",
    specialization: "Manufacturing",
    employmentType: "Tokutei Ginou (SSW 1)",
  },
  {
    id: 104,
    title: "International Guest Relations Specialist",
    titleJp: "高級旅館・国際接客コンシェルジュ",
    companyName: "Kyoto Heritage Hospitality Group",
    location: "Gion, Kyoto (京都府)",
    salaryRange: "¥240,000 – ¥290,000 / bln",
    minJlpt: "N3",
    specialization: "Hospitality",
    employmentType: "Gijinkoku Visa",
  },
  {
    id: 105,
    title: "Automotive Mechatronics Technician",
    titleJp: "自動車電装・メカトロニクス技術者",
    companyName: "Yokohama Auto-Parts Manufacturing",
    location: "Yokohama, Kanagawa (神奈川県)",
    salaryRange: "¥270,000 – ¥330,000 / bln",
    minJlpt: "N4",
    specialization: "Manufacturing",
    employmentType: "Tokutei Ginou (SSW 1)",
  },
  {
    id: 106,
    title: "Smart Agriculture Systems Specialist",
    titleJp: "スマート農業・温室環境管理技術者",
    companyName: "Hokkaido Agri-Tech Innovations",
    location: "Sapporo, Hokkaido (北海道)",
    salaryRange: "¥230,000 – ¥280,000 / bln",
    minJlpt: "N4",
    specialization: "Agriculture",
    employmentType: "Tokutei Ginou (SSW 1)",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Bidang" },
  { id: "Engineering", label: "Engineering & Otomasi" },
  { id: "IT", label: "IT & Software" },
  { id: "Manufacturing", label: "Manufaktur & Presisi" },
  { id: "Hospitality", label: "Hospitality & Service" },
];

export function FeaturedJobsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: apiData } = useJobs({ limit: 6 });

  // Map API jobs if available, otherwise use showcase jobs
  const liveJobs = (apiData?.jobs && apiData.jobs.length > 0)
    ? apiData.jobs.map((j: Job) => ({
        id: j.id,
        title: j.title,
        titleJp: j.title_jp || "日本企業公募ポジション",
        companyName: j.company_name || "Mitra Industri Resmi JIJP",
        location: j.location || "Japan (全国)",
        salaryRange: j.salary_range || "¥240,000 – ¥320,000 / bln",
        minJlpt: j.min_jlpt || "N3",
        specialization: j.specialization || "Engineering",
        employmentType: j.employment_type === "fulltime" ? "Full-Time" : j.employment_type === "contract" ? "Contract" : "Internship",
        isHot: false,
      }))
    : SHOWCASE_JOBS;

  const filteredJobs = liveJobs.filter((job) => {
    if (activeCategory === "all") return true;
    return job.specialization.toLowerCase().includes(activeCategory.toLowerCase());
  });

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
    <section id="jobs" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Peluang Karier Aktif</span>
              <span>•</span>
              <span className="font-normal font-mono">求人情報ピックアップ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Lowongan Pilihan di Industri Terkemuka Jepang
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Seluruh lowongan telah diverifikasi kelayakan kontrak kerjanya, standar upah minimum prefektur, serta ketersediaan fasilitas tempat tinggal.
            </p>
          </div>

          <Button asChild variant="outline" size="md" className="shrink-0 self-start md:self-auto font-semibold">
            <Link to="/student/jobs" className="inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Lihat Semua Lowongan</span>
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
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Top badges: Specialization & JLPT */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[160px]">{job.companyName}</span>
                  </span>
                  <Badge variant={getJlptBadgeVariant(job.minJlpt)} size="sm">
                    JLPT {job.minJlpt}
                  </Badge>
                </div>

                {/* Job Title & JP Subtitle */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-red-600 transition-colors mb-1">
                  {job.title}
                </h3>
                <div className="text-xs text-slate-400 font-mono mb-4 truncate">
                  {job.titleJp}
                </div>

                {/* Specs Box */}
                <div className="space-y-2 mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{job.salaryRange}</span>
                  </div>
                </div>
              </div>

              {/* Action Button & Visa status */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-500 truncate">
                  {job.employmentType}
                </span>
                <Button asChild variant="ghost" size="sm" className="text-red-600 hover:text-red-700 font-semibold p-0">
                  <Link to="/student/jobs" className="inline-flex items-center gap-1">
                    <span>Lamar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            Perusahaan Anda butuh talenta industri bersertifikasi?{" "}
            <Link to="/corporate" className="text-red-600 hover:underline font-semibold">
              Pasang Lowongan & Akses Talent Scout →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
