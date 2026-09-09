import cors from "cors";
import express, { type Express } from "express";
import session from "express-session";
import helmet from "helmet";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";
import { jsonSanitizer } from "./middleware/sanitize.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import { requireAuth } from "./middleware/auth.js";
import { httpLogger } from "./lib/logger.js";
import { createSessionStore } from "./lib/sessionStore.js";
import { docsRouter, spec } from "./routes/docs.js";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { documentsRouter } from "./routes/documents.js";
import {
  documentsActionsRouter,
  documentsUploadRouter,
} from "./routes/documents.actions.js";
import { companiesRouter } from "./routes/companies.js";
import { applicationsRouter, jobsRouter, scoutRouter } from "./routes/jobs.js";
import { cvRouter } from "./routes/cv.js";
import { adminRouter } from "./routes/admin.js";
import { calendarRouter } from "./routes/calendar.js";
import { coursesRouter } from "./routes/courses.js";
import { notificationsRouter } from "./routes/notifications.js";
import { candidatesRouter } from "./routes/candidates.js";

const origins = env.CORS_ORIGINS.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function createServer(): Express {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origins.length === 0 || origins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Akses diblokir oleh kebijakan CORS"));
      },
      credentials: true,
    }),
  );

  const sessionStore = createSessionStore();

  app.use(
    session({
      store: sessionStore,
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        maxAge: 7 * 24 * 3600 * 1000,
      },
    }),
  );

  app.use(httpLogger);
  app.use(jsonSanitizer);
  app.use(globalLimiter);

  app.get("/", (_req, res) => {
    res.json({ success: true, data: { message: "JIJP API is running." } });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/docs", docsRouter);
  app.use("/api/docs.json", (_req, res) => res.json(spec));

  app.use("/api/auth", authRouter);

  app.use("/api/users", usersRouter);

  app.use("/api/candidates", candidatesRouter);

  app.use("/api/companies", companiesRouter);
  app.use("/api/jobs/companies", companiesRouter);

  app.use("/api/jobs", jobsRouter);
  app.use("/api/scout", scoutRouter);
  app.use("/api/applications", applicationsRouter);

  app.use("/api/documents/mine", documentsRouter);
  app.use("/api/documents", documentsUploadRouter);
  app.use("/api/documents", documentsActionsRouter);

  app.use("/api/cv", requireAuth, cvRouter);

  app.use("/api/calendar", calendarRouter);

  app.use("/api/courses", coursesRouter);

  app.use("/api/notifications", notificationsRouter);

  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
