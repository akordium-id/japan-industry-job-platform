export interface Candidate {
  id: string;
  name: string;
  age: number;
  origin: string;
  program: string;
  jlptLevel: string;
  languageScore: number;
  culturalScore: number;
  technicalScore: number;
  overallScore: number;
  specialization: string[];
  status: "available" | "interviewing" | "placed";
  completedModules: number;
  totalModules: number;
  certCount: number;
}

export const CANDIDATES: Candidate[] = [
  {
    id: "cand-001",
    name: "Ahmad Fauzi",
    age: 24,
    origin: "Bandung, Jawa Barat",
    program: "Manufacturing Engineering",
    jlptLevel: "N3",
    languageScore: 82,
    culturalScore: 91,
    technicalScore: 88,
    overallScore: 87,
    specialization: ["Manufacturing", "Automotive", "Quality Control"],
    status: "available",
    completedModules: 4,
    totalModules: 4,
    certCount: 3,
  },
  {
    id: "cand-002",
    name: "Dewi Rahayu",
    age: 23,
    origin: "Surabaya, Jawa Timur",
    program: "Information Technology",
    jlptLevel: "N3",
    languageScore: 89,
    culturalScore: 85,
    technicalScore: 92,
    overallScore: 89,
    specialization: ["IT", "Software Development", "Semiconductor"],
    status: "interviewing",
    completedModules: 4,
    totalModules: 4,
    certCount: 4,
  },
  {
    id: "cand-003",
    name: "Reza Pratama",
    age: 25,
    origin: "Yogyakarta, DIY",
    program: "Civil Engineering & Construction",
    jlptLevel: "N4",
    languageScore: 74,
    culturalScore: 88,
    technicalScore: 86,
    overallScore: 83,
    specialization: ["Construction", "Infrastructure"],
    status: "available",
    completedModules: 4,
    totalModules: 4,
    certCount: 2,
  },
  {
    id: "cand-004",
    name: "Siti Nurhaliza",
    age: 22,
    origin: "Medan, Sumatera Utara",
    program: "Hospitality & Tourism",
    jlptLevel: "N3",
    languageScore: 94,
    culturalScore: 96,
    technicalScore: 79,
    overallScore: 90,
    specialization: ["Hospitality", "Tourism", "Service"],
    status: "available",
    completedModules: 4,
    totalModules: 4,
    certCount: 5,
  },
  {
    id: "cand-005",
    name: "Bagus Wicaksono",
    age: 26,
    origin: "Semarang, Jawa Tengah",
    program: "Modern Agriculture",
    jlptLevel: "N4",
    languageScore: 71,
    culturalScore: 80,
    technicalScore: 90,
    overallScore: 80,
    specialization: ["Agribusiness", "Precision Agriculture"],
    status: "placed",
    completedModules: 4,
    totalModules: 4,
    certCount: 3,
  },
  {
    id: "cand-006",
    name: "Maya Sari",
    age: 23,
    origin: "Denpasar, Bali",
    program: "Design & Creative",
    jlptLevel: "N3",
    languageScore: 86,
    culturalScore: 93,
    technicalScore: 88,
    overallScore: 89,
    specialization: ["Graphic Design", "Animation", "Creative Media"],
    status: "available",
    completedModules: 4,
    totalModules: 4,
    certCount: 4,
  },
];

export interface CareerMilestone {
  id: string;
  date: string;
  type:
    | "placement"
    | "promotion"
    | "contract_renewal"
    | "transfer"
    | "certification"
    | "notification";
  title: string;
  titleJp?: string;
  company: string;
  location: string;
  description: string;
  salaryChange?: string;
  isProactive?: boolean;
  proactiveMessage?: string;
}

