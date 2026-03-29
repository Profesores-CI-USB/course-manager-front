import type {
  EvaluationGradeCreate,
  EvaluationGradeOut,
  EvaluationGradeUpdate,
  ListParams,
} from "@/domain/entities/academic";
import type { IEvaluationGradeRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class GradeRepository implements IEvaluationGradeRepository {
  async list(params: ListParams, token: string): Promise<EvaluationGradeOut[]> {
    return apiClient.get<EvaluationGradeOut[]>(
      "/api/v1/academic/evaluation-grades",
      token,
      params,
    );
  }

  async create(
    data: EvaluationGradeCreate,
    token: string,
  ): Promise<EvaluationGradeOut> {
    return apiClient.post<EvaluationGradeOut>(
      "/api/v1/academic/evaluation-grades",
      data,
      token,
    );
  }

  async update(
    id: string,
    data: EvaluationGradeUpdate,
    token: string,
  ): Promise<EvaluationGradeOut> {
    return apiClient.put<EvaluationGradeOut>(
      `/api/v1/academic/evaluation-grades/${id}`,
      data,
      token,
    );
  }
}
