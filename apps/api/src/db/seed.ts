import bcrypt from "bcryptjs";
import type { Pool, ResultSetHeader } from "mysql2/promise";
import mysql from "mysql2/promise";

import { closePool, getPool } from "../db/pool.js";

const PROFILE_COLUMNS: ReadonlyArray<readonly [string, string]> = [
  ["name_jp", "VARCHAR(255) NULL"],
  ["birth_date", "DATE NULL"],
  ["origin_city", "VARCHAR(255) NULL"],
  ["phone", "VARCHAR(50) NULL"],
  ["jlpt_level", "VARCHAR(10) NULL"],
  ["specialization", "VARCHAR(500) NULL"],
  ["education_json", "JSON NULL"],
  ["experience_json", "JSON NULL"],
  ["skills_json", "JSON NULL"],
  ["bio_id", "TEXT NULL"],
  ["bio_jp", "TEXT NULL"],
  ["profile_verified", "TINYINT(1) DEFAULT 0"],
  ["avatar", "VARCHAR(500) NULL"],
  ["company_name", "VARCHAR(255) NULL"],
  ["title", "VARCHAR(255) NULL"],
  ["program_name", "VARCHAR(255) NULL"],
  [
    "candidate_status",
    "ENUM('available','interviewing','placed') DEFAULT 'available'",
  ],
  ["language_score", "INT DEFAULT 0"],
  ["cultural_score", "INT DEFAULT 0"],
  ["technical_score", "INT DEFAULT 0"],
  ["overall_score", "INT DEFAULT 0"],
  ["updated_at", "TIMESTAMP NULL"],
  ["updated_by", "INT NULL"],
  ["deleted_at", "TIMESTAMP NULL"],
  ["deleted_by", "INT NULL"],
];

const NEW_TABLES: ReadonlyArray<string> = [
  `CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NULL,
    description TEXT,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    type ENUM('class','partner_meeting','event','deadline') DEFAULT 'class',
    visibility ENUM('student','alumni','corporate','all') DEFAULT 'student',
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_start (start_at),
    INDEX idx_type (type)
  )`,
  `CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NULL,
    description TEXT,
    phase TINYINT DEFAULT 1,
    educator_id INT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NULL,
    sort_order INT DEFAULT 0,
    duration_minutes INT DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_course (course_id, sort_order),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress_pct TINYINT DEFAULT 0,
    status ENUM('enrolled','in_progress','completed','dropped') DEFAULT 'enrolled',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    UNIQUE KEY uniq_user_course (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('ktp','certificate','portfolio','transcript','badge') NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_mime VARCHAR(100) NOT NULL,
    file_size_bytes INT NOT NULL,
    issued_by VARCHAR(255) NULL,
    issued_date DATE NULL,
    verification_status ENUM('pending','approved','rejected') DEFAULT 'pending',
    verification_notes TEXT NULL,
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (verification_status)
  )`,
  `CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_jp VARCHAR(255) NULL,
    industry VARCHAR(100) NULL,
    website VARCHAR(500) NULL,
    description TEXT,
    contact_email VARCHAR(255) NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NULL,
    description TEXT,
    requirements TEXT,
    specialization VARCHAR(500) NULL,
    min_jlpt VARCHAR(10) NULL,
    location VARCHAR(255) NULL,
    employment_type ENUM('fulltime','contract','internship') DEFAULT 'fulltime',
    salary_range VARCHAR(100) NULL,
    is_active TINYINT(1) DEFAULT 1,
    posted_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    INDEX idx_active (is_active, created_at),
    INDEX idx_company (company_id),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    type ENUM('apply','scout') NOT NULL,
    status ENUM('submitted','shortlisted','rejected','accepted','withdrawn') DEFAULT 'submitted',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP NULL,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL,
    deleted_by INT NULL,
    UNIQUE KEY uniq_job_user_type (job_id, user_id, type),
    INDEX idx_user (user_id),
    INDEX idx_job (job_id),
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS notification_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    subject_id VARCHAR(255) NOT NULL,
    subject_jp VARCHAR(255) NULL,
    body_id TEXT NOT NULL,
    body_jp TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    channel ENUM('email','webhook','in_app') NOT NULL,
    template_key VARCHAR(100) NOT NULL,
    payload_json JSON NULL,
    subject VARCHAR(255) NULL,
    status ENUM('queued','sent','failed','skipped') DEFAULT 'queued',
    error_message TEXT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_unread (user_id, read_at),
    INDEX idx_status (status)
  )`,
];

const AUDIT_COLUMNS: ReadonlyArray<readonly [string, string, string]> = [
  ["job_postings", "deleted_at", "TIMESTAMP NULL"],
  ["job_postings", "deleted_by", "INT NULL"],
  ["job_postings", "updated_at", "TIMESTAMP NULL"],
  ["job_postings", "updated_by", "INT NULL"],
  ["documents", "deleted_at", "TIMESTAMP NULL"],
  ["documents", "deleted_by", "INT NULL"],
  ["documents", "updated_at", "TIMESTAMP NULL"],
  ["calendar_events", "deleted_at", "TIMESTAMP NULL"],
  ["calendar_events", "deleted_by", "INT NULL"],
  ["courses", "deleted_at", "TIMESTAMP NULL"],
  ["courses", "deleted_by", "INT NULL"],
  ["job_applications", "deleted_at", "TIMESTAMP NULL"],
  ["job_applications", "deleted_by", "INT NULL"],
  ["job_applications", "updated_by", "INT NULL"],
  ["companies", "deleted_at", "TIMESTAMP NULL"],
  ["companies", "deleted_by", "INT NULL"],
];

