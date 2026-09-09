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
  student: "Student",
  corporate: "Corporate HR",
  educator_bilingual: "Educator — Bilingual",
  educator_silver: "Senior Mentor",
  alumni: "Alumni",
  admin: "Admin",
};

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
          { to: "/student/courses", label: "Courses" },
          { to: "/student/vault", label: "Document Vault" },
          { to: "/student/cv", label: "CV Builder" },
          { to: "/student/jobs", label: "Jobs" },
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
        return [{ to: "/educator", label: "Educator Portal" }];
      case "alumni":
        return [{ to: "/career", label: "Career Timeline" }];
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
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 md:h-16 max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6">
        {/* Left: Brand logo */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-decoration-none"
            onClick={() => setMobileNavOpen(false)}
          >
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[var(--color-accent)]">
              {BRAND_NAME}
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[var(--color-surface-2)] text-[var(--color-accent)] font-semibold shadow-2xs"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]/60",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user && <NotificationsBell />}

          {isAuthenticated && user && roleKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-all cursor-pointer focus:outline-hidden"
                >
                  <Avatar name={user.name} size="sm" role={roleKey} />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold leading-tight text-[var(--color-text-primary)]">
                      {user.name}
                    </span>
                    <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                      {ROLE_LABELS[user.role as AppRole]}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 p-2 shadow-xl rounded-xl border-[var(--color-border)]"
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
            <div className="flex items-center gap-2">
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
          {isAuthenticated && navLinks.length > 0 && (
            <div className="lg:hidden">
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
                  className="w-[300px] sm:w-[360px] flex flex-col"
                >
                  <SheetHeader className="border-b border-[var(--color-border)] pb-4 text-left">
                    <SheetTitle className="text-lg font-bold text-[var(--color-accent)]">
                      {BRAND_NAME}
                    </SheetTitle>
                    {user && (
                      <div className="flex items-center gap-2.5 mt-2">
                        <Avatar name={user.name} size="sm" role={roleKey} />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold leading-tight">
                            {user.name}
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {ROLE_LABELS[user.role as AppRole]}
                          </span>
                        </div>
                      </div>
                    )}
                  </SheetHeader>

                  <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-[var(--color-surface-2)] text-[var(--color-accent)] font-semibold"
                              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]/60",
                          )
                        }
                        onClick={() => setMobileNavOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>

                  <div className="border-t border-[var(--color-border)] pt-4 mt-auto">
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      icon={<LogOut className="h-4 w-4" />}
                      onClick={handleLogout}
                    >
                      Sign out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
