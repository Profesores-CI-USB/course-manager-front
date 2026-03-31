# Vistas CRUD — Patrón Compartido

Todas las entidades académicas (Materias, Cursos, Estudiantes, Evaluaciones, Inscripciones, Calificaciones) siguen el mismo patrón de dos archivos por ruta.

---

## Patrón de archivos

```
src/app/(dashboard)/<entidad>/
├── page.tsx      # Server Component: fetch inicial
└── client.tsx    # Client Component: tabla + Dialog CRUD
```

### `page.tsx` (Server Component)

- `async` — obtiene el token de sesión con `getAccessToken()`
- Llama al repositorio correspondiente para obtener los datos iniciales
- Pasa los datos como props al componente cliente

### `client.tsx` (Client Component)

- Marcado con `"use client"`
- Recibe `initialData` como prop
- Contiene una tabla con los registros
- Un único `<Dialog>` controlado para crear o editar (cambia su contenido según el modo)
- Usa `useTransition` para el estado de carga durante mutaciones
- Llama a `router.refresh()` tras cada mutación exitosa para re-sincronizar el servidor

---

## Rutas y entidades

### `/subjects` — Materias

**API**: `GET/POST/PUT /api/v1/academic/subjects`
**Repositorio**: `SubjectRepository`
**Campos**: código, nombre, créditos
**Roles**: lista → cualquier rol; crear/editar → solo admin

---

### `/courses` — Cursos

**API**: `GET/POST/PUT /api/v1/academic/courses`
**Repositorio**: `CourseRepository`
**Campos**: materia, profesor, trimestre, año
**Roles**: cualquier rol para crear (el usuario queda como profesor); editar → solo admin o profesor del curso

---

### `/students` — Estudiantes

**API**: `GET/POST/PUT /api/v1/academic/students`
**Repositorio**: `StudentRepository`
**Campos**: nombre completo, carnet, correo
**Roles**: lista → cualquier rol; crear/editar → solo admin

---

### `/evaluations` — Evaluaciones

**API**: `GET/POST/PUT /api/v1/academic/evaluations`
**Repositorio**: `EvaluationRepository`
**Campos**: curso, descripción, porcentaje, tipo, fecha de entrega
**Tipos disponibles**: `exam`, `homework`, `workshop`, `project`, `report`, `presentation`, `video`
**Roles**: admin o profesor dueño del curso

---

### `/enrollments` — Inscripciones

**API**: `GET/POST/PUT /api/v1/academic/enrollments`, `POST /api/v1/academic/enrollments/bulk-csv`
**Repositorio**: `EnrollmentRepository`
**Campos**: curso, estudiante, nota final
**Características especiales**: carga masiva desde CSV (columnas `carnet` y `nombre`)
**Roles**: admin o profesor dueño del curso

---

### `/grades` — Calificaciones de Evaluación

**API**: `GET/POST/PUT /api/v1/academic/evaluation-grades`
**Repositorio**: `EvaluationGradeRepository`
**Campos**: evaluación, inscripción, nota
**Restricciones**: la nota no puede superar el porcentaje de la evaluación; evaluación e inscripción deben pertenecer al mismo curso
**Roles**: admin o profesor dueño del curso

---

## Escala de notas

Las notas se almacenan en escala **0–100** y se reportan en escala **1–5**:

| Escala | Rango (0–100) |
|---|---|
| 5 | 85 – 100 |
| 4 | 70 – 84 |
| 3 | 50 – 69 (aprobación) |
| 2 | 30 – 49 |
| 1 | 0 – 29 |
