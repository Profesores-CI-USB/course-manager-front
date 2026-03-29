"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createCourseAction, updateCourseAction } from "@/app/actions/course";
import Container from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { CourseOut, SubjectOut } from "@/domain/entities/academic";

interface Props {
  initialData: CourseOut[];
  subjects: SubjectOut[];
}

const TERMS = ["1", "2", "V"] as const;

export default function CoursesClient({ initialData, subjects }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CourseOut | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s]));

  function openCreate() {
    setEditing(null);
    setError("");
    setOpen(true);
  }

  function openEdit(course: CourseOut) {
    setEditing(course);
    setError("");
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      subject_id: form.get("subject_id") as string,
      professor_id: form.get("professor_id") as string,
      term: form.get("term") as string,
      year: Number(form.get("year")),
    };

    startTransition(async () => {
      const result = editing
        ? await updateCourseAction(editing.id, data)
        : await createCourseAction(data);

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
        title="Cursos"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nuevo curso
          </button>
        }
      />

      <Container className="py-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Materia
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Período
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Año
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
                    No hay cursos registrados
                  </td>
                </tr>
              )}
              {initialData.map((course) => (
                <tr
                  key={course.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">
                    {subjectMap[course.subject_id]?.name ?? course.subject_id}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({subjectMap[course.subject_id]?.code})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Trimestre {course.term}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {course.year}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(course)}
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
              {editing ? "Editar curso" : "Nuevo curso"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-subject">Materia</Label>
              <Select
                id="c-subject"
                name="subject_id"
                defaultValue={editing?.subject_id ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona una materia
                </option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-professor">ID del profesor</Label>
              <Input
                id="c-professor"
                name="professor_id"
                defaultValue={editing?.professor_id ?? ""}
                placeholder="UUID del profesor"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-term">Período</Label>
                <Select
                  id="c-term"
                  name="term"
                  defaultValue={editing?.term ?? "1"}
                >
                  {TERMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-year">Año</Label>
                <Input
                  id="c-year"
                  name="year"
                  type="number"
                  min={2000}
                  max={2100}
                  defaultValue={editing?.year ?? new Date().getFullYear()}
                  required
                />
              </div>
            </div>
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
