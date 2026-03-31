// Subjects
export interface SubjectOut {
  id: string;
  code: string;
  name: string;
  credits: number;
}
export interface SubjectCreate {
  code: string;
  name: string;
  credits: number;
}
export type SubjectUpdate = SubjectCreate;

// Courses
export interface CourseOut {
  id: string;
  subject_id: string;
  professor_id: string;
  term: string;
  year: number;
}
export interface CourseCreate {
  subject_id: string;
  professor_id: string;
  term: string;
  year: number;
}
export type CourseUpdate = CourseCreate;

// Students
export interface StudentOut {
  id: string;
  full_name: string;
  student_card: string;
  email: string;
}
export interface StudentCreate {
  full_name: string;
  student_card: string;
  email?: string;
}
export interface StudentUpdate {
  full_name: string;
  student_card: string;
  email?: string;
}

// Evaluations
export interface EvaluationOut {
  id: string;
  course_id: string;
  description: string;
  percentage: string;
  evaluation_type: string;
  due_date: string;
}
export interface EvaluationCreate {
  course_id: string;
  description: string;
  percentage: number;
  evaluation_type: string;
  due_date: string;
}
export interface EvaluationUpdate {
  course_id: string;
  description: string;
  percentage: number;
  evaluation_type: string;
  due_date: string;
}

// Enrollments
export interface EnrollmentOut {
  id: string;
  course_id: string;
  student_id: string;
  final_grade: string | null;
}
export interface EnrollmentCreate {
  course_id: string;
  student_id: string;
}
export interface EnrollmentUpdate {
  course_id: string;
  student_id: string;
  final_grade?: string | null;
}

// Evaluation Grades
export interface EvaluationGradeOut {
  id: string;
  evaluation_id: string;
  enrollment_id: string;
  grade: string;
}
export interface EvaluationGradeCreate {
  evaluation_id: string;
  enrollment_id: string;
  grade: number;
}
export interface EvaluationGradeUpdate {
  evaluation_id: string;
  enrollment_id: string;
  grade: number;
}

// Shared
export interface ListParams {
  limit?: number;
  offset?: number;
  order_by?: string;
  order_dir?: "asc" | "desc";
}

export interface SubjectListParams extends ListParams {
  code?: string;
  name?: string;
}

export interface CourseListParams extends ListParams {
  subject_id?: string;
  term?: string;
  year?: number;
  professor_id?: string;
}

export interface StudentListParams extends ListParams {
  course_id?: string;
  student_card?: string;
  email?: string;
  full_name?: string;
}

export interface EvaluationListParams extends ListParams {
  course_id?: string;
  evaluation_type?: string;
  due_date_from?: string;
  due_date_to?: string;
}

export interface EnrollmentListParams extends ListParams {
  course_id?: string;
  student_id?: string;
}

export interface GradeListParams extends ListParams {
  course_id?: string;
  evaluation_id?: string;
  enrollment_id?: string;
  student_id?: string;
}
