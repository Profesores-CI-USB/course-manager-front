"use server";

import { revalidatePath } from "next/cache";
import type {
  EvaluationGradeCreate,
  EvaluationGradeOut,
  EvaluationGradeUpdate,
} from "@/domain/entities/academic";
import { GradeRepository } from "@/infrastructure/repositories/grade.repository";
import { getAccessToken } from "@/lib/session";
import type { ActionResult } from "./auth";

const repo = new GradeRepository();

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
    const grade = await repo.create(data, token);
    revalidatePath("/grades");
    return { success: true, data: grade };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateGradeAction(
  id: string,
  data: EvaluationGradeUpdate,
): Promise<ActionResult<EvaluationGradeOut>> {
  try {
    const token = await requireToken();
    const grade = await repo.update(id, data, token);
    revalidatePath("/grades");
    return { success: true, data: grade };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
