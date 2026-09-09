import expressMySqlSession from "express-mysql-session";
import session from "express-session";

import { env } from "../config/env.js";

const MySQLStore = expressMySqlSession(session);

export function createSessionStore(): session.Store {
  return new MySQLStore({
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }) as session.Store;
}
