"use server";

import { revalidatePath } from "next/cache";
import type {
  EvaluationCreate,
  EvaluationOut,
  EvaluationUpdate,
} from "@/domain/entities/academic";
import { evaluationRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

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
    const evaluation = await evaluationRepo.create(data, token);
    revalidatePath("/evaluations");
    return { success: true, data: evaluation };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateEvaluationAction(
  id: string,
  data: EvaluationUpdate,
): Promise<ActionResult<EvaluationOut>> {
  try {
    const token = await requireToken();
    const evaluation = await evaluationRepo.update(id, data, token);
    revalidatePath("/evaluations");
    return { success: true, data: evaluation };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
