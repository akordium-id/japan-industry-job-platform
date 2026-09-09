import type { ComponentType } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Compass,
  BookOpen,
  FolderLock,
  FileText,
  Briefcase,
  Calendar,
  TrendingUp,
  Building2,
  Search,
  Users,
  ShieldCheck,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { BRAND_NAME } from "@/lib/constants";
import type { AppRole } from "@/api/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  labelJp?: string;
  icon: ComponentType<{ className?: string }>;
}

const ROLE_NAV: Record<AppRole, NavItem[]> = {
  student: [
    { to: "/student", label: "Pathway Dashboard", labelJp: "ダッシュボード", icon: Compass },
    { to: "/student/courses", label: "Learning Track", labelJp: "カリキュラム", icon: BookOpen },
    { to: "/student/vault", label: "Document Vault", labelJp: "書類管理", icon: FolderLock },
    { to: "/student/cv", label: "Japanese Rirekisho", labelJp: "履歴書作成", icon: FileText },
    { to: "/student/jobs", label: "Jobs & Matching", labelJp: "求人一覧", icon: Briefcase },
    { to: "/student/calendar", label: "Class & Sessions", labelJp: "日程表", icon: Calendar },
    { to: "/career", label: "Career Timeline", labelJp: "キャリア軌跡", icon: TrendingUp },
  ],
  corporate: [
    { to: "/corporate", label: "Recruitment Portal", labelJp: "採用ポータル", icon: Building2 },
    { to: "/corporate/jobs", label: "Manage Job Openings", labelJp: "求人管理", icon: Briefcase },
    { to: "/corporate/scout", label: "Scout Talents", labelJp: "スカウト検索", icon: Search },
  ],
  educator_bilingual: [
    { to: "/educator", label: "Educator Portal", labelJp: "教育ポータル", icon: Users },
    { to: "/student/calendar", label: "Training Calendar", labelJp: "授業日程", icon: Calendar },
  ],
  educator_silver: [
    { to: "/educator", label: "Senior Mentor Portal", labelJp: "メンターポータル", icon: Users },
    { to: "/student/calendar", label: "Training Calendar", labelJp: "面談日程", icon: Calendar },
  ],
  alumni: [
    { to: "/career", label: "Career Timeline", labelJp: "キャリア軌跡", icon: TrendingUp },
    { to: "/student/profile", label: "My Profile", labelJp: "会員情報", icon: User },
    { to: "/student/jobs", label: "Career Opportunities", labelJp: "転職機会", icon: Briefcase },
  ],
  admin: [
    { to: "/admin/verifications", label: "Document Verification", labelJp: "書類審査", icon: ShieldCheck },
    { to: "/corporate/jobs", label: "Manage Jobs", labelJp: "求人管理", icon: Briefcase },
  ],
};

const ROLE_LABELS: Record<AppRole, string> = {
  student: "Candidate",
  corporate: "Corporate HR",
  educator_bilingual: "Bilingual Educator",
  educator_silver: "Senior Mentor",
  alumni: "Alumni",
  admin: "Administrator",
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = user.role as AppRole;
  const navItems = ROLE_NAV[role] ?? [];

  const handleLogout = () => {
    void logout();
    navigate("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden md:flex w-64 flex-col border-r border-slate-200/90 bg-white shadow-xs select-none">
      {/* Platform Branding */}
      <div className="flex flex-col justify-center h-16 px-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs shadow-xs tracking-tighter">
            JP
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            {BRAND_NAME}
          </span>
        </div>
        <span className="text-[10px] font-medium text-slate-400 tracking-wider">
          日本就職キャリアプラットフォーム
        </span>
      </div>

      {/* Navigation Group */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/student" || item.to === "/corporate" || item.to === "/educator"}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group",
                  isActive
                    ? "bg-slate-100 text-slate-950 font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-red-600 before:rounded-r"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50",
                )
              }
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.labelJp && (
                <span className="text-[10px] font-normal text-slate-400 group-hover:text-slate-500">
                  {item.labelJp}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <Avatar name={user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {ROLE_LABELS[role] || role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
