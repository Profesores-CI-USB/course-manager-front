import type {
  EnrollmentCreate,
  EnrollmentOut,
  EnrollmentUpdate,
  ListParams,
} from "@/domain/entities/academic";
import type { IEnrollmentRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class EnrollmentRepository implements IEnrollmentRepository {
  async list(params: ListParams, token: string): Promise<EnrollmentOut[]> {
    return apiClient.get<EnrollmentOut[]>(
      "/api/v1/academic/enrollments",
      token,
      params,
    );
  }

  async create(data: EnrollmentCreate, token: string): Promise<EnrollmentOut> {
    return apiClient.post<EnrollmentOut>(
      "/api/v1/academic/enrollments",
      data,
      token,
    );
  }

  async update(
    id: string,
    data: EnrollmentUpdate,
    token: string,
  ): Promise<EnrollmentOut> {
    return apiClient.put<EnrollmentOut>(
      `/api/v1/academic/enrollments/${id}`,
      data,
      token,
    );
  }

  async bulkCsv(
    courseId: string,
    file: File,
    token: string,
  ): Promise<{ enrolled: number }> {
    const form = new FormData();
    form.append("course_id", courseId);
    form.append("file", file);
    return apiClient.postForm("/api/v1/academic/enrollments/bulk-csv", form, token);
  }
}
