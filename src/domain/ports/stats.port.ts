import type {
  AIModelConfigCreate,
  AIModelConfigOut,
  AIModelConfigUpdate,
  StatsResponse,
  TrainResult,
} from "@/domain/entities/stats";

export interface IStatsRepository {
  getCourseStats(token: string, courseId?: string): Promise<StatsResponse>;

  listModelConfigs(token: string): Promise<AIModelConfigOut[]>;
  createModelConfig(
    data: AIModelConfigCreate,
    token: string,
  ): Promise<AIModelConfigOut>;
  updateModelConfig(
    id: string,
    data: AIModelConfigUpdate,
    token: string,
  ): Promise<AIModelConfigOut>;
  deleteModelConfig(id: string, token: string): Promise<void>;
  trainModelConfig(id: string, token: string): Promise<TrainResult>;
}
