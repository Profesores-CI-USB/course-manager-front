"use server";

import { revalidatePath } from "next/cache";
import type { SmtpCredentialsUpdate, UserSmtpOut } from "@/domain/entities/auth";
import { userRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function updateSmtpAction(
  data: SmtpCredentialsUpdate,
): Promise<ActionResult<UserSmtpOut>> {
  try {
    const token = await requireToken();
    const smtp = await userRepo.updateSmtp(data, token);
    revalidatePath("/profile");
    return { success: true, data: smtp };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
