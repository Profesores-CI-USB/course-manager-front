"use client";

import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import type { UserOut } from "@/domain/entities/auth";
import { cn } from "@/lib/utils";

interface UserProps {
  user: UserOut | null;
}

export default function User({ user }: UserProps) {
  const [open, setOpen] = useState(false);

  const displayName = user?.full_name ?? user?.email ?? "Usuario";
  const displayRole = user?.role ?? "—";

  return (
    <div className="relative flex h-16 items-center border-b border-border px-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col text-left">
            <span className="max-w-[80px] truncate text-sm font-medium">
              {displayName}
            </span>
            <span className="max-w-[80px] truncate text-xs capitalize text-muted-foreground">
              {displayRole}
            </span>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-2 top-[60px] z-50 w-40 rounded-md border border-border bg-background shadow-md">
          <a
            href="/profile"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            <UserIcon size={14} />
            Perfil
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
