export function getJlptRank(level: string | null | undefined): number {
  if (!level) return 0;
  const map: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };
  return map[level.toUpperCase()] ?? 0;
}

export function extractKeywords(
  input: string | string[] | null | undefined,
): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
  }
  return String(input)
    .split(/[,/|\n]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function calculateJaccardSimilarity(
  candidateSkills: string | string[] | null | undefined,
  jobSkills: string | string[] | null | undefined,
): number {
  const cTokens = extractKeywords(candidateSkills);
  const jTokens = extractKeywords(jobSkills);
  if (jTokens.length === 0) return 0.8;
  if (cTokens.length === 0) return 0.2;

  const cSet = new Set(cTokens);
  const jSet = new Set(jTokens);

  let intersection = 0;
  for (const item of cSet) {
    for (const jItem of jSet) {
      if (item === jItem || item.includes(jItem) || jItem.includes(item)) {
        intersection++;
        break;
      }
    }
  }

  const union = new Set([...cTokens, ...jTokens]).size;
  return union > 0 ? intersection / union : 0;
}

export function calculateLocationScore(
  candidateCity: string | null | undefined,
  jobLocation: string | null | undefined,
): number {
  if (!jobLocation) return 1.0;
  if (!candidateCity) return 0.7;
  const cCity = String(candidateCity).trim().toLowerCase();
  const jLoc = String(jobLocation).trim().toLowerCase();
  if (cCity === jLoc || jLoc.includes(cCity) || cCity.includes(jLoc)) {
    return 1.0;
  }
  return 0.7;
}

export function calculateJlptScore(
  candidateLevel: string | null | undefined,
  requiredLevel: string | null | undefined,
): number {
  if (!requiredLevel) return 1.0;
  const candRank = getJlptRank(candidateLevel);
  const reqRank = getJlptRank(requiredLevel);
  if (candRank === 0) return 0.2;
  if (candRank >= reqRank) return 1.0;
  if (candRank === reqRank - 1) return 0.5;
  return 0.1;
}

export function calculateMatchScore(params: {
  candidateJlpt: string | null | undefined;
  candidateSpecialization: string | string[] | null | undefined;
  candidateCity: string | null | undefined;
  jobMinJlpt: string | null | undefined;
  jobSpecialization: string | string[] | null | undefined;
  jobLocation: string | null | undefined;
}): number {
  const jlptScore = calculateJlptScore(params.candidateJlpt, params.jobMinJlpt);
  const specScore = calculateJaccardSimilarity(
    params.candidateSpecialization,
    params.jobSpecialization,
  );
  const locScore = calculateLocationScore(
    params.candidateCity,
    params.jobLocation,
  );

  const total = jlptScore * 0.35 + specScore * 0.45 + locScore * 0.2;
  return Math.round(Math.min(100, Math.max(10, total * 100)));
}
