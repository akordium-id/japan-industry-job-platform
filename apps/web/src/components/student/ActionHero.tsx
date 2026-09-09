import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AppUser } from "@/contexts/AuthContext";

interface ActionHeroProps {
  user: AppUser | null;
  pendingDocsCount: number;
  rejectedDocsCount: number;
  approvedDocsCount: number;
  hasCv: boolean;
  activeJobsCount?: number;
}

export function ActionHero({
  user,
  pendingDocsCount,
  rejectedDocsCount,
  approvedDocsCount,
  hasCv,
  activeJobsCount = 0,
}: ActionHeroProps) {
  const displayName = user?.name ?? "Candidate";
  const displayJp = user?.nameJp ? `(${user.nameJp})` : "";

  // Determine current primary recommendation
  const getActionState = () => {
    if (rejectedDocsCount > 0) {
      return {
        badge: "Tindakan Diperlukan",
        badgeVariant: "danger" as const,
        icon: AlertTriangle,
        title: "Dokumen Memerlukan Perbaikan Segera",
        titleJp: "書類の再提出が必要です",
        desc: "Terdapat dokumen verifikasi Anda yang ditolak oleh tim admin. Silakan periksa catatan dan unggah ulang berkas yang valid.",
        ctaLabel: "Perbaiki di Document Vault",
        ctaTo: "/student/vault",
        accentBorder: "border-l-rose-500",
      };
    }

    if (approvedDocsCount === 0 && pendingDocsCount === 0) {
      return {
        badge: "Langkah Pertama",
        badgeVariant: "accent" as const,
        icon: Sparkles,
        title: "Unggah Dokumen Identitas & Kualifikasi",
        titleJp: "身元確認書類の提出",
        desc: "Untuk membuka akses penuh ke jaringan perusahaan Jepang dan fitur Rirekisho, unggah KTP dan sertifikat kompetensi Anda.",
        ctaLabel: "Unggah ke Vault",
        ctaTo: "/student/vault",
        accentBorder: "border-l-red-600",
      };
    }

    if (pendingDocsCount > 0 && !user?.profileVerified) {
      return {
        badge: "Dalam Pemeriksaan",
        badgeVariant: "warning" as const,
        icon: Clock,
        title: "Dokumen Sedang Diverifikasi Tim Admin",
        titleJp: "書類審査中です",
        desc: "Dokumen Anda sedang dalam proses peninjauan (1-2 hari kerja). Sembari menunggu, Anda bisa menyelesaikan kursus bahasa atau menyusun draft CV.",
        ctaLabel: "Buka Japanese CV Builder",
        ctaTo: "/student/cv",
        accentBorder: "border-l-amber-500",
      };
    }

    if (!hasCv) {
      return {
        badge: "Rekomendasi Utama",
        badgeVariant: "student" as const,
        icon: FileText,
        title: "Lengkapi Rirekisho (履歴書) Standar JIS",
        titleJp: "履歴書の作成・完成",
        desc: "Dokumen Anda telah terverifikasi! Susun CV standar industri Jepang dalam format PDF dengan font CJK resmi agar siap di-scout perusahaan.",
        ctaLabel: "Susun Rirekisho Sekarang",
        ctaTo: "/student/cv",
        accentBorder: "border-l-blue-600",
      };
    }

    return {
      badge: "Siap Melamar",
      badgeVariant: "success" as const,
      icon: CheckCircle2,
      title: "Profil Anda Siap Diajukan ke Perusahaan Jepang",
      titleJp: "企業スカウト・応募受付中",
      desc: `Semua berkas dan CV Anda telah berstandar industri. Jelajahi ${activeJobsCount > 0 ? activeJobsCount : "berbagai"} lowongan aktif di Tokyo, Osaka, dan prefektur lainnya.`,
      ctaLabel: "Lihat Lowongan Pekerjaan",
      ctaTo: "/student/jobs",
      accentBorder: "border-l-emerald-500",
    };
  };

  const action = getActionState();
  const Icon = action.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 border-l-4 ${action.accentBorder} p-6 sm:p-7 shadow-xs`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Text Details */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Halo, <strong className="text-slate-900">{displayName}</strong>{" "}
              {displayJp}
            </span>
            <span className="text-slate-300">•</span>
            <Badge variant={action.badgeVariant} size="sm">
              {action.badge}
            </Badge>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon className="w-5 h-5 shrink-0 text-slate-700" />
              <span>{action.title}</span>
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              {action.titleJp}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {action.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
          <Link to={action.ctaTo} className="text-decoration-none">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto justify-center shadow-sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {action.ctaLabel}
            </Button>
          </Link>
          <Link to="/student/calendar" className="text-decoration-none">
            <Button
              variant="ghost"
              size="md"
              className="w-full sm:w-auto justify-center"
            >
              Jadwal Sesi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
