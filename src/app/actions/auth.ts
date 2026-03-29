"use server";

import { redirect } from "next/navigation";
import type { ChangePasswordRequest, RegisterRequest } from "@/domain/entities/auth";
import { AuthRepository } from "@/infrastructure/repositories/auth.repository";
import { clearSession, getAccessToken, getRefreshToken, setSession } from "@/lib/session";

const repo = new AuthRepository();

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult> {
  try {
    const response = await repo.login({ email, password });
    await setSession(
      response.tokens.access_token,
      response.tokens.refresh_token,
    );
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
  redirect("/");
}

export async function createUserAction(
  data: RegisterRequest,
): Promise<ActionResult> {
  const token = await getAccessToken();
  if (!token) return { success: false, error: "No autenticado" };
  try {
    await repo.register(data, token);
    return { success: true, data: undefined };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function logoutAction(): Promise<void> {
  const token = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (token && refreshToken) {
    try {
      await repo.logout(refreshToken, token);
    } catch {
      // proceed to clear session even if API call fails
    }
  }

  await clearSession();
  redirect("/login");
}

export async function forgotPasswordAction(
  email: string,
): Promise<ActionResult> {
  try {
    await repo.forgotPassword(email);
    return { success: true, data: undefined };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function resetPasswordAction(
  token: string,
  newPassword: string,
): Promise<ActionResult> {
  try {
    await repo.resetPassword(token, newPassword);
    return { success: true, data: undefined };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function changePasswordAction(
  data: ChangePasswordRequest,
): Promise<ActionResult> {
  const token = await getAccessToken();
  if (!token) return { success: false, error: "No autenticado" };
  try {
    await repo.changePassword(data, token);
    return { success: true, data: undefined };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
