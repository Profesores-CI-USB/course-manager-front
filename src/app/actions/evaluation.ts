"use server";

import { revalidatePath } from "next/cache";
import type {
  EvaluationCreate,
  EvaluationOut,
  EvaluationUpdate,
} from "@/domain/entities/academic";
import { EvaluationRepository } from "@/infrastructure/repositories/evaluation.repository";
import { getAccessToken } from "@/lib/session";
import type { ActionResult } from "./auth";

const repo = new EvaluationRepository();

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function createEvaluationAction(
  data: EvaluationCreate,
): Promise<ActionResult<EvaluationOut>> {
  try {
    const token = await requireToken();
    const evaluation = await repo.create(data, token);
    revalidatePath("/evaluations");
    return { success: true, data: evaluation };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateEvaluationAction(
  id: string,
  data: EvaluationUpdate,
): Promise<ActionResult<EvaluationOut>> {
  try {
    const token = await requireToken();
    const evaluation = await repo.update(id, data, token);
    revalidatePath("/evaluations");
    return { success: true, data: evaluation };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
