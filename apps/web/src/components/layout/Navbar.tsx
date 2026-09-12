import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  User,
  FolderLock,
  FileText,
  Building2,
  Briefcase,
  Search,
  ShieldCheck,
  LogOut,
  Menu,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
import type { AppRole } from "@/api/auth";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<AppRole, string> = {
  student: "Candidate",
  corporate: "Corporate HR",
  educator_bilingual: "Bilingual Educator",
  educator_silver: "Senior Mentor",
  alumni: "Alumni",
  admin: "Administrator",
};

const PUBLIC_NAV_LINKS = [
  { to: "/#roles", label: "Program Roles" },
  { to: "/#features", label: "Ecosystem" },
  { to: "/#stats", label: "Platform Stats" },
  { to: "/student/jobs", label: "Explore Jobs" },
];

const ROLE_COLORS: Record<
  AppRole,
  "student" | "corporate" | "educator" | "silver" | "alumni" | "admin"
> = {
  student: "student",
  corporate: "corporate",
  educator_bilingual: "educator",
  educator_silver: "silver",
  alumni: "alumni",
  admin: "admin",
};

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    void logout();
    navigate("/login");
    setMobileNavOpen(false);
  };

  const getNavLinks = (): Array<{ to: string; label: string }> => {
    if (!user) return [];
    switch (user.role as AppRole) {
      case "student":
        return [
          { to: "/student", label: "Dashboard" },
          { to: "/student/courses", label: "Learning Track" },
          { to: "/student/vault", label: "Document Vault" },
          { to: "/student/cv", label: "Japanese Rirekisho" },
          { to: "/student/jobs", label: "Jobs & Matching" },
          { to: "/student/calendar", label: "Calendar" },
          { to: "/career", label: "Career Timeline" },
        ];
      case "corporate":
        return [
          { to: "/corporate", label: "Recruitment Portal" },
          { to: "/corporate/jobs", label: "Manage Jobs" },
          { to: "/corporate/scout", label: "Scout Talent" },
        ];
      case "educator_bilingual":
      case "educator_silver":
        return [
          { to: "/educator", label: "Educator Portal" },
          { to: "/student/calendar", label: "Training Calendar" },
        ];
      case "alumni":
        return [
          { to: "/career", label: "Career Timeline" },
          { to: "/student/profile", label: "My Profile" },
          { to: "/student/jobs", label: "Opportunities" },
        ];
      case "admin":
        return [
          { to: "/admin/verifications", label: "Document Verification" },
          { to: "/corporate/jobs", label: "Manage Jobs" },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();
  const roleKey = user ? ROLE_COLORS[user.role as AppRole] : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 md:h-16 items-center justify-between w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left: Brand logo */}
        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 no-underline select-none group shrink-0"
            onClick={() => setMobileNavOpen(false)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs shadow-xs tracking-tighter shrink-0 transition-transform group-hover:scale-105">
              JP
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                {BRAND_NAME}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium text-slate-400 -mt-0.5">
                Japan Career Bridge
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {isAuthenticated
              ? navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={
                      link.to === "/student" ||
                      link.to === "/corporate" ||
                      link.to === "/educator"
                    }
                    className={({ isActive }) =>
                      cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors no-underline",
                        isActive
                          ? "bg-slate-100 text-red-600 font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))
              : PUBLIC_NAV_LINKS.map((link) =>
                  link.to.startsWith("/#") ? (
                    <a
                      key={link.to}
                      href={link.to.replace("/", "")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors no-underline"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors no-underline",
                          isActive
                            ? "bg-slate-100 text-red-600 font-bold shadow-2xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70",
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ),
                )}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Student Verification Status Pill */}
          {isAuthenticated && user && user.role === "student" && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-100 border-slate-200">
              {user.profileVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-900 font-medium">Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-600 font-medium">
                    Verification Pending
                  </span>
                </>
              )}
            </div>
          )}

          {isAuthenticated && user && <NotificationsBell />}

          {isAuthenticated && user && roleKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 hover:border-slate-200 hover:bg-slate-100 transition-all cursor-pointer focus:outline-hidden"
                >
                  <Avatar name={user.name} size="sm" role={roleKey} />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold leading-tight text-slate-900">
                      {user.name}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {ROLE_LABELS[user.role as AppRole]}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 p-2 shadow-xl rounded-xl border-slate-200 bg-white"
              >
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="md" role={roleKey} />
                    <div className="flex flex-col space-y-0.5 overflow-hidden">
                      <p className="text-sm font-semibold truncate text-[var(--color-text-primary)]">
                        {user.name}
                      </p>
                      {user.nameJp && (
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                          {user.nameJp}
                        </p>
                      )}
                      <p className="text-xs truncate text-[var(--color-text-secondary)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <Badge variant={roleKey} size="sm">
                      {ROLE_LABELS[user.role as AppRole]}
                    </Badge>
                    {user.role === "student" && (
                      <Badge
                        variant={user.profileVerified ? "success" : "warning"}
                        size="sm"
                      >
                        {user.profileVerified ? "Verified" : "Unverified"}
                      </Badge>
                    )}
                    {user.company && (
                      <Badge variant="default" size="sm">
                        {user.company}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Sub-links based on role */}
                {user.role === "student" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/student/profile"
                        className="cursor-pointer gap-2.5"
                      >
                        <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <div>
                          <p className="text-sm font-medium">My Profile</p>
                          <p className="text-[11px] text-[var(--color-text-tertiary)]">
                            Personal data, JLPT & history
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/student/vault"
                        className="cursor-pointer gap-2.5"
                      >
                        <FolderLock className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <div>
                          <p className="text-sm font-medium">Document Vault</p>
                          <p className="text-[11px] text-[var(--color-text-tertiary)]">
                            ID, certificates & files
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/student/cv" className="cursor-pointer gap-2.5">
                        <FileText className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <div>
                          <p className="text-sm font-medium">CV Generator</p>
                          <p className="text-[11px] text-[var(--color-text-tertiary)]">
                            JIS-standard Rirekisho
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/student/calendar"
                        className="cursor-pointer gap-2.5"
                      >
                        <Calendar className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <div>
                          <p className="text-sm font-medium">Class Calendar</p>
                          <p className="text-[11px] text-[var(--color-text-tertiary)]">
                            Training & mentor sessions
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user.role === "corporate" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/corporate" className="cursor-pointer gap-2.5">
                        <Building2 className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm font-medium">
                          Recruitment Portal
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/corporate/jobs"
                        className="cursor-pointer gap-2.5"
                      >
                        <Briefcase className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm font-medium">Manage Jobs</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/corporate/scout"
                        className="cursor-pointer gap-2.5"
                      >
                        <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm font-medium">
                          Scout Talent
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/verifications"
                      className="cursor-pointer gap-2.5"
                    >
                      <ShieldCheck className="h-4 w-4 text-[var(--color-text-secondary)]" />
                      <span className="text-sm font-medium">
                        Document Verification
                      </span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-[var(--color-error)] focus:bg-[var(--color-error-soft)] focus:text-[var(--color-error)] gap-2.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger navigation via Sheet */}
          <div className="lg:hidden flex items-center gap-2">
            {!isAuthenticated && (
              <Link to="/login" className="sm:hidden">
                <Button variant="primary" size="sm">
                  Sign in
                </Button>
              </Link>
            )}

            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-9 w-9"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[360px] flex flex-col bg-white border-slate-200"
              >
                <SheetHeader className="border-b border-slate-200 pb-4 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs shadow-xs">
                      JP
                    </div>
                    <SheetTitle className="text-base font-bold text-slate-900">
                      {BRAND_NAME}
                    </SheetTitle>
                  </div>
                  {user && roleKey && (
                    <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-200">
                      <Avatar name={user.name} size="sm" role={roleKey} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight text-slate-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {ROLE_LABELS[user.role as AppRole] || user.role}
                        </span>
                      </div>
                    </div>
                  )}
                </SheetHeader>

                <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
                  {isAuthenticated
                    ? navLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          end={
                            link.to === "/student" ||
                            link.to === "/corporate" ||
                            link.to === "/educator"
                          }
                          className={({ isActive }) =>
                            cn(
                              "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline",
                              isActive
                                ? "bg-slate-100 text-red-600 font-semibold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                            )
                          }
                          onClick={() => setMobileNavOpen(false)}
                        >
                          {link.label}
                        </NavLink>
                      ))
                    : PUBLIC_NAV_LINKS.map((link) =>
                        link.to.startsWith("/#") ? (
                          <a
                            key={link.to}
                            href={link.to.replace("/", "")}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors no-underline"
                            onClick={() => setMobileNavOpen(false)}
                          >
                            {link.label}
                          </a>
                        ) : (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline",
                                isActive
                                  ? "bg-slate-100 text-red-600 font-semibold"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                              )
                            }
                            onClick={() => setMobileNavOpen(false)}
                          >
                            {link.label}
                          </NavLink>
                        ),
                      )}
                </nav>

                <div className="border-t border-slate-200 pt-4 mt-auto">
                  {isAuthenticated ? (
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      icon={<LogOut className="h-4 w-4" />}
                      onClick={handleLogout}
                    >
                      Sign out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/login"
                        onClick={() => setMobileNavOpen(false)}
                        className="w-full"
                      >
                        <Button variant="ghost" size="sm" fullWidth>
                          Sign in
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileNavOpen(false)}
                        className="w-full"
                      >
                        <Button variant="primary" size="sm" fullWidth>
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
