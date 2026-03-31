"use server";

import { revalidatePath } from "next/cache";
import type { StudentCreate, StudentOut, StudentUpdate } from "@/domain/entities/academic";
import { studentRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function createStudentAction(
  data: StudentCreate,
): Promise<ActionResult<StudentOut>> {
  try {
    const token = await requireToken();
    const student = await studentRepo.create(data, token);
    revalidatePath("/students");
    return { success: true, data: student };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateStudentAction(
  id: string,
  data: StudentUpdate,
): Promise<ActionResult<StudentOut>> {
  try {
    const token = await requireToken();
    const student = await studentRepo.update(id, data, token);
    revalidatePath("/students");
    return { success: true, data: student };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
