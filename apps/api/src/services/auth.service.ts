import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRole } from "@jijp/types";

import { env } from "../config/env.js";
import { badRequest, conflict, unauthorized } from "../lib/errors.js";
import {
  emailExists,
  findByEmail,
  findByIceUuidOrEmail,
  findById,
  insertUser,
  type UserRow,
  updateIceUuid,
} from "../repositories/users.repository.js";

export interface SsoValidateResponse {
  valid: boolean;
  user_id?: string | number | undefined;
  email?: string | undefined;
  name?: string | undefined;
  reason?: string | undefined;
}

export async function registerLocal(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<{ id: number; name: string; email: string; role: UserRole }> {
  if (await emailExists(input.email)) {
    throw conflict("Email sudah terdaftar.");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  const id = await insertUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
  });
  return { id, name: input.name, email: input.email, role: input.role };
}

export async function loginLocal(
  email: string,
  password: string,
): Promise<UserRow> {
  const user = await findByEmail(email);
  if (!user) throw unauthorized("Email atau password salah.");
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw unauthorized("Email atau password salah.");
  return user;
}

export interface SsoResult {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export async function validateSsoToken(token: string): Promise<SsoResult> {
  if (!env.SSO_PROVIDER_URL) {
    throw badRequest(
      "SSO belum dikonfigurasi. Set SSO_PROVIDER_URL di environment.",
      "SSO_NOT_CONFIGURED",
    );
  }

  let validated: SsoValidateResponse;
  try {
    if (env.SSO_JWT_PUBLIC_KEY) {
      const decoded = jwt.verify(token, env.SSO_JWT_PUBLIC_KEY, {
        algorithms: ["RS256"],
      }) as Record<string, unknown>;
      validated = {
        valid: true,
        user_id: String(decoded.sub ?? ""),
        email: typeof decoded.email === "string" ? decoded.email : undefined,
        name: typeof decoded.name === "string" ? decoded.name : undefined,
      };
    } else {
      const response = await axios.post<SsoValidateResponse>(
        env.SSO_PROVIDER_URL,
        `token=${encodeURIComponent(token)}`,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 5000,
        },
      );
      validated = response.data;
    }
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? `SSO upstream error: ${error.message}`
      : "SSO validation failed";
    throw unauthorized(message);
  }

  if (!validated.valid || !validated.email || !validated.name) {
    throw unauthorized(`Token tidak valid: ${validated.reason ?? ""}`.trim());
  }

  const externalId = validated.user_id ? String(validated.user_id) : "";
  const email = validated.email;
  const name = validated.name;

  const existing = await findByIceUuidOrEmail(externalId, email);
  let userId: number;
  let role: UserRole = "student";

  if (existing) {
    userId = existing.id;
    role = existing.role;
    if (!existing.ice_uuid && externalId) {
      await updateIceUuid(existing.id, externalId);
    }
  } else {
    const dummyPassword = await bcrypt.hash(Math.random().toString(), 10);
    userId = await insertUser({
      name,
      email,
      passwordHash: dummyPassword,
      role: "student",
      iceUuid: externalId || null,
    });
  }

  return { id: userId, name, email, role };
}

export async function getMe(id: number): Promise<UserRow> {
  const user = await findById(id);
  if (!user) throw unauthorized("User tidak ditemukan");
  return user;
}
