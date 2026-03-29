import type {
  CourseCreate,
  CourseOut,
  CourseUpdate,
  ListParams,
} from "@/domain/entities/academic";
import type { ICourseRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class CourseRepository implements ICourseRepository {
  async list(params: ListParams, token: string): Promise<CourseOut[]> {
    return apiClient.get<CourseOut[]>("/api/v1/academic/courses", token, params);
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
