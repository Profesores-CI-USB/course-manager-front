import type {
  CourseCreate,
  CourseListParams,
  CourseOut,
  CourseUpdate,
  EnrollmentCreate,
  EnrollmentListParams,
  EnrollmentOut,
  EnrollmentUpdate,
  EvaluationCreate,
  EvaluationGradeCreate,
  EvaluationGradeOut,
  EvaluationGradeUpdate,
  EvaluationListParams,
  EvaluationOut,
  EvaluationUpdate,
  GradeListParams,
  StudentCreate,
  StudentListParams,
  StudentOut,
  StudentUpdate,
  SubjectCreate,
  SubjectListParams,
  SubjectOut,
  SubjectUpdate,
} from "@/domain/entities/academic";

export interface ISubjectRepository {
  list(params: SubjectListParams, token: string): Promise<SubjectOut[]>;
  create(data: SubjectCreate, token: string): Promise<SubjectOut>;
  update(id: string, data: SubjectUpdate, token: string): Promise<SubjectOut>;
}

export interface ICourseRepository {
  list(params: CourseListParams, token: string): Promise<CourseOut[]>;
  create(data: CourseCreate, token: string): Promise<CourseOut>;
  update(id: string, data: CourseUpdate, token: string): Promise<CourseOut>;
}

export interface IStudentRepository {
  list(params: StudentListParams, token: string): Promise<StudentOut[]>;
  create(data: StudentCreate, token: string): Promise<StudentOut>;
  update(id: string, data: StudentUpdate, token: string): Promise<StudentOut>;
}

export interface IEvaluationRepository {
  list(params: EvaluationListParams, token: string): Promise<EvaluationOut[]>;
  create(data: EvaluationCreate, token: string): Promise<EvaluationOut>;
  update(
    id: string,
    data: EvaluationUpdate,
    token: string,
  ): Promise<EvaluationOut>;
}

export interface IEnrollmentRepository {
  list(params: EnrollmentListParams, token: string): Promise<EnrollmentOut[]>;
  create(data: EnrollmentCreate, token: string): Promise<EnrollmentOut>;
  update(
    id: string,
    data: EnrollmentUpdate,
    token: string,
  ): Promise<EnrollmentOut>;
  bulkCsv(
    courseId: string,
    file: File,
    token: string,
  ): Promise<{ enrolled: number }>;
}

export interface IEvaluationGradeRepository {
  list(params: GradeListParams, token: string): Promise<EvaluationGradeOut[]>;
  create(
    data: EvaluationGradeCreate,
    token: string,
  ): Promise<EvaluationGradeOut>;
  update(
    id: string,
    data: EvaluationGradeUpdate,
    token: string,
  ): Promise<EvaluationGradeOut>;
}
