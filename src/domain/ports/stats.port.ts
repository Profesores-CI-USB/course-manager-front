import type { StatsResponse } from "@/domain/entities/stats";

export interface IStatsRepository {
  getCourseStats(token: string, courseId?: string): Promise<StatsResponse>;
}
