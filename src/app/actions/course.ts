"use server";

import { revalidatePath } from "next/cache";
import type { CourseCreate, CourseOut, CourseUpdate } from "@/domain/entities/academic";
import { CourseRepository } from "@/infrastructure/repositories/course.repository";
import { getAccessToken } from "@/lib/session";
import type { ActionResult } from "./auth";

const repo = new CourseRepository();

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
    const course = await repo.create(data, token);
    revalidatePath("/courses");
    return { success: true, data: course };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateCourseAction(
  id: string,
  data: CourseUpdate,
): Promise<ActionResult<CourseOut>> {
  try {
    const token = await requireToken();
    const course = await repo.update(id, data, token);
    revalidatePath("/courses");
    return { success: true, data: course };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