export async function initSchema(activePool?: Pool): Promise<void> {
  const p = activePool ?? getPool();

  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      ice_uuid VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  for (const [col, def] of PROFILE_COLUMNS) {
    try {
      await p.query(`ALTER TABLE users ADD COLUMN ${col} ${def}`);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "ER_DUP_FIELDNAME") {
        console.warn(`users.${col}:`, (err as Error).message);
      }
    }
  }

  for (const sql of NEW_TABLES) {
    try {
      await p.query(sql);
    } catch (err) {
      console.warn("CREATE TABLE err:", (err as Error).message);
    }
  }

  for (const [table, col, def] of AUDIT_COLUMNS) {
    try {
      await p.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "ER_DUP_FIELDNAME") {
        console.warn(`${table}.${col}:`, (err as Error).message);
      }
    }
  }
}

export async function seedInitialData(p: Pool): Promise<void> {
  console.log("[seeder] Menginisialisasi data master platform demo JIJP...");
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Users
  const usersToInsert = [
    {
      name: "Admin JIJP",
      name_jp: "管理者 JIJP",
      email: "admin@jijp.id",
      role: "admin",
      title: "Lead Administrator",
      profile_verified: 1,
      bio_id: "Administrator utama JIJP.",
    },
    {
      name: "Tanaka Hiroshi",
      name_jp: "田中 浩",
      email: "corporate@chubu-precision.jp",
      role: "corporate",
      company_name: "Chubu Precision Machining Co., Ltd.",
      title: "HR & Recruitment Director",
      profile_verified: 1,
      bio_id:
        "Direktur Rekrutmen Global Chubu Precision Machining Co., Ltd. Aichi.",
      bio_jp: "中部精密機械株式会社・海外採用統括ディレクター。",
    },
    {
      name: "Budi Santoso",
      name_jp: "ブディ・サントソ",
      email: "budi.santoso@student.jijp.id",
      role: "student",
      birth_date: "2001-08-15",
      origin_city: "Surabaya, Jawa Timur",
      phone: "+62 812-3456-7890",
      jlpt_level: "N3",
      specialization:
        "Manufacturing, Automotive, CNC Machining, Quality Control",
      education_json: JSON.stringify([
        {
          year: "2020 - 2024",
          degree: "S1 Teknik Mesin & Manufaktur",
          institution: "Institut Teknologi Sepuluh Nopember (ITS)",
        },
      ]),
      experience_json: JSON.stringify([
        {
          start: "2023-08",
          end: "2024-02",
          title: "CNC Machine Operator Intern",
          company: "PT Astra Otoparts Tbk",
        },
        {
          start: "2024-03",
          end: "2025-01",
          title: "Junior Quality Assurance Staff",
          company: "PT Komatsu Undercarriage Indonesia",
        },
      ]),
      skills_json: JSON.stringify([
        "CNC Milling",
        "AutoCAD",
        "SolidWorks",
        "5S & Kaizen",
        "PLC Basics",
        "Technical Japanese N3",
      ]),
      bio_id:
        "Lulusan Teknik Mesin ITS dengan spesialisasi manufaktur presisi dan permesinan CNC. Telah menyelesaikan program persiapan bahasa Jepang intensif JIJP tingkat N3 dan siap berkontribusi pada industri manufaktur di Jepang.",
      bio_jp:
        "ITS機械工学科卒業生。精密加工およびCNC工作機械を専攻。JIJPの集中日本語研修プログラム（N3レベル）を修了し、日本のものづくり製造業で即戦力として貢献することを目指しています。",
      profile_verified: 1,
      candidate_status: "available",
      language_score: 85,
      cultural_score: 92,
      technical_score: 89,
      overall_score: 89,
      title: "Kandidat Teknik Manufaktur & CNC",
      program_name: "Program Persiapan Industri Manufaktur Jepang 2025",
    },
    {
      name: "Dewi Rahayu",
      name_jp: "デウィ・ラハユ",
      email: "dewi.rahayu@student.jijp.id",
      role: "student",
      birth_date: "2002-04-12",
      origin_city: "Bandung, Jawa Barat",
      phone: "+62 813-9876-5432",
      jlpt_level: "N2",
      specialization:
        "Information Technology, Embedded Systems, Semiconductor, Bridge SE",
      education_json: JSON.stringify([
        {
          year: "2020 - 2024",
          degree: "S1 Teknik Informatika",
          institution: "Institut Teknologi Bandung (ITB)",
        },
      ]),
      experience_json: JSON.stringify([
        {
          start: "2023-06",
          end: "2023-12",
          title: "Embedded Firmware Intern",
          company: "PT Len Industri (Persero)",
        },
      ]),
      skills_json: JSON.stringify([
        "C/C++",
        "RTOS",
        "IoT Protocols",
        "Python",
        "Bridge SE Documentation",
        "Business Japanese N2",
      ]),
      bio_id:
        "Spesialis perangkat lunak tersemat (Embedded Systems) dan kandidat Bridge System Engineer lulusan ITB dengan kompetensi bahasa Jepang N2.",
      bio_jp:
        "ITB情報工学科卒業。組み込みシステム開発専攻、日本語能力試験N2保持。日イ協業プロジェクトを推進するブリッジエンジニア志望。",
      profile_verified: 1,
      candidate_status: "interviewing",
      language_score: 91,
      cultural_score: 88,
      technical_score: 94,
      overall_score: 91,
      title: "Kandidat Embedded Systems & Bridge SE",
      program_name: "Program Persiapan Industri IT & Otomasi Jepang 2025",
    },
    {
      name: "Rina Kusuma",
      name_jp: "リナ・クスマ",
      email: "rina.kusuma@alumni.jijp.id",
      role: "alumni",
      company_name: "Nippon Steel Corporation",
      title: "Senior Quality Engineer — Osaka Plant",
      profile_verified: 1,
      origin_city: "Yogyakarta, DIY",
      jlpt_level: "N2",
      candidate_status: "placed",
      bio_id:
        "Alumni JIJP angkatan 2024 yang kini bekerja aktif sebagai Quality Engineer di Nippon Steel Osaka.",
      bio_jp:
        "2024年JIJP修了生。現在日本製鉄大阪製鉄所にて品質保証エンジニアとして勤務中。",
    },
    {
      name: "Sari Indrawati",
      name_jp: "サリ・インドラワティ",
      email: "sari.sensei@jijp.id",
      role: "educator_bilingual",
      title: "Instruktur Bahasa & Budaya Bisnis Jepang N3",
      profile_verified: 1,
      bio_id:
        "Pengajar profesional dengan pengalaman 7 tahun mengajar etiket bisnis dan persiapan JLPT untuk tenaga kerja teknik.",
    },
  ];

  const userIds: Record<string, number> = {};
  for (const u of usersToInsert) {
    const [existingRows] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [u.email],
    );
    if (existingRows.length > 0 && existingRows[0]) {
      userIds[u.email] = Number(existingRows[0].id);
      await p.query(
        `UPDATE users SET
          name = ?, name_jp = ?, password_hash = ?, role = ?, title = ?,
          company_name = ?, birth_date = ?, origin_city = ?, phone = ?,
          jlpt_level = ?, specialization = ?, education_json = ?, experience_json = ?,
          skills_json = ?, bio_id = ?, bio_jp = ?, profile_verified = ?,
          candidate_status = ?, language_score = ?, cultural_score = ?,
          technical_score = ?, overall_score = ?, program_name = ?
         WHERE id = ?`,
        [
          u.name,
          u.name_jp ?? null,
          passwordHash,
          u.role,
          u.title ?? null,
          u.company_name ?? null,
          (u as { birth_date?: string }).birth_date ?? null,
          (u as { origin_city?: string }).origin_city ?? null,
          (u as { phone?: string }).phone ?? null,
          (u as { jlpt_level?: string }).jlpt_level ?? null,
          (u as { specialization?: string }).specialization ?? null,
          (u as { education_json?: string }).education_json ?? null,
          (u as { experience_json?: string }).experience_json ?? null,
          (u as { skills_json?: string }).skills_json ?? null,
          u.bio_id ?? null,
          (u as { bio_jp?: string }).bio_jp ?? null,
          u.profile_verified ?? 0,
          (u as { candidate_status?: string }).candidate_status ?? "available",
          (u as { language_score?: number }).language_score ?? 0,
          (u as { cultural_score?: number }).cultural_score ?? 0,
          (u as { technical_score?: number }).technical_score ?? 0,
          (u as { overall_score?: number }).overall_score ?? 0,
          (u as { program_name?: string }).program_name ?? null,
          userIds[u.email],
        ],
      );
    } else {
      const [res] = await p.query<ResultSetHeader>(
        `INSERT INTO users
          (name, name_jp, email, password_hash, role, title, company_name, birth_date,
           origin_city, phone, jlpt_level, specialization, education_json, experience_json,
           skills_json, bio_id, bio_jp, profile_verified, candidate_status, language_score,
           cultural_score, technical_score, overall_score, program_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u.name,
          u.name_jp ?? null,
          u.email,
          passwordHash,
          u.role,
          u.title ?? null,
          u.company_name ?? null,
          (u as { birth_date?: string }).birth_date ?? null,
          (u as { origin_city?: string }).origin_city ?? null,
          (u as { phone?: string }).phone ?? null,
          (u as { jlpt_level?: string }).jlpt_level ?? null,
          (u as { specialization?: string }).specialization ?? null,
          (u as { education_json?: string }).education_json ?? null,
          (u as { experience_json?: string }).experience_json ?? null,
          (u as { skills_json?: string }).skills_json ?? null,
          u.bio_id ?? null,
          (u as { bio_jp?: string }).bio_jp ?? null,
          u.profile_verified ?? 0,
          (u as { candidate_status?: string }).candidate_status ?? "available",
          (u as { language_score?: number }).language_score ?? 0,
          (u as { cultural_score?: number }).cultural_score ?? 0,
          (u as { technical_score?: number }).technical_score ?? 0,
          (u as { overall_score?: number }).overall_score ?? 0,
          (u as { program_name?: string }).program_name ?? null,
        ],
      );
      userIds[u.email] = res.insertId;
    }
  }

  const corporateUserId = userIds["corporate@chubu-precision.jp"]!;
  const budiUserId = userIds["budi.santoso@student.jijp.id"]!;
  const dewiUserId = userIds["dewi.rahayu@student.jijp.id"]!;
  const educatorUserId = userIds["sari.sensei@jijp.id"]!;
  const adminUserId = userIds["admin@jijp.id"]!;

  // 2. Companies
  const companiesToInsert = [
    {
      name: "Chubu Precision Machining Co., Ltd.",
      name_jp: "中部精密機械株式会社",
      industry: "Precision Machinery & Automotive Parts",
      website: "https://chubu-precision.example.co.jp",
      description:
        "Perusahaan manufaktur presisi tier-1 berpusat di Prefektur Aichi, memasok komponen transmisi dan suspensi otomotif presisi tinggi untuk produsen global di Jepang.",
      contact_email: "recruitment@chubu-precision.example.co.jp",
      created_by: corporateUserId,
    },
    {
      name: "Tokyo Advanced Automation & Robotics",
      name_jp: "東京先端自動化ロボティクス株式会社",
      industry: "Industrial Robotics & Embedded Systems",
      website: "https://tokyo-automation.example.co.jp",
      description:
        "Penyedia solusi robotik industri terdepan di Tokyo, mengembangkan sistem otomasi cerdas dan software kendali tersemat untuk lini produksi generasi baru.",
      contact_email: "hr@tokyo-automation.example.co.jp",
      created_by: corporateUserId,
    },
    {
      name: "Kansai Steel & Materials Corp",
      name_jp: "関西マテリアル鋼業株式会社",
      industry: "Metalworking, Metallurgy & Heavy Industry",
      website: "https://kansai-steel.example.co.jp",
      description:
        "Produsen material baja struktur dan komponen tempa industri berat dengan pabrik terpadu di kawasan industri Osaka dan Hyogo.",
      contact_email: "career@kansai-steel.example.co.jp",
      created_by: corporateUserId,
    },
  ];

  const companyIds: Record<string, number> = {};
  for (const c of companiesToInsert) {
    const [existing] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM companies WHERE name = ?",
      [c.name],
    );
    if (existing.length > 0 && existing[0]) {
      companyIds[c.name] = Number(existing[0].id);
    } else {
      const [res] = await p.query<ResultSetHeader>(
        `INSERT INTO companies (name, name_jp, industry, website, description, contact_email, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          c.name,
          c.name_jp,
          c.industry,
          c.website,
          c.description,
          c.contact_email,
          c.created_by,
        ],
      );
      companyIds[c.name] = res.insertId;
    }
  }

  // 3. Job Postings
  const jobsToInsert = [
    {
      company_id: companyIds["Chubu Precision Machining Co., Ltd."]!,
      title: "CNC Machining & Quality Control Specialist",
      title_jp: "CNC工作機械オペレーター・品質管理スペシャリスト",
      description:
        "Bertanggung jawab atas pengoperasian mesin CNC milling/lathe 5-axis, pengukuran presisi mikron (CMM), dan penerapan standar 5S/Kaizen di lini produksi Aichi.",
      requirements:
        "Lulusan D3/S1 Teknik Mesin/Manufaktur. Mampu membaca gambar teknik CAD/CAM. Memiliki pemahaman dasar permesinan logam. Minimal JLPT N3.",
      specialization:
        "Manufacturing, Automotive, CNC Machining, Quality Control",
      min_jlpt: "N3",
      location: "Toyota City, Aichi Prefecture, Japan",
      employment_type: "fulltime",
      salary_range: "¥240,000 - ¥300,000 / bulan",
      is_active: 1,
      posted_by: corporateUserId,
    },
    {
      company_id: companyIds["Tokyo Advanced Automation & Robotics"]!,
      title: "Embedded Systems & Bridge Software Engineer",
      title_jp: "組み込みソフトウェア・ブリッジシステムエンジニア",
      description:
        "Mengembangkan firmware mikrokontroler untuk controller robotik industri dan menjembatani komunikasi teknis antara tim rekayasa Tokyo dan offshore center.",
      requirements:
        "Kemampuan C/C++, RTOS, Linux tersemat. Pengalaman git dan dokumentasi arsitektur perangkat lunak. Kemampuan bahasa Jepang bisnis minimal JLPT N2.",
      specialization: "IT, Embedded Systems, Bridge SE, Software Development",
      min_jlpt: "N2",
      location: "Shinagawa, Tokyo, Japan",
      employment_type: "fulltime",
      salary_range: "¥280,000 - ¥380,000 / bulan",
      is_active: 1,
      posted_by: corporateUserId,
    },
    {
      company_id: companyIds["Kansai Steel & Materials Corp"]!,
      title: "Industrial Automation Robotics Technician",
      title_jp: "産業用ロボット自動化エンジニア・保全技術者",
      description:
        "Melakukan instalasi, pemrograman robot artikulasi Fanuc/Yaskawa, serta pemeliharaan preventif sensor dan aktuator sistem pneumatik hidrolik pabrik.",
      requirements:
        "Pengalaman dasar PLC, motor servo, dan sensor industri. Bersedia bekerja dengan sistem shift berstandar keselamatan tinggi. Minimal JLPT N3.",
      specialization: "Automation, Mechatronics, Maintenance",
      min_jlpt: "N3",
      location: "Osaka, Kansai, Japan",
      employment_type: "fulltime",
      salary_range: "¥250,000 - ¥320,000 / bulan",
      is_active: 1,
      posted_by: corporateUserId,
    },
    {
      company_id: companyIds["Chubu Precision Machining Co., Ltd."]!,
      title: "Precision Mold Design Engineer (CAD/CAM)",
      title_jp: "金型設計技術者（CAD/CAM）",
      description:
        "Merancang dies dan molds untuk pengecoran presisi tinggi menggunakan SolidWorks dan NX, berkoordinasi dengan tim produksi.",
      requirements:
        "Kemampuan 3D CAD, toleransi geometris GD&T, dasar metalurgi. Minimal JLPT N4.",
      specialization: "Manufacturing, CAD/CAM, Mold Design",
      min_jlpt: "N4",
      location: "Nagoya, Aichi Prefecture, Japan",
      employment_type: "fulltime",
      salary_range: "¥230,000 - ¥290,000 / bulan",
      is_active: 1,
      posted_by: corporateUserId,
    },
  ];

  const jobIds: number[] = [];
  for (const j of jobsToInsert) {
    const [existing] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM job_postings WHERE company_id = ? AND title = ?",
      [j.company_id, j.title],
    );
    if (existing.length > 0 && existing[0]) {
      jobIds.push(Number(existing[0].id));
    } else {
      const [res] = await p.query<ResultSetHeader>(
        `INSERT INTO job_postings
          (company_id, title, title_jp, description, requirements, specialization, min_jlpt, location, employment_type, salary_range, is_active, posted_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          j.company_id,
          j.title,
          j.title_jp,
          j.description,
          j.requirements,
          j.specialization,
          j.min_jlpt,
          j.location,
          j.employment_type,
          j.salary_range,
          j.is_active,
          j.posted_by,
        ],
      );
      jobIds.push(res.insertId);
    }
  }

  // 4. Courses & Modules
  const coursesData = [
    {
      phase: 1,
      title: "Fondasi Bahasa Jepang Industri (N5–N4 & Keigo Dasar)",
      title_jp: "産業日本語基礎（N5–N4・基本敬語）",
      description:
        "Penguasaan alfabet Hiragana, Katakana, kanji dasar manufaktur, serta tata bahasa operasional bengkel dan kantor Jepang.",
      educator_id: educatorUserId,
      modules: [
        {
          title: "Hiragana, Katakana & Fonetik Pelafalan Jepang",
          title_jp: "平仮名・片仮名・発音基礎",
          duration: 90,
        },
        {
          title: "Kosakata Keselamatan Kerja & Perkakas Manufaktur",
          title_jp: "安全標語・工場工具語彙",
          duration: 120,
        },
        {
          title: "Pola Kalimat Instruksi & Respon di Tempat Kerja",
          title_jp: "作業指示・応答の文型",
          duration: 120,
        },
      ],
    },
    {
      phase: 2,
      title: "Budaya Kerja & Etiket Korporasi Jepang (5S, Kaizen, Hou-Ren-So)",
      title_jp: "日本企業の労働文化・ビジネスマナー（5S・改善・報連相）",
      description:
        "Memahami filosofi manufaktur Jepang (Monodukuri), komunikasi vertikal-horizontal (Hou-Ren-So), dan penerapan disiplin 5S.",
      educator_id: educatorUserId,
      modules: [
        {
          title: "Praktik 5S & Standar Manajemen Visual",
          title_jp: "5S実践と視覚管理",
          duration: 90,
        },
        {
          title: "Prinsip Hou-Ren-So dalam Pelaporan Kerja Harian",
          title_jp: "報連相の原則と実務報告",
          duration: 90,
        },
        {
          title: "Etiket Salam (Aisatsu), Hirarki, dan Tatakrama Meishi",
          title_jp: "挨拶・職場の序列・名刺交換マナー",
          duration: 90,
        },
      ],
    },
    {
      phase: 3,
      title: "Keigo Lanjutan & Simulasi Negosiasi Bisnis",
      title_jp: "上級敬語・ビジネス商談シミュレーション",
      description:
        "Latihan intensif sonkeigo, kenjougo, simulasi meeting dengan mitra Jepang, dan tata krama komunikasi resmi.",
      educator_id: educatorUserId,
      modules: [
        {
          title: "Bahasa Hormat Sonkeigo & Kenjougo di Lingkungan Bisnis",
          title_jp: "尊敬語・謙譲語の使い分け",
          duration: 120,
        },
        {
          title: "Simulasi Wawancara Kerja & Presentasi Diri (Jikoshoukai)",
          title_jp: "模擬面接・自己紹介プレゼンテーション",
          duration: 150,
        },
      ],
    },
    {
      phase: 4,
      title: "Sertifikasi Tokutei Ginou / Bridge SE & Persiapan Rirekisho",
      title_jp: "特定技能評価試験・ブリッジSE認定・履歴書完成",
      description:
        "Penilaian akhir kompetensi kejuruan, persiapan dokumen visa kerja, dan pembuatan CV standar Jepang (Rirekisho & Shokumu Keirekisho).",
      educator_id: educatorUserId,
      modules: [
        {
          title: "Simulasi Ujian Kemampuan Bidang Manufaktur & IT",
          title_jp: "製造業・IT技能評価試験対策",
          duration: 120,
        },
        {
          title: "Finalisasi Dokumen Rirekisho & Persiapan Penempatan",
          title_jp: "日本式履歴書完成・就労準備",
          duration: 120,
        },
      ],
    },
  ];

  const courseIds: number[] = [];
  for (const c of coursesData) {
    let courseId: number;
    const [existing] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM courses WHERE title = ?",
      [c.title],
    );
    if (existing.length > 0 && existing[0]) {
      courseId = Number(existing[0].id);
    } else {
      const [res] = await p.query<ResultSetHeader>(
        `INSERT INTO courses (title, title_jp, description, phase, educator_id, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [c.title, c.title_jp, c.description, c.phase, c.educator_id],
      );
      courseId = res.insertId;
    }
    courseIds.push(courseId);

    let sortOrder = 1;
    for (const m of c.modules) {
      const [mExisting] = await p.query<mysql.RowDataPacket[]>(
        "SELECT id FROM course_modules WHERE course_id = ? AND title = ?",
        [courseId, m.title],
      );
      if (mExisting.length === 0) {
        await p.query(
          `INSERT INTO course_modules (course_id, title, title_jp, sort_order, duration_minutes)
           VALUES (?, ?, ?, ?, ?)`,
          [courseId, m.title, m.title_jp, sortOrder, m.duration],
        );
      }
      sortOrder++;
    }
  }

  // 5. Course Enrollments for Budi Santoso
  if (courseIds.length >= 4) {
    const enrollments = [
      {
        course_id: courseIds[0]!,
        progress_pct: 100,
        status: "completed",
        started_at: "2025-01-10 08:00:00",
        completed_at: "2025-03-20 17:00:00",
      },
      {
        course_id: courseIds[1]!,
        progress_pct: 75,
        status: "in_progress",
        started_at: "2025-03-25 08:00:00",
        completed_at: null,
      },
      {
        course_id: courseIds[2]!,
        progress_pct: 0,
        status: "enrolled",
        started_at: "2025-05-01 08:00:00",
        completed_at: null,
      },
      {
        course_id: courseIds[3]!,
        progress_pct: 0,
        status: "enrolled",
        started_at: "2025-06-01 08:00:00",
        completed_at: null,
      },
    ];

    for (const e of enrollments) {
      await p.query(
        `INSERT INTO course_enrollments (user_id, course_id, progress_pct, status, started_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE progress_pct = VALUES(progress_pct), status = VALUES(status)`,
        [
          budiUserId,
          e.course_id,
          e.progress_pct,
          e.status,
          e.started_at,
          e.completed_at,
        ],
      );
    }
  }

  // 6. Calendar Events
  const now = new Date();
  const formatSqlDatetime = (d: Date) =>
    d.toISOString().slice(0, 19).replace("T", " ");

  const d1 = new Date(now.getTime() + 2 * 86400000);
  d1.setHours(9, 0, 0, 0);
  const d1End = new Date(d1.getTime() + 2 * 3600000);

  const d2 = new Date(now.getTime() + 4 * 86400000);
  d2.setHours(14, 0, 0, 0);
  const d2End = new Date(d2.getTime() + 1.5 * 3600000);

  const d3 = new Date(now.getTime() + 7 * 86400000);
  d3.setHours(23, 59, 0, 0);

  const events = [
    {
      title: "Kelas Keigo Lanjutan & Simulasi Wawancara",
      title_jp: "上級敬語・模擬面接講義",
      description:
        "Sesi interaktif bersama Sensei melatih pola sapaan formal dan respon pertanyaan wawancara kerja teknis.",
      start_at: formatSqlDatetime(d1),
      end_at: formatSqlDatetime(d1End),
      type: "class",
      visibility: "student",
      created_by: educatorUserId,
    },
    {
      title: "Sesi Tanya Jawab Perusahaan Mitra Chubu Precision",
      title_jp: "中部精密機械・会社説明会＆Q&Aセッション",
      description:
        "Pemaparan lingkungan kerja pabrik Toyota City, fasilitas asrama, dan skema lembur oleh HR Manager Tanaka-san.",
      start_at: formatSqlDatetime(d2),
      end_at: formatSqlDatetime(d2End),
      type: "partner_meeting",
      visibility: "all",
      created_by: corporateUserId,
    },
    {
      title: "Batas Akhir Submit Dokumen Portofolio Batch 1",
      title_jp: "第1期ポートフォリオ提出締め切り",
      description:
        "Pengumpulan berkas portofolio teknis dan transkrip nilai terjemahan bahasa Jepang.",
      start_at: formatSqlDatetime(d3),
      end_at: formatSqlDatetime(d3),
      type: "deadline",
      visibility: "student",
      created_by: adminUserId,
    },
  ];

  for (const ev of events) {
    const [existing] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM calendar_events WHERE title = ?",
      [ev.title],
    );
    if (existing.length === 0) {
      await p.query(
        `INSERT INTO calendar_events (title, title_jp, description, start_at, end_at, type, visibility, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ev.title,
          ev.title_jp,
          ev.description,
          ev.start_at,
          ev.end_at,
          ev.type,
          ev.visibility,
          ev.created_by,
        ],
      );
    }
  }

  // 7. Documents Vault (with master fixtures)
  const docsToInsert = [
    {
      user_id: budiUserId,
      type: "ktp",
      title: "KTP Budi Santoso (WNI Valid)",
      file_path: "ktp/sample-ktp.pdf",
      file_mime: "application/pdf",
      file_size_bytes: 102400,
      issued_by: "Disdukcapil Kota Surabaya",
      issued_date: "2019-08-15",
      verification_status: "approved",
      verification_notes:
        "Data identitas kependudukan terverifikasi valid sesuai standar.",
      verified_by: adminUserId,
      verified_at: "2025-01-15 10:00:00",
    },
    {
      user_id: budiUserId,
      type: "certificate",
      title: "Sertifikat Resmi JLPT N3 (JEES)",
      file_path: "certificate/sample-jlpt-n3.pdf",
      file_mime: "application/pdf",
      file_size_bytes: 204800,
      issued_by: "Japan Educational Exchanges and Services (JEES)",
      issued_date: "2025-07-20",
      verification_status: "approved",
      verification_notes:
        "Skor 135/180 terverifikasi valid melalui basis data JEES.",
      verified_by: adminUserId,
      verified_at: "2025-07-25 14:30:00",
    },
    {
      user_id: budiUserId,
      type: "transcript",
      title: "Transkrip Akademik S1 Teknik Mesin ITS",
      file_path: "transcript/sample-transcript.pdf",
      file_mime: "application/pdf",
      file_size_bytes: 307200,
      issued_by: "Institut Teknologi Sepuluh Nopember",
      issued_date: "2025-02-15",
      verification_status: "approved",
      verification_notes:
        "IPK 3.65 dan daftar mata kuliah permesinan presisi valid.",
      verified_by: adminUserId,
      verified_at: "2025-02-20 09:15:00",
    },
    {
      user_id: budiUserId,
      type: "portfolio",
      title: "Portofolio Proyek Desain Mesin & Manufaktur",
      file_path: "portfolio/sample-portfolio.pdf",
      file_mime: "application/pdf",
      file_size_bytes: 512000,
      issued_by: "Budi Santoso",
      issued_date: "2025-02-20",
      verification_status: "approved",
      verification_notes: "Koleksi gambar kerja CAD 3D dan dokumentasi rapi.",
      verified_by: adminUserId,
      verified_at: "2025-02-22 11:00:00",
    },
    {
      user_id: dewiUserId,
      type: "certificate",
      title: "Sertifikat Pelatihan Manufaktur Presisi & Kaizen (5S)",
      file_path: "certificate/sample-pend-cert.pdf",
      file_mime: "application/pdf",
      file_size_bytes: 180000,
      issued_by: "Balai Latihan Kerja Industri",
      issued_date: "2026-08-10",
      verification_status: "pending", // PENDING FOR ADMIN DEMO!
      verification_notes: null,
      verified_by: null,
      verified_at: null,
    },
  ];

  for (const doc of docsToInsert) {
    const [existing] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM documents WHERE user_id = ? AND title = ?",
      [doc.user_id, doc.title],
    );
    if (existing.length === 0) {
      await p.query(
        `INSERT INTO documents
          (user_id, type, title, file_path, file_mime, file_size_bytes, issued_by, issued_date, verification_status, verification_notes, verified_by, verified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doc.user_id,
          doc.type,
          doc.title,
          doc.file_path,
          doc.file_mime,
          doc.file_size_bytes,
          doc.issued_by,
          doc.issued_date,
          doc.verification_status,
          doc.verification_notes,
          doc.verified_by,
          doc.verified_at,
        ],
      );
    }
  }

  // 8. Job Applications & Scout
  if (jobIds.length >= 2) {
    const job1Id = jobIds[0]!; // Chubu Precision
    const job2Id = jobIds[1]!; // Tokyo Automation

    // Dewi applied to Tokyo Embedded
    const [appExist] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM job_applications WHERE job_id = ? AND user_id = ? AND type = 'apply'",
      [job2Id, dewiUserId],
    );
    if (appExist.length === 0) {
      await p.query(
        `INSERT INTO job_applications (job_id, user_id, type, status, message)
         VALUES (?, ?, 'apply', 'submitted', ?)`,
        [
          job2Id,
          dewiUserId,
          "Saya tertarik mengisi posisi Embedded Systems & Bridge SE di Tokyo. Saya telah memiliki sertifikat N2 dan pengalaman C/C++ pada mikrokontroler.",
        ],
      );
    }

    // Chubu Precision scouted Budi Santoso
    const [scoutExist] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM job_applications WHERE job_id = ? AND user_id = ? AND type = 'scout'",
      [job1Id, budiUserId],
    );
    if (scoutExist.length === 0) {
      await p.query(
        `INSERT INTO job_applications (job_id, user_id, type, status, message)
         VALUES (?, ?, 'scout', 'shortlisted', ?)`,
        [
          job1Id,
          budiUserId,
          "Profil manufaktur presisi dan skor teknis Anda sangat sesuai dengan lini produksi di Aichi. Kami mengundang Anda untuk wawancara daring tahap pertama.",
        ],
      );
    }
  }

  // 9. Notification Templates
  const templates = [
    {
      key: "document_submitted",
      subId: "Dokumen Baru Telah Diunggah",
      subJp: "新規書類が提出されました",
      bodyId:
        "Kandidat {{userName}} telah mengunggah dokumen baru ({{title}}). Silakan lakukan verifikasi berkas.",
      bodyJp:
        "{{userName}}様が新規書類（{{title}}）を提出しました。書類の確認を行ってください。",
    },
    {
      key: "document_approved",
      subId: "Dokumen Anda Telah Disetujui",
      subJp: "提出書類が承認されました",
      bodyId:
        "Selamat, dokumen {{title}} ({{type}}) Anda telah disetujui oleh tim verifikasi JIJP.",
      bodyJp: "{{title}}（{{type}}）が承認されました。",
    },
    {
      key: "document_rejected",
      subId: "Dokumen Memerlukan Revisi",
      subJp: "提出書類の再提出が必要です",
      bodyId:
        "Dokumen {{title}} ({{type}}) Anda belum memenuhi standar verifikasi. Catatan: {{notes}}",
      bodyJp: "{{title}}（{{type}}）に不備がありました。備考: {{notes}}",
    },
    {
      key: "application_submitted",
      subId: "Lamaran Pekerjaan Baru Diterima",
      subJp: "新規応募書類を受理しました",
      bodyId:
        "Kandidat {{name}} telah mengajukan lamaran untuk posisi {{jobTitle}}.",
      bodyJp: "{{name}}様より求人（{{jobTitle}}）への応募がありました。",
    },
    {
      key: "application_decided",
      subId: "Pembaruan Status Lamaran Pekerjaan",
      subJp: "選考結果のお知らせ",
      bodyId:
        "Halo {{name}}, status lamaran Anda untuk {{jobTitle}} di {{company}} telah diperbarui menjadi: {{status}}.",
      bodyJp:
        "{{name}}様、応募先（{{company}} - {{jobTitle}}）の選考状況が更新されました（{{status}}）。",
    },
    {
      key: "scout_received",
      subId: "Undangan Wawancara / Scout Baru Diterima",
      subJp: "スカウト・面接リクエストが届きました",
      bodyId:
        "Perusahaan {{company}} mengirimkan scout untuk posisi {{jobTitle}}. Pesan: {{message}}",
      bodyJp:
        "{{company}}よりスカウト（{{jobTitle}}）が届きました。メッセージ: {{message}}",
    },
  ];

  for (const t of templates) {
    await p.query(
      `INSERT INTO notification_templates (template_key, subject_id, subject_jp, body_id, body_jp)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE subject_id = VALUES(subject_id), body_id = VALUES(body_id)`,
      [t.key, t.subId, t.subJp, t.bodyId, t.bodyJp],
    );
  }

  // 10. Initial in-app notifications
  const sampleNotifs = [
    {
      user_id: adminUserId,
      template_key: "document_submitted",
      subject: "Dokumen Baru Menunggu Verifikasi",
      payload_json: JSON.stringify({
        userName: "Dewi Rahayu",
        title: "Sertifikat Pelatihan Manufaktur Presisi & Kaizen (5S)",
        type: "certificate",
      }),
    },
    {
      user_id: budiUserId,
      template_key: "scout_received",
      subject: "Undangan Wawancara dari Chubu Precision Machining",
      payload_json: JSON.stringify({
        company: "Chubu Precision Machining Co., Ltd.",
        jobTitle: "CNC Machining & Quality Control Specialist",
        message:
          "Kami mengundang Anda untuk wawancara daring tahap pertama minggu depan.",
      }),
    },
    {
      user_id: corporateUserId,
      template_key: "application_submitted",
      subject: "Lamaran Baru Diterima dari Dewi Rahayu",
      payload_json: JSON.stringify({
        name: "Dewi Rahayu",
        jobTitle: "Embedded Systems & Bridge Software Engineer",
      }),
    },
  ];

  for (const sn of sampleNotifs) {
    const [exist] = await p.query<mysql.RowDataPacket[]>(
      "SELECT id FROM notifications WHERE user_id = ? AND subject = ?",
      [sn.user_id, sn.subject],
    );
    if (exist.length === 0) {
      await p.query(
        `INSERT INTO notifications (user_id, channel, template_key, subject, payload_json, status)
         VALUES (?, 'in_app', ?, ?, ?, 'sent')`,
        [sn.user_id, sn.template_key, sn.subject, sn.payload_json],
      );
    }
  }

  console.log("[seeder] Inisialisasi data master platform demo JIJP selesai.");
}

async function runSeed(): Promise<void> {
  console.log("[seed] Memulai inisialisasi skema & seed database JIJP...");
  await initSchema();
  await seedInitialData(getPool());
}

const isMain = (() => {
  try {
    return import.meta.url === `file://${process.argv[1]}`;
  } catch {
    return false;
  }
})();

if (isMain) {
  runSeed()
    .then(async () => {
      console.log("[seed] Seed berhasil diselesaikan.");
      await closePool();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("[seed] Seed gagal:", err);
      await closePool();
      process.exit(1);
    });
}

export { runSeed };
