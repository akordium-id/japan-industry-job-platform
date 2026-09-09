import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

import styles from "./Navbar.module.css";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import NotificationsBell from "@/components/ui/NotificationsBell";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const handleLogout = () => {
    void logout();
    navigate("/login");
    setMenuOpen(false);
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
    <header className={styles["navbar"]}>
      <div className={styles["inner"]}>
        <NavLink
          to="/"
          className={styles["logo"] ?? ""}
          onClick={() => setMobileNavOpen(false)}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: 18,
              color: "var(--color-accent)",
              letterSpacing: "-0.02em",
            }}
          >
            {BRAND_NAME}
          </span>
        </NavLink>

        {isAuthenticated && (
          <nav className={styles["nav"]}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(styles["navLink"], isActive && styles["active"])
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className={styles["right"]}>
          {isAuthenticated && user && <NotificationsBell />}
          {isAuthenticated && user && roleKey ? (
            <div className={styles["userMenu"]} ref={menuRef}>
              <button
                className={styles["userBtn"]}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <Avatar name={user.name} size="sm" role={roleKey} />
                <div className={styles["userInfo"]}>
                  <span className={styles["userName"]}>{user.name}</span>
                  <span className={cn(styles["userRole"], styles[roleKey])}>
                    {ROLE_LABELS[user.role as AppRole]}
                  </span>
                </div>
                <span className={styles["chevron"]}>
                  {menuOpen ? "▲" : "▼"}
                </span>
              </button>

              {menuOpen && (
                <div className={styles["dropdown"]}>
                  <div className={styles["dropdownHeader"]}>
                    <div className={styles["dropdownUserRow"]}>
                      <Avatar name={user.name} size="md" role={roleKey} />
                      <div className={styles["dropdownUserMeta"]}>
                        <span className={styles["dropdownName"]}>
                          {user.name}
                        </span>
                        {user.nameJp && (
                          <span className={styles["dropdownNameJp"]}>
                            {user.nameJp}
                          </span>
                        )}
                        <span className={styles["dropdownEmail"]}>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className={styles["dropdownBadges"]}>
                      <span
                        className={cn(styles["userRoleBadge"], styles[roleKey])}
                      >
                        {ROLE_LABELS[user.role as AppRole]}
                      </span>
                      {user.role === "student" && (
                        <Badge
                          variant={user.profileVerified ? "success" : "warning"}
                          size="sm"
                        >
                          {user.profileVerified ? "Verified" : "Unverified"}
                        </Badge>
                      )}
                      {user.company && (
                        <span className={styles["dropdownCompanyBadge"]}>
                          {user.company}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles["dropdownDivider"]} />

                  <div className={styles["dropdownNav"]}>
                    {user.role === "student" && (
                      <>
                        <Link
                          to="/student/profile"
                          className={styles["dropdownLink"]}
                          onClick={() => setMenuOpen(false)}
                        >
                          <User className={styles["dropdownIcon"]} size={16} />
                          <div className={styles["dropdownLinkText"]}>
                            <strong>My Profile</strong>
                            <small>Personal data, JLPT & history</small>
                          </div>
                        </Link>
                        <Link
                          to="/student/vault"
                          className={styles["dropdownLink"]}
                          onClick={() => setMenuOpen(false)}
                        >
                          <FolderLock
                            className={styles["dropdownIcon"]}
                            size={16}
                          />
                          <div className={styles["dropdownLinkText"]}>
                            <strong>Document Vault</strong>
                            <small>ID, certificates & files</small>
                          </div>
                        </Link>
                        <Link
                          to="/student/cv"
                          className={styles["dropdownLink"]}
                          onClick={() => setMenuOpen(false)}
                        >
                          <FileText
                            className={styles["dropdownIcon"]}
                            size={16}
                          />
                          <div className={styles["dropdownLinkText"]}>
                            <strong>CV Generator</strong>
                            <small>JIS-standard Rirekisho</small>
                          </div>
                        </Link>
                      </>
                    )}

                    {user.role === "corporate" && (
                      <>
                        <Link
                          to="/corporate"
                          className={styles["dropdownLink"]}
                          onClick={() => setMenuOpen(false)}
                        >
                          <Building2
                            className={styles["dropdownIcon"]}
                            size={16}
                          />
                          <div className={styles["dropdownLinkText"]}>
                            <strong>Recruitment Portal</strong>
                          </div>
                        </Link>
                        <Link
                          to="/corporate/jobs"
                          className={styles["dropdownLink"]}
                          onClick={() => setMenuOpen(false)}
                        >
                          <Briefcase
                            className={styles["dropdownIcon"]}
                            size={16}
                          />
                          <div className={styles["dropdownLinkText"]}>
                            <strong>Manage Jobs</strong>
                          </div>
                        </Link>
                        <Link
                          to="/corporate/scout"
                          className={styles["dropdownLink"]}
                          onClick={() => setMenuOpen(false)}
                        >
                          <Search
                            className={styles["dropdownIcon"]}
                            size={16}
                          />
                          <div className={styles["dropdownLinkText"]}>
                            <strong>Scout Talent</strong>
                          </div>
                        </Link>
                      </>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin/verifications"
                        className={styles["dropdownLink"]}
                        onClick={() => setMenuOpen(false)}
                      >
                        <ShieldCheck
                          className={styles["dropdownIcon"]}
                          size={16}
                        />
                        <div className={styles["dropdownLinkText"]}>
                          <strong>Document Verification</strong>
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className={styles["dropdownDivider"]} />

                  <button
                    className={styles["dropdownItem"]}
                    onClick={handleLogout}
                  >
                    <LogOut className={styles["dropdownIcon"]} size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles["authLinks"]}>
              <NavLink to="/login" className={styles["loginLink"] ?? ""}>
                Sign in
              </NavLink>
              <NavLink to="/register" className={styles["registerBtn"] ?? ""}>
                Sign up
              </NavLink>
            </div>
          )}

          {isAuthenticated && navLinks.length > 0 && (
            <button
              className={styles["hamburger"]}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            >
              <span className={styles["hamburgerBar"]} />
              <span className={styles["hamburgerBar"]} />
              <span className={styles["hamburgerBar"]} />
            </button>
          )}
        </div>
      </div>

      {isAuthenticated && navLinks.length > 0 && (
        <>
          {mobileNavOpen && (
            <div
              className={styles["mobileOverlay"]}
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
          )}

          <nav
            className={cn(
              styles["mobileNav"],
              mobileNavOpen && styles["mobileNavOpen"],
            )}
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(
                    styles["mobileNavLink"],
                    isActive && styles["mobileNavLinkActive"],
                  )
                }
                onClick={() => setMobileNavOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className={styles["mobileNavDivider"]} />
            <button
              className={styles["mobileNavLogout"]}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        </>
      )}
    </header>
  );
}
