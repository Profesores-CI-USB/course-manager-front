"use server";

import { revalidatePath } from "next/cache";
import type {
  AIModelConfigCreate,
  AIModelConfigOut,
  AIModelConfigUpdate,
  TrainResult,
} from "@/domain/entities/stats";
import { statsRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function listModelConfigsAction(): Promise<
  ActionResult<AIModelConfigOut[]>
> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, error: "No autenticado" };
    const data = await statsRepo.listModelConfigs(token);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function createModelConfigAction(
  data: AIModelConfigCreate,
): Promise<ActionResult<AIModelConfigOut>> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, error: "No autenticado" };
    const result = await statsRepo.createModelConfig(data, token);
    revalidatePath("/ai-models");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateModelConfigAction(
  id: string,
  data: AIModelConfigUpdate,
): Promise<ActionResult<AIModelConfigOut>> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, error: "No autenticado" };
    const result = await statsRepo.updateModelConfig(id, data, token);
    revalidatePath("/ai-models");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function deleteModelConfigAction(
  id: string,
): Promise<ActionResult> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, error: "No autenticado" };
    await statsRepo.deleteModelConfig(id, token);
    revalidatePath("/ai-models");
    return { success: true, data: undefined };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function trainModelConfigAction(
  id: string,
): Promise<ActionResult<TrainResult>> {
  try {
    const token = await getAccessToken();
    if (!token) return { success: false, error: "No autenticado" };
    const result = await statsRepo.trainModelConfig(id, token);
    revalidatePath("/ai-models");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
