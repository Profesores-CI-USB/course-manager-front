"use server";

import { revalidatePath } from "next/cache";
import type { SubjectCreate, SubjectOut, SubjectUpdate } from "@/domain/entities/academic";
import { subjectRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

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
    const subject = await subjectRepo.create(data, token);
    revalidatePath("/subjects");
    return { success: true, data: subject };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateSubjectAction(
  id: string,
  data: SubjectUpdate,
): Promise<ActionResult<SubjectOut>> {
  try {
    const token = await requireToken();
    const subject = await subjectRepo.update(id, data, token);
    revalidatePath("/subjects");
    return { success: true, data: subject };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
