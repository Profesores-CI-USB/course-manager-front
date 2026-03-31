"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createGradeAction, updateGradeAction } from "@/app/actions/grade";
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
  EnrollmentOut,
  EvaluationGradeOut,
  EvaluationOut,
} from "@/domain/entities/academic";

interface Props {
  initialData: EvaluationGradeOut[];
  evaluations: EvaluationOut[];
  enrollments: EnrollmentOut[];
}

export default function GradesClient({
  initialData,
  evaluations,
  enrollments,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EvaluationGradeOut | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const evalMap = Object.fromEntries(evaluations.map((e) => [e.id, e]));

  function openCreate() {
    setEditing(null);
    setError("");
    setOpen(true);
  }

  function openEdit(grade: EvaluationGradeOut) {
    setEditing(grade);
    setError("");
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      evaluation_id: form.get("evaluation_id") as string,
      enrollment_id: form.get("enrollment_id") as string,
      grade: Number(form.get("grade")),
    };

    startTransition(async () => {
      const result = editing
        ? await updateGradeAction(editing.id, data)
        : await createGradeAction(data);

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
        title="Calificaciones"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nueva calificación
          </button>
        }
      />

      <Container className="py-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Evaluación
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Inscripción
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nota
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
                    No hay calificaciones registradas
                  </td>
                </tr>
              )}
              {initialData.map((grade) => (
                <tr
                  key={grade.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {evalMap[grade.evaluation_id]?.description ??
                        grade.evaluation_id}
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {evalMap[grade.evaluation_id]?.evaluation_type}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {grade.enrollment_id.substring(0, 8)}…
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        Number(grade.grade) >= 10 ? "success" : "destructive"
                      }
                    >
                      {grade.grade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(grade)}
                      aria-label={`Editar calificación ${grade.id}`}
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
              {editing ? "Editar calificación" : "Nueva calificación"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gr-eval">Evaluación</Label>
              <Select
                id="gr-eval"
                name="evaluation_id"
                defaultValue={editing?.evaluation_id ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona una evaluación
                </option>
                {evaluations.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.description} ({ev.evaluation_type})
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gr-enrollment">Inscripción</Label>
              <Select
                id="gr-enrollment"
                name="enrollment_id"
                defaultValue={editing?.enrollment_id ?? ""}
                required
              >
                <option value="" disabled>
                  Selecciona una inscripción
                </option>
                {enrollments.map((en) => (
                  <option key={en.id} value={en.id}>
                    {en.id.substring(0, 8)}…
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gr-grade">Nota</Label>
              <Input
                id="gr-grade"
                name="grade"
                type="number"
                step="0.01"
                min={0}
                max={20}
                defaultValue={editing?.grade ?? ""}
                placeholder="Ej: 14.5"
                required
              />
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
