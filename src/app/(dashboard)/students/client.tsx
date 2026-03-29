"use client";

import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createStudentAction,
  updateStudentAction,
} from "@/app/actions/student";
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
import type { StudentOut } from "@/domain/entities/academic";

interface Props {
  initialData: StudentOut[];
}

export default function StudentsClient({ initialData }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudentOut | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setError("");
    setOpen(true);
  }

  function openEdit(student: StudentOut) {
    setEditing(student);
    setError("");
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const data = {
      full_name: form.get("full_name") as string,
      student_card: form.get("student_card") as string,
      email: email || undefined,
    };

    startTransition(async () => {
      const result = editing
        ? await updateStudentAction(editing.id, data)
        : await createStudentAction(data);

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
        title="Estudiantes"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nuevo estudiante
          </button>
        }
      />

      <Container className="py-6">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Carnet
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Correo
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
                    No hay estudiantes registrados
                  </td>
                </tr>
              )}
              {initialData.map((student) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {student.student_card}
                  </td>
                  <td className="px-4 py-3 font-medium">{student.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {student.email}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(student)}
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
              {editing ? "Editar estudiante" : "Nuevo estudiante"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="st-name">Nombre completo</Label>
              <Input
                id="st-name"
                name="full_name"
                defaultValue={editing?.full_name ?? ""}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="st-card">Carnet</Label>
              <Input
                id="st-card"
                name="student_card"
                defaultValue={editing?.student_card ?? ""}
                placeholder="20-12345"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="st-email">Correo electrónico</Label>
              <Input
                id="st-email"
                name="email"
                type="email"
                defaultValue={editing?.email ?? ""}
                placeholder="estudiante@ejemplo.com"
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
