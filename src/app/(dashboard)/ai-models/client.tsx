"use client";

import { Brain, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createModelConfigAction,
  deleteModelConfigAction,
  trainModelConfigAction,
  updateModelConfigAction,
} from "@/app/actions/ai-model";
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
import type { AIModelConfigOut, ModelTarget, ModelType } from "@/domain/entities/stats";

const MODEL_TYPES: { value: ModelType; label: string }[] = [
  { value: "linear", label: "Regresión lineal" },
  { value: "dense_nn", label: "Red neuronal densa" },
];

const MODEL_TARGETS: { value: ModelTarget; label: string }[] = [
  { value: "final_grade", label: "Nota final" },
  { value: "pass_probability", label: "Probabilidad de aprobación" },
];

interface Props {
  initialData: AIModelConfigOut[];
}

export default function AIModelsClient({ initialData }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AIModelConfigOut | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<ModelType>("linear");

  function openCreate() {
    setEditing(null);
    setError("");
    setSelectedType("linear");
    setOpen(true);
  }

  function openEdit(model: AIModelConfigOut) {
    setEditing(model);
    setError("");
    setSelectedType(model.model_type);
    setOpen(true);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const hyperparams = {
      max_features: Number(form.get("max_features")) || undefined,
      epochs: Number(form.get("epochs")) || undefined,
      learning_rate: Number(form.get("learning_rate")) || undefined,
      ...(selectedType === "dense_nn"
        ? {
            hidden_units: (form.get("hidden_units") as string)
              .split(",")
              .map((v) => Number(v.trim()))
              .filter(Boolean),
          }
        : {}),
    };

    startTransition(async () => {
      if (editing) {
        const result = await updateModelConfigAction(editing.id, {
          name: form.get("name") as string,
          description: (form.get("description") as string) || undefined,
          hyperparams,
        });
        if (result.success) {
          setOpen(false);
          router.refresh();
        } else {
          setError(result.error);
        }
      } else {
        const result = await createModelConfigAction({
          name: form.get("name") as string,
          description: (form.get("description") as string) || undefined,
          model_type: form.get("model_type") as ModelType,
          target: form.get("target") as ModelTarget,
          hyperparams,
        });
        if (result.success) {
          setOpen(false);
          router.refresh();
        } else {
          setError(result.error);
        }
      }
    });
  }

  function handleDelete(model: AIModelConfigOut) {
    if (!confirm(`¿Eliminar el modelo "${model.name}"? Esta acción no se puede deshacer.`))
      return;
    startTransition(async () => {
      const result = await deleteModelConfigAction(model.id);
      if (result.success) {
        router.refresh();
      } else {
        showToast(`Error: ${result.error}`);
      }
    });
  }

  function handleTrain(model: AIModelConfigOut) {
    startTransition(async () => {
      const result = await trainModelConfigAction(model.id);
      if (result.success) {
        showToast(result.data.message);
        router.refresh();
      } else {
        showToast(`Error: ${result.error}`);
      }
    });
  }

  return (
    <>
      <PageHeader
        title="Modelos IA"
        actions={
          <button
            onClick={openCreate}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={14} />
            Nuevo modelo
          </button>
        }
      />

      <Container className="py-6">
        {toast && (
          <div className="mb-4 rounded-md border border-border bg-muted px-4 py-3 text-sm">
            {toast}
          </div>
        )}
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Objetivo
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Entrenado
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    <Brain className="mx-auto mb-2 opacity-30" size={32} />
                    No hay modelos configurados
                  </td>
                </tr>
              )}
              {initialData.map((model) => (
                <tr key={model.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{model.name}</p>
                    {model.description && (
                      <p className="text-xs text-muted-foreground">
                        {model.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {model.model_type === "linear"
                        ? "Regresión lineal"
                        : "Red neuronal"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {model.target === "final_grade"
                      ? "Nota final"
                      : "Prob. aprobación"}
                  </td>
                  <td className="px-4 py-3">
                    {model.is_trained ? (
                      <Badge variant="success">Entrenado</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Sin entrenar
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {model.trained_at
                      ? new Date(model.trained_at).toLocaleDateString("es-VE")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleTrain(model)}
                        disabled={isPending}
                        aria-label={`Entrenar modelo ${model.name}`}
                        title="Entrenar"
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                      >
                        <Zap size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(model)}
                        aria-label={`Editar modelo ${model.name}`}
                        title="Editar"
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(model)}
                        disabled={isPending}
                        aria-label={`Eliminar modelo ${model.name}`}
                        title="Eliminar"
                        className="rounded p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 disabled:opacity-40 dark:hover:bg-red-950"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
              {editing ? "Editar modelo" : "Nuevo modelo IA"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert variant="error">{error}</Alert>}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ai-name">Nombre</Label>
              <Input
                id="ai-name"
                name="name"
                defaultValue={editing?.name ?? ""}
                placeholder="Modelo Regresión v1"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ai-desc">Descripción</Label>
              <Input
                id="ai-desc"
                name="description"
                defaultValue={editing?.description ?? ""}
                placeholder="Descripción opcional"
              />
            </div>

            {!editing && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ai-type">Arquitectura</Label>
                  <Select
                    id="ai-type"
                    name="model_type"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value as ModelType)
                    }
                  >
                    {MODEL_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ai-target">Objetivo</Label>
                  <Select id="ai-target" name="target">
                    {MODEL_TARGETS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            <p className="text-xs font-medium text-muted-foreground">
              Hiperparámetros
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ai-features">Max. features</Label>
                <Input
                  id="ai-features"
                  name="max_features"
                  type="number"
                  min={1}
                  defaultValue={editing?.hyperparams.max_features ?? 10}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ai-epochs">Épocas</Label>
                <Input
                  id="ai-epochs"
                  name="epochs"
                  type="number"
                  min={1}
                  defaultValue={editing?.hyperparams.epochs ?? 50}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ai-lr">Learning rate</Label>
                <Input
                  id="ai-lr"
                  name="learning_rate"
                  type="number"
                  step="0.0001"
                  min={0.0001}
                  defaultValue={editing?.hyperparams.learning_rate ?? 0.001}
                />
              </div>
              {(selectedType === "dense_nn" ||
                editing?.model_type === "dense_nn") && (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ai-units">Hidden units</Label>
                  <Input
                    id="ai-units"
                    name="hidden_units"
                    placeholder="64,32"
                    defaultValue={
                      editing?.hyperparams.hidden_units?.join(",") ?? "64,32"
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Separados por coma
                  </p>
                </div>
              )}
            </div>

            {editing && (
              <p className="text-xs text-muted-foreground">
                Cambiar hiperparámetros invalida el entrenamiento actual.
              </p>
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
