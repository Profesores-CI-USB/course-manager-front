"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createEnrollmentAction,
  updateEnrollmentAction,
} from "@/app/actions/enrollment";
import Container from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type {
  CourseOut,
  EnrollmentOut,
  StudentOut,
} from "@/domain/entities/academic";

interface Props {
  initialData: EnrollmentOut[];
  courses: CourseOut[];
  students: StudentOut[];
}

export default function EnrollmentsClient({
  initialData,
  courses,
  students,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EnrollmentOut | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));
  const studentMap = Object.fromEntries(students.map((s) => [s.id, s]));

  function openCreate() {
    setEditing(null);
    setError("");
    setOpen(true);
  }

  function openEdit(enrollment: EnrollmentOut) {
    setEditing(enrollment);
    setError("");
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const finalGrade = form.get("final_grade") as string;

    const data = editing
      ? {
          course_id: form.get("course_id") as string,
          student_id: form.get("student_id") as string,
          final_grade: finalGrade || null,
        }
      : {
          course_id: form.get("course_id") as string,
          student_id: form.get("student_id") as string,
        };

    startTransition(async () => {
      const result = editing
        ? await updateEnrollmentAction(editing.id, data)
        : await createEnrollmentAction(data as { course_id: string; student_id: string });

      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <PageHeader
        title="Inscripciones"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nueva inscripción
          </button>
        }
      />

      <Container className="py-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Estudiante
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Curso
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nota final
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay inscripciones registradas
                  </td>
                </tr>
              )}
              {initialData.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {studentMap[enrollment.student_id]?.full_name ??
                        enrollment.student_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {studentMap[enrollment.student_id]?.student_card}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {courseMap[enrollment.course_id]
                      ? `${courseMap[enrollment.course_id].term}-${courseMap[enrollment.course_id].year}`
                      : enrollment.course_id}
                  </td>
                  <td className="px-4 py-3">
                    {enrollment.final_grade ? (
                      <Badge
                        variant={
                          Number(enrollment.final_grade) >= 10
                            ? "success"
                            : "destructive"
                        }
                      >
                        {enrollment.final_grade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(enrollment)}
                      aria-label={`Editar inscripción ${enrollment.id}`}
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar inscripción" : "Nueva inscripción"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="en-student">Estudiante</Label>
              <Select
                id="en-student"
                name="student_id"
                defaultValue={editing?.student_id ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona un estudiante
                </option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.student_card} — {s.full_name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="en-course">Curso</Label>
              <Select
                id="en-course"
                name="course_id"
                defaultValue={editing?.course_id ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona un curso
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.term}-{c.year}
                  </option>
                ))}
              </Select>
            </div>
            {editing && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="en-grade">Nota final (opcional)</Label>
                <Input
                  id="en-grade"
                  name="final_grade"
                  type="number"
                  step="0.01"
                  min={0}
                  max={20}
                  defaultValue={editing.final_grade ?? ""}
                  placeholder="Ej: 14.5"
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-md border border-border px-4 text-sm hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
