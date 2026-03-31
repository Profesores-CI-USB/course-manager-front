"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createSubjectAction,
  updateSubjectAction,
} from "@/app/actions/subject";
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
import type { SubjectOut } from "@/domain/entities/academic";

interface Props {
  initialData: SubjectOut[];
}

export default function SubjectsClient({ initialData }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectOut | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setError("");
    setOpen(true);
  }

  function openEdit(subject: SubjectOut) {
    setEditing(subject);
    setError("");
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      code: form.get("code") as string,
      name: form.get("name") as string,
      credits: Number(form.get("credits")),
    };

    startTransition(async () => {
      const result = editing
        ? await updateSubjectAction(editing.id, data)
        : await createSubjectAction(data);

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
        title="Materias"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nueva materia
          </button>
        }
      />

      <Container className="py-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Código
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Créditos
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
                    No hay materias registradas
                  </td>
                </tr>
              )}
              {initialData.map((subject) => (
                <tr
                  key={subject.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{subject.code}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{subject.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {subject.credits} crédito{subject.credits !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(subject)}
                      aria-label={`Editar materia ${subject.code}`}
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
              {editing ? "Editar materia" : "Nueva materia"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-code">Código</Label>
              <Input
                id="s-code"
                name="code"
                defaultValue={editing?.code ?? ""}
                placeholder="MAT-101"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-name">Nombre</Label>
              <Input
                id="s-name"
                name="name"
                defaultValue={editing?.name ?? ""}
                placeholder="Cálculo I"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-credits">Créditos</Label>
              <Input
                id="s-credits"
                name="credits"
                type="number"
                min={1}
                max={12}
                defaultValue={editing?.credits ?? 3}
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
