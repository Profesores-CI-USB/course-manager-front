import { AuthRepository, UserRepository } from "./repositories/auth.repository";
import { CourseRepository } from "./repositories/course.repository";
import { EnrollmentRepository } from "./repositories/enrollment.repository";
import { EvaluationRepository } from "./repositories/evaluation.repository";
import { GradeRepository } from "./repositories/grade.repository";
import { StatsRepository } from "./repositories/stats.repository";
import { StudentRepository } from "./repositories/student.repository";
import { SubjectRepository } from "./repositories/subject.repository";

export const authRepo = new AuthRepository();
export const userRepo = new UserRepository();
export const courseRepo = new CourseRepository();
export const enrollmentRepo = new EnrollmentRepository();
export const evaluationRepo = new EvaluationRepository();
export const gradeRepo = new GradeRepository();
export const statsRepo = new StatsRepository();
export const studentRepo = new StudentRepository();
export const subjectRepo = new SubjectRepository();
