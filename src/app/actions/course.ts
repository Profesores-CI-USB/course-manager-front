"use server";

import { revalidatePath } from "next/cache";
import type { CourseCreate, CourseOut, CourseUpdate } from "@/domain/entities/academic";
import { courseRepo } from "@/infrastructure/container";
import { getAccessToken } from "@/lib/session";
import { toErrorMessage } from "@/lib/utils";
import type { ActionResult } from "./auth";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function createCourseAction(
  data: CourseCreate,
): Promise<ActionResult<CourseOut>> {
  try {
    const token = await requireToken();
    const course = await courseRepo.create(data, token);
    revalidatePath("/courses");
    return { success: true, data: course };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}

export async function updateCourseAction(
  id: string,
  data: CourseUpdate,
): Promise<ActionResult<CourseOut>> {
  try {
    const token = await requireToken();
    const course = await courseRepo.update(id, data, token);
    revalidatePath("/courses");
    return { success: true, data: course };
  } catch (e) {
    return { success: false, error: toErrorMessage(e) };
  }
}
