import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileCheck,
  Briefcase,
  Plane,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface PathwayStatus {
  hasUploadedDocs: boolean;
  isVerified: boolean;
  hasCv: boolean;
  appliedJobsCount: number;
  completedCoursesCount: number;
}

interface PathwayMilestoneRoadmapProps {
  status: PathwayStatus;
}

export function PathwayMilestoneRoadmap({
  status,
}: PathwayMilestoneRoadmapProps) {
  // Determine each stage's status
  const stage1Complete =
    status.hasUploadedDocs && status.completedCoursesCount > 0;
  const stage1Active = !stage1Complete;

  const stage2Complete = status.isVerified && status.hasCv;
  const stage2Active = !stage2Complete && stage1Complete;

  const stage3Complete = status.appliedJobsCount > 0;
  const stage3Active = !stage3Complete && stage2Complete;

  const stage4Active = stage3Complete;

  const stages = [
    {
      number: "01",
      title: "Fondasi & Berkas",
      titleJp: "基礎学習 & 書類提出",
      icon: BookOpen,
      status: stage1Complete
        ? "completed"
        : stage1Active
          ? "active"
          : "pending",
      desc: "Unggah KTP, sertifikat JLPT, dan mulai modul kurikulum bahasa Jepang.",
      meta: `${status.completedCoursesCount > 0 ? "Modul Aktif" : "Belum Mulai"} • ${status.hasUploadedDocs ? "Berkas Terunggah" : "Berkas Kosong"}`,
      linkTo: "/student/vault",
      linkText: "Buka Vault & Kursus",
    },
    {
      number: "02",
      title: "Verifikasi & Rirekisho",
      titleJp: "書類審査 & 履歴書完成",
      icon: FileCheck,
      status: stage2Complete
        ? "completed"
        : stage2Active
          ? "active"
          : "pending",
      desc: "Verifikasi profil oleh admin dan otomatisasi CV berstandar industri Jepang (JIS PDF).",
      meta: `${status.isVerified ? "Terverifikasi ✓" : "Verifikasi Pending"} • ${status.hasCv ? "CV Siap" : "CV Belum Lengkap"}`,
      linkTo: "/student/cv",
      linkText: "Lengkapi Rirekisho",
    },
    {
      number: "03",
      title: "Matching & Wawancara",
      titleJp: "求人応募 & 企業面接",
      icon: Briefcase,
      status: stage3Complete
        ? "completed"
        : stage3Active
          ? "active"
          : "pending",
      desc: "Melamar ke mitra industri Jepang aktif dan menerima undangan scout dari HR Jepang.",
      meta: `${status.appliedJobsCount} Lamaran Terkirim`,
      linkTo: "/student/jobs",
      linkText: "Eksplor Lowongan",
    },
    {
      number: "04",
      title: "Visa & Keberangkatan",
      titleJp: "在留資格 & 渡航準備",
      icon: Plane,
      status: stage4Active ? "active" : "pending",
      desc: "Penerbitan CoE (Certificate of Eligibility), penandatanganan kontrak, dan briefing keberangkatan.",
      meta: "Tahap Akhir Penempatan",
      linkTo: "/career",
      linkText: "Pantau Karir",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>The Pathway to Japan</span>
            <span className="text-xs font-normal text-slate-400">
              / 日本就職ロードマップ
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jalur tahapan terstandar menuju penempatan karier profesional di
            Jepang.
          </p>
        </div>
      </div>

      {/* Grid of 4 Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === "completed";
          const isActive = stage.status === "active";

          return (
            <div
              key={stage.number}
              className={cn(
                "relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 bg-white",
                isActive &&
                  "border-red-600/60 ring-2 ring-red-600/10 shadow-sm",
                isCompleted && "border-emerald-200/80 bg-emerald-50/10",
                !isActive && !isCompleted && "border-slate-200/70 opacity-80",
              )}
            >
              {/* Top Row: Number & Status Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-black px-2 py-0.5 rounded-md",
                        isActive
                          ? "bg-red-600 text-white"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {stage.number}
                    </span>
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        isActive
                          ? "text-red-600"
                          : isCompleted
                            ? "text-emerald-600"
                            : "text-slate-400",
                      )}
                    />
                  </div>

                  {isCompleted ? (
                    <Badge variant="success" size="sm" dot>
                      Selesai
                    </Badge>
                  ) : isActive ? (
                    <Badge variant="accent" size="sm" dot>
                      Tahap Saat Ini
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      Berikutnya
                    </Badge>
                  )}
                </div>

                {/* Titles */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {stage.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {stage.titleJp}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {/* Bottom Meta & Action Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-slate-500 truncate">
                  {stage.meta}
                </span>
                <Link
                  to={stage.linkTo}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-bold transition-colors group",
                    isActive
                      ? "text-red-600 hover:text-red-700"
                      : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  <span>{stage.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
