"use server";

import { revalidatePath } from "next/cache";
import type {
  EvaluationGradeCreate,
  EvaluationGradeOut,
  EvaluationGradeUpdate,
} from "@/domain/entities/academic";
import { gradeRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function createGradeAction(
  data: EvaluationGradeCreate,
): Promise<ActionResult<EvaluationGradeOut>> {
  try {
    const token = await requireToken();
    const grade = await gradeRepo.create(data, token);
    revalidatePath("/grades");
    return { success: true, data: grade };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateGradeAction(
  id: string,
  data: EvaluationGradeUpdate,
): Promise<ActionResult<EvaluationGradeOut>> {
  try {
    const token = await requireToken();
    const grade = await gradeRepo.update(id, data, token);
    revalidatePath("/grades");
    return { success: true, data: grade };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
