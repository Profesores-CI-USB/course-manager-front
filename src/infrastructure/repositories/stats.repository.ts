import type {
  AIModelConfigCreate,
  AIModelConfigOut,
  AIModelConfigUpdate,
  StatsResponse,
  TrainResult,
} from "@/domain/entities/stats";
import type { IStatsRepository } from "@/domain/ports/stats.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class StatsRepository implements IStatsRepository {
  async getCourseStats(token: string, courseId?: string): Promise<StatsResponse> {
    const params = courseId ? { course_id: courseId } : undefined;
    return apiClient.get<StatsResponse>("/api/v1/stats/courses", token, params);
  }

  async listModelConfigs(token: string): Promise<AIModelConfigOut[]> {
    return apiClient.get<AIModelConfigOut[]>(
      "/api/v1/stats/ai-model-configs",
      token,
    );
  }

  async createModelConfig(
    data: AIModelConfigCreate,
    token: string,
  ): Promise<AIModelConfigOut> {
    return apiClient.post<AIModelConfigOut>(
      "/api/v1/stats/ai-model-configs",
      data,
      token,
    );
  }

  async updateModelConfig(
    id: string,
    data: AIModelConfigUpdate,
    token: string,
  ): Promise<AIModelConfigOut> {
    return apiClient.put<AIModelConfigOut>(
      `/api/v1/stats/ai-model-configs/${id}`,
      data,
      token,
    );
  }

  async deleteModelConfig(id: string, token: string): Promise<void> {
    return apiClient.delete<void>(
      `/api/v1/stats/ai-model-configs/${id}`,
      token,
    );
  }

  async trainModelConfig(id: string, token: string): Promise<TrainResult> {
    return apiClient.post<TrainResult>(
      `/api/v1/stats/ai-model-configs/${id}/train`,
      {},
      token,
    );
  }
}
