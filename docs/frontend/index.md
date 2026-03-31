# Documentación Frontend — Course Manager

Esta documentación describe las vistas del frontend y su relación con la API backend.

> **Nota**: Esta documentación debe mantenerse actualizada cuando se añadan o modifiquen vistas. La documentación del backend (`docs/backend/`) se actualiza manualmente desde el proyecto backend correspondiente.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Arquitectura**: Hexagonal (Ports & Adapters)
- **Estilos**: Tailwind CSS
- **Charts**: VChart (`@visactor/react-vchart`)
- **Auth**: HttpOnly cookies (`access_token`, `refresh_token`)

## Rutas disponibles

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `src/app/(dashboard)/page.tsx` | Dashboard con estadísticas globales |
| `/subjects` | `src/app/(dashboard)/subjects/` | CRUD de materias |
| `/courses` | `src/app/(dashboard)/courses/` | CRUD de cursos |
| `/students` | `src/app/(dashboard)/students/` | CRUD de estudiantes |
| `/evaluations` | `src/app/(dashboard)/evaluations/` | CRUD de evaluaciones |
| `/enrollments` | `src/app/(dashboard)/enrollments/` | CRUD de inscripciones |
| `/grades` | `src/app/(dashboard)/grades/` | CRUD de notas de evaluación |
| `/profile` | `src/app/(dashboard)/profile/` | Perfil y SMTP del usuario |
| `/login` | `src/app/(auth)/login/` | Inicio de sesión |
| `/register` | `src/app/(auth)/register/` | Registro de usuario |
| `/forgot-password` | `src/app/(auth)/forgot-password/` | Recuperación de contraseña |
| `/reset-password` | `src/app/(auth)/reset-password/` | Restablecimiento de contraseña |

## Archivos de documentación

| Archivo | Contenido |
|---|---|
| [dashboard.md](dashboard.md) | Vista principal con estadísticas y gráficas |
| [crud-views.md](crud-views.md) | Patrón CRUD compartido por todas las entidades académicas |
| [auth-views.md](auth-views.md) | Vistas de autenticación |
