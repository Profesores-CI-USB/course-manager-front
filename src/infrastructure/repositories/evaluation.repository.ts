import type {
  EvaluationCreate,
  EvaluationListParams,
  EvaluationOut,
  EvaluationUpdate,
} from "@/domain/entities/academic";
import type { IEvaluationRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class EvaluationRepository implements IEvaluationRepository {
  async list(params: EvaluationListParams, token: string): Promise<EvaluationOut[]> {
    return apiClient.get<EvaluationOut[]>(
      "/api/v1/academic/evaluations",
      token,
      params as Record<string, string | number | undefined>,
    );
  }

  async create(data: EvaluationCreate, token: string): Promise<EvaluationOut> {
    return apiClient.post<EvaluationOut>(
      "/api/v1/academic/evaluations",
      data,
      token,
    );
  }

  async update(
    id: string,
    data: EvaluationUpdate,
    token: string,
  ): Promise<EvaluationOut> {
    return apiClient.put<EvaluationOut>(
      `/api/v1/academic/evaluations/${id}`,
      data,
      token,
    );
  }
}
