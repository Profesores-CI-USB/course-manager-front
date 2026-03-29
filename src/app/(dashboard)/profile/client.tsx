"use client";

import { useState, useTransition } from "react";
import { changePasswordAction, createUserAction } from "@/app/actions/auth";
import { updateSmtpAction } from "@/app/actions/user";
import Container from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { UserOut, UserSmtpOut } from "@/domain/entities/auth";

interface Props {
  user: UserOut;
  smtp: UserSmtpOut | null;
}

export default function ProfileClient({ user, smtp }: Props) {
  return (
    <>
      <PageHeader title="Perfil" />
      <Container className="py-6">
        <div className="grid gap-6 laptop:grid-cols-2">
          <UserInfoCard user={user} />
          <SmtpCard smtp={smtp} />
          <ChangePasswordCard />
          {user.role === "admin" && <CreateUserCard />}
        </div>
      </Container>
    </>
  );
}

function UserInfoCard({ user }: { user: UserOut }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="mb-4 text-lg font-semibold">Información de la cuenta</h2>
      <div className="flex flex-col gap-3">
        <Row label="Nombre" value={user.full_name ?? "—"} />
        <Row label="Correo" value={user.email} />
        <Row
          label="Rol"
          value={
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          }
        />
        <Row
          label="SMTP"
          value={
            user.smtp_configured ? (
              <Badge variant="success">Configurado</Badge>
            ) : (
              <Badge variant="outline">Sin configurar</Badge>
            )
          }
        />
        <Row
          label="Registrado"
          value={new Date(user.created_at).toLocaleDateString("es-VE")}
        />
      </div>
    </section>
  );
}

function SmtpCard({ smtp }: { smtp: UserSmtpOut | null }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSmtpAction({
        smtp_email: form.get("smtp_email") as string,
        smtp_password: form.get("smtp_password") as string,
      });
      if (result.success) {
        setSuccess(true);
        setError("");
      } else {
        setError(result.error);
        setSuccess(false);
      }
    });
  }

  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="mb-4 text-lg font-semibold">Credenciales SMTP</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <Alert variant="error">{error}</Alert>}
        {success && (
          <Alert variant="success">Credenciales SMTP actualizadas.</Alert>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="smtp-email">Correo SMTP</Label>
          <Input
            id="smtp-email"
            name="smtp_email"
            type="email"
            defaultValue={smtp?.smtp_email ?? ""}
            placeholder="correo@gmail.com"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="smtp-password">Contraseña de aplicación</Label>
          <Input
            id="smtp-password"
            name="smtp_password"
            type="password"
            placeholder={smtp?.has_password ? "••••••••" : "Nueva contraseña"}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="h-9 self-end rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Guardando…" : "Guardar SMTP"}
        </button>
      </form>
    </section>
  );
}

function ChangePasswordCard() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPw = form.get("new_password") as string;
    const confirm = form.get("confirm_password") as string;

    if (newPw !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction({
        current_password: form.get("current_password") as string,
        new_password: newPw,
      });
      if (result.success) {
        setSuccess(true);
        setError("");
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error);
        setSuccess(false);
      }
    });
  }

  return (
    <section className="rounded-lg border border-border p-6 laptop:col-span-2">
      <h2 className="mb-4 text-lg font-semibold">Cambiar contraseña</h2>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 laptop:grid-cols-3"
      >
        {(error || success) && (
          <div className="laptop:col-span-3">
            {error && <Alert variant="error">{error}</Alert>}
            {success && (
              <Alert variant="success">Contraseña actualizada correctamente.</Alert>
            )}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cp-current">Contraseña actual</Label>
          <Input
            id="cp-current"
            name="current_password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cp-new">Nueva contraseña</Label>
          <Input
            id="cp-new"
            name="new_password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cp-confirm">Confirmar contraseña</Label>
          <Input
            id="cp-confirm"
            name="confirm_password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="h-9 self-end rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Cambiando…" : "Cambiar contraseña"}
        </button>
      </form>
    </section>
  );
}

function CreateUserCard() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullName = form.get("full_name") as string;

    startTransition(async () => {
      const result = await createUserAction({
        email: form.get("email") as string,
        password: form.get("password") as string,
        full_name: fullName || undefined,
        role: form.get("role") as string,
      });
      if (result.success) {
        setSuccess(true);
        setError("");
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error);
        setSuccess(false);
      }
    });
  }

  return (
    <section className="rounded-lg border border-border p-6 laptop:col-span-2">
      <h2 className="mb-1 text-lg font-semibold">Crear usuario</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Solo los administradores pueden crear nuevas cuentas.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-4 laptop:grid-cols-2">
        {(error || success) && (
          <div className="laptop:col-span-2">
            {error && <Alert variant="error">{error}</Alert>}
            {success && (
              <Alert variant="success">Usuario creado correctamente.</Alert>
            )}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cu-name">Nombre completo</Label>
          <Input
            id="cu-name"
            name="full_name"
            type="text"
            placeholder="Juan Pérez"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cu-email">Correo electrónico</Label>
          <Input
            id="cu-email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cu-password">Contraseña temporal</Label>
          <Input
            id="cu-password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cu-role">Rol</Label>
          <Select id="cu-role" name="role" defaultValue="professor">
            <option value="professor">Profesor</option>
            <option value="admin">Administrador</option>
          </Select>
        </div>
        <div className="laptop:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Creando…" : "Crear usuario"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
