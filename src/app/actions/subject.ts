"use server";

import { revalidatePath } from "next/cache";
import type { SubjectCreate, SubjectOut, SubjectUpdate } from "@/domain/entities/academic";
import { SubjectRepository } from "@/infrastructure/repositories/subject.repository";
import { getAccessToken } from "@/lib/session";
import type { ActionResult } from "./auth";

const repo = new SubjectRepository();

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function createSubjectAction(
  data: SubjectCreate,
): Promise<ActionResult<SubjectOut>> {
  try {
    const token = await requireToken();
    const subject = await repo.create(data, token);
    revalidatePath("/subjects");
    return { success: true, data: subject };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateSubjectAction(
  id: string,
  data: SubjectUpdate,
): Promise<ActionResult<SubjectOut>> {
  try {
    const token = await requireToken();
    const subject = await repo.update(id, data, token);
    revalidatePath("/subjects");
    return { success: true, data: subject };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
