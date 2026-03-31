# Vistas de Autenticación

Ruta base: `/`
Layout: `src/app/(auth)/layout.tsx` — tarjeta centrada, sin barra lateral

---

## `/login` — Inicio de sesión

**Endpoint**: `POST /api/v1/auth/login`
**Acción**: `src/app/actions/auth.ts` → `login()`

Campos del formulario:
- Email
- Contraseña

Flujo:
1. El usuario envía el formulario
2. `login()` llama al backend y recibe `access_token` + `refresh_token`
3. `setSession()` guarda los tokens en cookies HttpOnly
4. Redirige a `/`

---

## `/register` — Registro

**Endpoint**: `POST /api/v1/auth/register`
**Acción**: `src/app/actions/auth.ts` → `register()`

Campos del formulario:
- Nombre completo
- Email
- Contraseña

---

## `/forgot-password` — Recuperación de contraseña

**Endpoint**: `POST /api/v1/auth/forgot-password`

Campos del formulario:
- Email

Envía un correo con enlace de restablecimiento (requiere configuración SMTP en el perfil).

---

## `/reset-password` — Restablecimiento de contraseña

**Endpoint**: `POST /api/v1/auth/reset-password`

Parámetros de query: `?token=<reset_token>`

Campos del formulario:
- Nueva contraseña
- Confirmar contraseña

---

## Protección de rutas

El middleware (`src/middleware.ts`) redirige:
- Usuarios **no autenticados** que acceden a `/dashboard/*` → `/login`
- Usuarios **autenticados** que acceden a `/login`, `/register` → `/`

La cookie `access_token` es HttpOnly y no accesible desde JavaScript del cliente.
