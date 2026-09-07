import crypto from "node:crypto";

import axios from "axios";
import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../config/env.js";
import {
  countUnread,
  findByUser,
  findTemplate,
  insertInApp,
  markRead,
  type NotificationRow,
} from "../repositories/notifications.repository.js";
import { findAdmins, type UserRow } from "../repositories/users.repository.js";
import { getPool } from "../db/pool.js";

let mailer: Transporter | null | undefined;
function getMailer(): Transporter | null {
  if (mailer !== undefined) return mailer;
  if (!env.SMTP_HOST) {
    mailer = null;
    return null;
  }
  mailer = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER
      ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? "" }
      : undefined,
  });
  return mailer;
}

export interface NotifyInput {
  userId: number;
  templateKey: string;
  vars?: Record<string, unknown>;
  channel?: "in_app" | "email" | "webhook";
}

export async function notifyUser(input: NotifyInput): Promise<void> {
  try {
    const template = await findTemplate(input.templateKey);
    let subject = input.templateKey;
    let body = JSON.stringify(input.vars ?? {});

    if (template) {
      subject = template.subject_id;
      body = template.body_id.replace(/\{\{(\w+)\}\}/g, (_m, k: string) =>
        input.vars && input.vars[k] != null ? String(input.vars[k]) : "",
      );
    }

    const [rows] = await getPool().query<UserRow[]>(
      "SELECT * FROM users WHERE id = ?",
      [input.userId],
    );
    const user = rows[0];

    await insertInApp({
      userId: input.userId,
      templateKey: input.templateKey,
      payloadJson: JSON.stringify({ ...(input.vars ?? {}), body }),
      subject,
    });

    if (input.channel === "email" && user?.email) {
      const m = getMailer();
      if (m) {
        await m.sendMail({
          from: env.MAIL_FROM ?? "JIJP <noreply@jijp.id>",
          to: user.email,
          subject,
          text: body,
        });
      }
    }

    if (env.WEBHOOK_URL) {
      const payload = {
        userId: input.userId,
        templateKey: input.templateKey,
        vars: input.vars ?? {},
        timestamp: new Date().toISOString(),
      };
      const bodyStr = JSON.stringify(payload);
      const sig = crypto
        .createHmac("sha256", env.WEBHOOK_SECRET ?? "")
        .update(bodyStr)
        .digest("hex");
      axios
        .post(env.WEBHOOK_URL, payload, {
          headers: {
            "Content-Type": "application/json",
            "X-JIJP-Signature": sig,
          },
          timeout: 3000,
        })
        .catch((e: Error) => {
          console.warn("[webhook error]", e.message);
        });
    }
  } catch (err) {
    console.warn("[notify error]", (err as Error).message);
  }
}

export async function notifyAdminsDocumentSubmitted(input: {
  userName: string;
  title: string;
  type: string;
}): Promise<void> {
  try {
    const admins = await findAdmins();
    for (const adm of admins) {
      await notifyUser({
        userId: adm.id,
        templateKey: "document_submitted",
        vars: { name: input.userName, title: input.title, type: input.type },
      });
    }
  } catch (err) {
    console.error("Failed to notify admins of document upload:", err);
  }
}

export async function listMine(userId: number): Promise<{
  rows: NotificationRow[];
  unread: number;
}> {
  const rows = await findByUser(userId);
  const unread = await countUnread(rows);
  return { rows, unread };
}

export async function markAsRead(id: number, userId: number): Promise<void> {
  await markRead(id, userId);
}
