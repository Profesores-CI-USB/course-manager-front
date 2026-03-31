import type {
  StudentCreate,
  StudentListParams,
  StudentOut,
  StudentUpdate,
} from "@/domain/entities/academic";
import type { IStudentRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class StudentRepository implements IStudentRepository {
  async list(params: StudentListParams, token: string): Promise<StudentOut[]> {
    return apiClient.get<StudentOut[]>("/api/v1/academic/students", token, params as Record<string, string | number | undefined>);
  }

  async create(data: StudentCreate, token: string): Promise<StudentOut> {
    return apiClient.post<StudentOut>("/api/v1/academic/students", data, token);
  }

  async update(
    id: string,
    data: StudentUpdate,
    token: string,
  ): Promise<StudentOut> {
    return apiClient.put<StudentOut>(
      `/api/v1/academic/students/${id}`,
      data,
      token,
    );
  }
}
