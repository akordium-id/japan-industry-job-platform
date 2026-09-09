import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, User as UserIcon, LogOut, CheckCircle2, AlertCircle } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import NotificationsBell from "@/components/ui/NotificationsBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND_NAME } from "@/lib/constants";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    void logout();
    navigate("/login");
  };

  // Derive page title from current route
  const getPageContext = () => {
    const path = location.pathname;
    if (path === "/student") return { title: "Pathway Dashboard", jp: "進路ダッシュボード" };
    if (path.startsWith("/student/courses")) return { title: "Learning Tracks", jp: "研修カリキュラム" };
    if (path.startsWith("/student/vault")) return { title: "Document Vault", jp: "書類アーカイブ" };
    if (path.startsWith("/student/cv")) return { title: "Japanese Rirekisho", jp: "履歴書作成" };
    if (path.startsWith("/student/jobs")) return { title: "Jobs & Matching", jp: "求人マッチング" };
    if (path.startsWith("/student/calendar")) return { title: "Class Calendar", jp: "日程表" };
    if (path.startsWith("/student/profile")) return { title: "Candidate Profile", jp: "候補者情報" };
    if (path.startsWith("/corporate/jobs")) return { title: "Manage Job Openings", jp: "求人管理" };
    if (path.startsWith("/corporate/scout")) return { title: "Scout Talents", jp: "スカウト検索" };
    if (path.startsWith("/corporate")) return { title: "Recruitment Portal", jp: "採用ポータル" };
    if (path.startsWith("/educator")) return { title: "Educator Portal", jp: "教育指導ポータル" };
    if (path.startsWith("/career")) return { title: "Career Timeline", jp: "キャリア軌跡" };
    if (path.startsWith("/admin")) return { title: "Admin Verification", jp: "審査管理" };
    return { title: "Portal", jp: "ポータル" };
  };

  const pageContext = getPageContext();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Breadcrumbs & Mobile Trigger */}
      <div className="flex items-center gap-3">
        {/* Mobile menu sheet trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <SheetHeader className="p-5 border-b border-slate-100 text-left">
              <SheetTitle className="text-base font-bold text-slate-900">
                {BRAND_NAME}
              </SheetTitle>
              <span className="text-[11px] text-slate-400">日本就職ポータル</span>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {user.role === "student" && (
                <>
                  <Link
                    to="/student"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Pathway Dashboard
                  </Link>
                  <Link
                    to="/student/courses"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Learning Track
                  </Link>
                  <Link
                    to="/student/vault"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Document Vault
                  </Link>
                  <Link
                    to="/student/cv"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Japanese Rirekisho (CV)
                  </Link>
                  <Link
                    to="/student/jobs"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Jobs & Matching
                  </Link>
                </>
              )}
              {user.role === "corporate" && (
                <>
                  <Link
                    to="/corporate"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Recruitment Portal
                  </Link>
                  <Link
                    to="/corporate/jobs"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Manage Job Openings
                  </Link>
                  <Link
                    to="/corporate/scout"
                    onClick={() => setMobileOpen(false)}
                    className="block p-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Scout Talents
                  </Link>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full p-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Breadcrumb Context */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            {pageContext.title}
          </span>
          <span className="hidden sm:inline-block text-xs font-normal text-slate-400">
            / {pageContext.jp}
          </span>
        </div>
      </div>

      {/* Right Controls: Status, Bell & Avatar */}
      <div className="flex items-center gap-3">
        {/* Verification Status Pill (Student) */}
        {user.role === "student" && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 border-slate-200">
            {user.profileVerified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-700">Verified Candidate</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-600">Verification Pending</span>
              </>
            )}
          </div>
        )}

        {/* In-app notification bell */}
        <NotificationsBell />

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus:outline-hidden"
            >
              <Avatar name={user.name} size="sm" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2 shadow-lg rounded-xl border-slate-200">
            <DropdownMenuLabel className="font-normal p-2">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              <div className="mt-1.5">
                <Badge variant="student" size="sm">
                  {user.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/student/profile" className="flex items-center gap-2 text-xs cursor-pointer">
                <UserIcon className="w-3.5 h-3.5" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-rose-600 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
