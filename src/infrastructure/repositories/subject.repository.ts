import type {
  SubjectCreate,
  SubjectListParams,
  SubjectOut,
  SubjectUpdate,
} from "@/domain/entities/academic";
import type { ISubjectRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class SubjectRepository implements ISubjectRepository {
  async list(params: SubjectListParams, token: string): Promise<SubjectOut[]> {
    return apiClient.get<SubjectOut[]>("/api/v1/academic/subjects", token, params as Record<string, string | number | undefined>);
  }

  async create(data: SubjectCreate, token: string): Promise<SubjectOut> {
    return apiClient.post<SubjectOut>("/api/v1/academic/subjects", data, token);
  }

  async update(
    id: string,
    data: SubjectUpdate,
    token: string,
  ): Promise<SubjectOut> {
    return apiClient.put<SubjectOut>(
      `/api/v1/academic/subjects/${id}`,
      data,
      token,
    );
  }
}
