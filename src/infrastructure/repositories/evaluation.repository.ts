import type {
  EvaluationCreate,
  EvaluationOut,
  EvaluationUpdate,
  ListParams,
} from "@/domain/entities/academic";
import type { IEvaluationRepository } from "@/domain/ports/academic.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class EvaluationRepository implements IEvaluationRepository {
  async list(params: ListParams, token: string): Promise<EvaluationOut[]> {
    return apiClient.get<EvaluationOut[]>(
      "/api/v1/academic/evaluations",
      token,
      params,
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
