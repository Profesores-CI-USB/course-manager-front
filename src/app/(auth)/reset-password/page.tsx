"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = form.get("new_password") as string;
    const confirm = form.get("confirm_password") as string;

    if (newPassword !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(token, newPassword);
      if (result.success) {
        router.push("/login");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Nueva contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige una contraseña segura para tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new_password">Nueva contraseña</Label>
          <Input
            id="new_password"
            name="new_password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm_password">Confirmar contraseña</Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || !token}
          className="mt-2 h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Guardando…" : "Cambiar contraseña"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border border-border bg-card" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
