import type { StatsResponse } from "@/domain/entities/stats";
import type { IStatsRepository } from "@/domain/ports/stats.port";
import { apiClient } from "@/infrastructure/http/api-client";

export class StatsRepository implements IStatsRepository {
  async getCourseStats(token: string, courseId?: string): Promise<StatsResponse> {
    const params = courseId ? { course_id: courseId } : undefined;
    return apiClient.get<StatsResponse>("/api/v1/stats/courses", token, params);
  }
}
