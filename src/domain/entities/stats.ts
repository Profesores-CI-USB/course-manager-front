export interface GradeDistribution {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
  pending: number;
}

export interface StatsSummary {
  total_courses: number;
  total_enrolled: number;
  graded_students: number;
  pending_students: number;
  global_avg_grade: number | null;
  global_avg_scale_grade: number | null;
  global_pass_rate: number | null;
  overall_grade_distribution: GradeDistribution;
}

export interface CourseEvaluationStats {
  total: number;
  fully_graded: number;
  completion_rate: number;
}

export interface CourseStats {
  course_id: string;
  subject_code: string;
  subject_name: string;
  term: string;
  year: number;
  professor_id: string;
  total_enrolled: number;
  graded_count: number;
  avg_final_grade: number | null;
  avg_scale_grade: number | null;
  pass_rate: number | null;
  grade_distribution: GradeDistribution;
  evaluations: CourseEvaluationStats;
}

export interface StatsResponse {
  summary: StatsSummary;
  courses: CourseStats[];
}
