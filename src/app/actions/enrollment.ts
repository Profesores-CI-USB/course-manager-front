"use server";

import { revalidatePath } from "next/cache";
import type {
  EnrollmentCreate,
  EnrollmentOut,
  EnrollmentUpdate,
} from "@/domain/entities/academic";
import { enrollmentRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function createEnrollmentAction(
  data: EnrollmentCreate,
): Promise<ActionResult<EnrollmentOut>> {
  try {
    const token = await requireToken();
    const enrollment = await enrollmentRepo.create(data, token);
    revalidatePath("/enrollments");
    return { success: true, data: enrollment };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateEnrollmentAction(
  id: string,
  data: EnrollmentUpdate,
): Promise<ActionResult<EnrollmentOut>> {
  try {
    const token = await requireToken();
    const enrollment = await enrollmentRepo.update(id, data, token);
    revalidatePath("/enrollments");
    return { success: true, data: enrollment };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function bulkCsvEnrollmentAction(
  courseId: string,
  file: File,
): Promise<{ success: boolean; data?: { enrolled: number }; error?: string }> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, error: "No autenticado" };
    const result = await enrollmentRepo.bulkCsv(courseId, file, token);
    revalidatePath("/enrollments");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