export const CAREER_MILESTONES: CareerMilestone[] = [
  {
    id: "car-001",
    date: "2025-04-01",
    type: "placement",
    title: "Initial Placement",
    titleJp: "初就職",
    company: "Sample Manufacturer Co., Ltd.",
    location: "Osaka, Japan",
    description:
      "Started career as Quality Engineer on the steel production line.",
  },
  {
    id: "car-002",
    date: "2025-10-15",
    type: "certification",
    title: "ISO 9001 Internal Auditor Certification",
    company: "Sample Manufacturer Co., Ltd.",
    location: "Osaka, Japan",
    description:
      "Earned ISO 9001 internal auditor certification for quality standards.",
  },
  {
    id: "car-003",
    date: "2026-04-01",
    type: "promotion",
    title: "Promotion: Senior QE",
    titleJp: "昇進: シニア品質エンジニア",
    company: "Sample Manufacturer Co., Ltd.",
    location: "Osaka, Japan",
    description:
      "Promoted to Senior Quality Engineer after 12 months of outstanding performance.",
    salaryChange: "+18%",
  },
  {
    id: "car-004",
    date: "2026-07-11",
    type: "notification",
    title: "Recommendation: Contract Negotiation Window",
    company: "Sample Manufacturer Co., Ltd.",
    location: "Osaka, Japan",
    description:
      "Your contract will end in 90 days. This is an optimal window to start renewal discussions or explore new opportunities.",
    isProactive: true,
    proactiveMessage:
      "On average, alumni who negotiate between months 15–18 secure a 12–22% increase. You are currently at month 15.",
  },
];

export interface CurriculumModule {
  id: string;
  phase: 1 | 2 | 3 | 4;
  phaseLabel: string;
  title: string;
  titleJp?: string;
  description: string;
  progress: number;
  status: "completed" | "in_progress" | "locked";
  sessions: number;
  completedSessions: number;
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: "mod-01",
    phase: 1,
    phaseLabel: "Phase 1",
    title: "Japanese Language Foundations",
    titleJp: "日本語基礎",
    description:
      "Hiragana, Katakana, and basic N5–N4 vocabulary with Indonesian-language explanations.",
    progress: 100,
    status: "completed",
    sessions: 12,
    completedSessions: 12,
  },
  {
    id: "mod-02",
    phase: 2,
    phaseLabel: "Phase 2",
    title: "Workplace Culture & Etiquette",
    titleJp: "職場文化・礼儀",
    description:
      "Understanding Japanese corporate culture: honne/tatemae, nemawashi, and organisational hierarchy.",
    progress: 75,
    status: "in_progress",
    sessions: 8,
    completedSessions: 6,
  },
  {
    id: "mod-03",
    phase: 3,
    phaseLabel: "Phase 3",
    title: "Keigo & Negotiation Simulation",
    titleJp: "敬語・交渉シミュレーション",
    description:
      "Hands-on practice with senior mentors: advanced Keigo and real-world business meeting simulations.",
    progress: 0,
    status: "locked",
    sessions: 6,
    completedSessions: 0,
  },
  {
    id: "mod-04",
    phase: 4,
    phaseLabel: "Phase 4",
    title: "Certification & Job Preparation",
    titleJp: "資格認定・就職準備",
    description:
      "Final assessment, competency certification, and Rirekisho generation.",
    progress: 0,
    status: "locked",
    sessions: 4,
    completedSessions: 0,
  },
];

export interface Session {
  id: string;
  title: string;
  titleJp?: string;
  studentName: string;
  date: string;
  time: string;
  duration: string;
  type: "bilingual" | "silver";
  status: "scheduled" | "completed" | "cancelled";
  topic: string;
}

export const SESSIONS: Session[] = [
  {
    id: "sess-001",
    title: "Basic Keigo — Office Conversation",
    titleJp: "敬語基礎 — オフィス会話",
    studentName: "Sample Student",
    date: "2026-07-12",
    time: "09:00",
    duration: "60 minutes",
    type: "bilingual",
    status: "scheduled",
    topic: "Formal conversation in a Japanese office environment",
  },
  {
    id: "sess-002",
    title: "Business Meeting Simulation",
    titleJp: "ビジネス会議シミュレーション",
    studentName: "Sample Candidate",
    date: "2026-07-12",
    time: "14:00",
    duration: "90 minutes",
    type: "silver",
    status: "scheduled",
    topic: "Contract negotiation and project presentation in native Japanese",
  },
  {
    id: "sess-003",
    title: "Nemawashi & Ringi Culture",
    studentName: "Sample Candidate",
    date: "2026-07-11",
    time: "10:00",
    duration: "60 minutes",
    type: "bilingual",
    status: "completed",
    topic: "Collective decision-making process in Japanese companies",
  },
  {
    id: "sess-004",
    title: "Nomikai Etiquette & Social Relations",
    titleJp: "飲み会・社会関係の礼儀",
    studentName: "Sample Candidate",
    date: "2026-07-10",
    time: "15:00",
    duration: "60 minutes",
    type: "silver",
    status: "completed",
    topic: "Social event etiquette in Japanese companies",
  },
];

