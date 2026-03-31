import type {
  CourseCreate,
  CourseListParams,
  CourseOut,
  CourseUpdate,
} from "@/domain/entities/academic";
import type { ICourseRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class CourseRepository implements ICourseRepository {
  async list(params: CourseListParams, token: string): Promise<CourseOut[]> {
    return apiClient.get<CourseOut[]>("/api/v1/academic/courses", token, params as Record<string, string | number | undefined>);
  }

  async create(data: CourseCreate, token: string): Promise<CourseOut> {
    return apiClient.post<CourseOut>("/api/v1/academic/courses", data, token);
  }

  async update(
    id: string,
    data: CourseUpdate,
    token: string,
  ): Promise<CourseOut> {
    return apiClient.put<CourseOut>(
      `/api/v1/academic/courses/${id}`,
      data,
      token,
    );
  }
}
