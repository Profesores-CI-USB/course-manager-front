"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createEvaluationAction,
  updateEvaluationAction,
} from "@/app/actions/evaluation";
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
import type { CourseOut, EvaluationOut } from "@/domain/entities/academic";

interface Props {
  initialData: EvaluationOut[];
  courses: CourseOut[];
}

const EVALUATION_TYPES = [
  "examen",
  "tarea",
  "proyecto",
  "quiz",
  "laboratorio",
  "otro",
] as const;

export default function EvaluationsClient({ initialData, courses }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EvaluationOut | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));

  function openCreate() {
    setEditing(null);
    setError("");
    setOpen(true);
  }

  function openEdit(ev: EvaluationOut) {
    setEditing(ev);
    setError("");
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      course_id: form.get("course_id") as string,
      description: form.get("description") as string,
      percentage: Number(form.get("percentage")),
      evaluation_type: form.get("evaluation_type") as string,
      due_date: form.get("due_date") as string,
    };

    startTransition(async () => {
      const result = editing
        ? await updateEvaluationAction(editing.id, data)
        : await createEvaluationAction(data);

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
        title="Evaluaciones"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nueva evaluación
          </button>
        }
      />

      <Container className="py-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Porcentaje
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Fecha límite
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay evaluaciones registradas
                  </td>
                </tr>
              )}
              {initialData.map((ev) => (
                <tr
                  key={ev.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{ev.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {courseMap[ev.course_id]
                        ? `Curso ${courseMap[ev.course_id].term}-${courseMap[ev.course_id].year}`
                        : ev.course_id}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">
                      {ev.evaluation_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ev.percentage}%
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ev.due_date}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(ev)}
                      aria-label={`Editar evaluación ${ev.description}`}
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
              {editing ? "Editar evaluación" : "Nueva evaluación"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-course">Curso</Label>
              <Select
                id="ev-course"
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-desc">Descripción</Label>
              <Input
                id="ev-desc"
                name="description"
                defaultValue={editing?.description ?? ""}
                placeholder="Examen parcial 1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-type">Tipo</Label>
                <Select
                  id="ev-type"
                  name="evaluation_type"
                  defaultValue={editing?.evaluation_type ?? "examen"}
                >
                  {EVALUATION_TYPES.map((t) => (
                    <option key={t} value={t} className="capitalize">
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-pct">Porcentaje (%)</Label>
                <Input
                  id="ev-pct"
                  name="percentage"
                  type="number"
                  min={1}
                  max={100}
                  defaultValue={editing?.percentage ?? 20}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ev-date">Fecha límite</Label>
              <Input
                id="ev-date"
                name="due_date"
                type="date"
                defaultValue={editing?.due_date ?? ""}
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