export interface StudentProgress {
  studentId: string;
  name: string;
  module: string;
  languageProgress: number;
  culturalProgress: number;
  lastActivity: string;
  notes: string;
}

export const STUDENT_PROGRESS: StudentProgress[] = [
  {
    studentId: "u-001",
    name: "Sample Student",
    module: "Phase 2 — Culture & Etiquette",
    languageProgress: 78,
    culturalProgress: 72,
    lastActivity: "2026-07-10",
    notes: "Needs more practice with teineigo (respectful language).",
  },
  {
    studentId: "u-006",
    name: "Sample Candidate",
    module: "Phase 1 — Language Foundations",
    languageProgress: 55,
    culturalProgress: 40,
    lastActivity: "2026-07-11",
    notes: "Good hiragana progress. Needs more katakana drills.",
  },
  {
    studentId: "u-007",
    name: "Sample Candidate",
    module: "Phase 2 — Culture & Etiquette",
    languageProgress: 85,
    culturalProgress: 88,
    lastActivity: "2026-07-09",
    notes: "Highly proactive. Ready for Phase 3.",
  },
];

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  company?: string;
  nameJp?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "u-001",
    name: "Budi Santoso",
    email: "budi@student.jijp.id",
    role: "student",
    title: "Kandidat Program Teknik Manufaktur",
  },
  {
    id: "u-002",
    name: "Tanaka Hiroshi",
    nameJp: "田中 浩",
    email: "tanaka@recruit.co.jp",
    role: "corporate",
    company: "Tanaka Manufacturing Co., Ltd.",
    title: "HR Manager",
  },
  {
    id: "u-003",
    name: "Sari Indrawati",
    email: "sari@educator.jijp.id",
    role: "educator_bilingual",
    title: "Instruktur Bahasa Jepang N3",
  },
  {
    id: "u-004",
    name: "Yamamoto Kenji",
    nameJp: "山本 健二",
    email: "yamamoto@silver.jijp.id",
    role: "educator_silver",
    company: "Retired — Toyota Motor Corporation",
    title: "Senior Industry Mentor",
  },
  {
    id: "u-005",
    name: "Rina Kusuma",
    email: "rina@alumni.jijp.id",
    role: "alumni",
    company: "Nippon Steel Corporation",
    title: "Quality Engineer — Osaka Plant",
  },
];

export interface JijpCredential {
  id: string;
  type: "certificate" | "transcript" | "badge";
  title: string;
  titleJp?: string;
  issuedDate: string;
  issuedBy: string;
  status: "valid" | "pending" | "expired";
  programName: string;
}

export const JIJP_CREDENTIALS: JijpCredential[] = [
  {
    id: "cred-001",
    type: "certificate",
    title: "Sertifikat Fondasi Bahasa Jepang",
    titleJp: "日本語基礎修了証",
    issuedDate: "2025-03-15",
    issuedBy: "JIJP Core Authority",
    status: "valid",
    programName: "Program Persiapan Industri Jepang 2025",
  },
  {
    id: "cred-002",
    type: "badge",
    title: "Badge Kultural Level 1",
    titleJp: "文化バッジ Lv.1",
    issuedDate: "2025-04-02",
    issuedBy: "JIJP Core Authority",
    status: "valid",
    programName: "Program Persiapan Industri Jepang 2025",
  },
  {
    id: "cred-003",
    type: "transcript",
    title: "Transkrip Program (Draft)",
    issuedDate: "—",
    issuedBy: "JIJP Core Authority",
    status: "pending",
    programName: "Program Persiapan Industri Jepang 2025",
  },
];

export const PLATFORM_STATS = {
  totalAlumni: 45,
  placementRate: 85.5,
  partnerCompanies: 6,
  avgTimeToPlacement: 4.3,
  countriesServed: 1,
  japaneseProvinces: 3,
};
