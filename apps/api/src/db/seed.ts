import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

import { env } from "../config/env.js";
import { closePool } from "../db/pool.js";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
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
    INDEX idx_user (user_id),
    INDEX idx_status (verification_status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    UNIQUE KEY uniq_job_user_type (job_id, user_id, type),
    INDEX idx_user (user_id),
    INDEX idx_job (job_id),
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
];

export async function initSchema(): Promise<void> {
  await pool.query(`
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
      await pool.query(`ALTER TABLE users ADD COLUMN ${col} ${def}`);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== "ER_DUP_FIELDNAME") {
        console.warn(`users.${col}:`, (err as Error).message);
      }
    }
  }

  for (const sql of NEW_TABLES) {
    try {
      await pool.query(sql);
    } catch (err) {
      console.warn("CREATE TABLE err:", (err as Error).message);
    }
  }
}

async function runSeed(): Promise<void> {
  console.log("Memulai seeder database JIJP...");
  await initSchema();

  const passwordHash = await bcrypt.hash("password123", 10);

  const users: ReadonlyArray<Record<string, unknown>> = [
    {
      name: "Admin JIJP",
      email: "admin@jijp.id",
      role: "admin",
      title: "Lead Administrator",
      profile_verified: 1,
    },
  ];

  for (const u of users) {
    await pool.query(
      "INSERT IGNORE INTO users (name, email, password_hash, role, title, profile_verified) VALUES (?, ?, ?, ?, ?, ?)",
      [
        u.name,
        u.email,
        passwordHash,
        u.role,
        u.title ?? null,
        u.profile_verified ?? 0,
      ],
    );
  }
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
      console.log("Seed selesai.");
      await closePool();
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await closePool();
      await pool.end();
      process.exit(1);
    });
}

export { runSeed };
