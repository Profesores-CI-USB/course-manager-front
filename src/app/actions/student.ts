"use server";

import { revalidatePath } from "next/cache";
import type { StudentCreate, StudentOut, StudentUpdate } from "@/domain/entities/academic";
import { StudentRepository } from "@/infrastructure/repositories/student.repository";
import { getAccessToken } from "@/lib/session";
import type { ActionResult } from "./auth";

const repo = new StudentRepository();

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
    const student = await repo.create(data, token);
    revalidatePath("/students");
    return { success: true, data: student };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateStudentAction(
  id: string,
  data: StudentUpdate,
): Promise<ActionResult<StudentOut>> {
  try {
    const token = await requireToken();
    const student = await repo.update(id, data, token);
    revalidatePath("/students");
    return { success: true, data: student };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
