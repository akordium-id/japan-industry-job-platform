import * as React from "react";

import { cn } from "@/lib/utils";

export interface ReadinessBreakdownItem {
  label: string;
  passed: boolean;
  tip?: string;
}

export interface ReadinessGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
  breakdown?: ReadinessBreakdownItem[];
}

export function ReadinessGauge({
  score,
  size = 140,
  strokeWidth = 10,
  title = "Japan Job Readiness",
  subtitle = "日本就職準備度",
  breakdown,
  className,
  ...props
}: ReadinessGaugeProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  // Dynamic status color based on readiness tier
  const strokeColor =
    clampedScore >= 80
      ? "text-emerald-500"
      : clampedScore >= 50
        ? "text-amber-500"
        : "text-rose-500";

  const badgeStatus =
    clampedScore >= 80
      ? { text: "Work Ready", class: "bg-emerald-50 text-emerald-700 border-emerald-200" }
      : clampedScore >= 50
        ? { text: "In Progress", class: "bg-amber-50 text-amber-700 border-amber-200" }
        : { text: "Action Needed", class: "bg-rose-50 text-rose-700 border-rose-200" };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs",
        className,
      )}
      role="region"
      aria-label="Japan Readiness Score"
      {...props}
    >
      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="text-slate-100 fill-transparent stroke-current"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("fill-transparent stroke-current transition-all duration-700 ease-out", strokeColor)}
          />
        </svg>

        {/* Center Label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
            {clampedScore}%
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
            Ready
          </span>
        </div>
      </div>

      {/* Info & Breakdown */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              badgeStatus.class,
            )}
          >
            {badgeStatus.text}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mb-3">{subtitle}</p>

        {breakdown && breakdown.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "flex items-center justify-center w-4 h-4 rounded-full text-[10px] shrink-0",
                    item.passed
                      ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {item.passed ? "✓" : "•"}
                </span>
                <span
                  className={cn(
                    "truncate",
                    item.passed ? "text-slate-700 font-medium" : "text-slate-400",
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
