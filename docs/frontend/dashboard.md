# Dashboard — Vista Principal

Ruta: `/`
Archivo: `src/app/(dashboard)/page.tsx`
Tipo: Server Component (async)

---

## Descripción

El Dashboard es la página de inicio del sistema. Muestra estadísticas globales sobre los cursos, estudiantes e inscripciones del usuario autenticado.

- **Admin**: ve estadísticas de todos los cursos del sistema.
- **Professor**: ve estadísticas únicamente de sus propios cursos.

---

## Fuente de datos

**Endpoint**: `GET /api/v1/stats/courses`
**Documentación**: [`docs/backend/stats.md`](../backend/stats.md)

La página obtiene el token de sesión, llama a `StatsRepository.getCourseStats()` y pasa los datos a los componentes de gráficas. Si la API no responde, se muestra un mensaje de error en lugar de las gráficas.

---

## Componentes de gráficas

### 1. `StatsMetrics` — Tarjetas de métricas

Archivo: `src/components/chart-blocks/charts/stats-metrics/`

Muestra 4 tarjetas con métricas globales:

| Tarjeta | Campo API | Descripción |
|---|---|---|
| Total Cursos | `summary.total_courses` | Número de cursos activos |
| Total Inscritos | `summary.total_enrolled` | Total de inscripciones |
| Promedio Global | `summary.global_avg_scale_grade` | Promedio en escala 1–5 |
| Tasa de Aprobación | `summary.global_pass_rate` | Porcentaje de aprobación global |

---

### 2. `CourseAveragesBlock` — Promedio por Curso

Archivo: `src/components/chart-blocks/charts/course-averages/`

Gráfica de barras que muestra el promedio en escala 1–5 por cada curso. Incluye una línea de referencia en 3 (umbral de aprobación).

- **Eje X**: código de materia + año (e.g. `CI3825 2026`)
- **Eje Y**: promedio en escala 1–5
- **Tooltip**: promedio y cantidad de inscritos

Campo API: `courses[].avg_scale_grade`, `courses[].total_enrolled`

---

### 3. `GradeDistributionBlock` — Distribución de Notas

Archivo: `src/components/chart-blocks/charts/grade-distribution/`

Gráfica de barras con la distribución global de notas en escala 1–5, más la categoría "Pendiente".

| Barra | Rango (0–100) | Color |
|---|---|---|
| 5 | 85–100 | Verde |
| 4 | 70–84 | Lima |
| 3 | 50–69 | Amarillo |
| 2 | 30–49 | Naranja |
| 1 | 0–29 | Rojo |
| Pendiente | — | Gris |

Campo API: `summary.overall_grade_distribution`

---

### 4. `CoursePassRateBlock` — Tasa de Aprobación por Curso

Archivo: `src/components/chart-blocks/charts/course-pass-rate/`

Gráfica de barras que muestra la tasa de aprobación (%) por curso. El color varía según el resultado:

| Color | Condición |
|---|---|
| Verde | ≥ 70% aprobación |
| Amarillo | 50–69% aprobación |
| Rojo | < 50% aprobación |

- **Tooltip**: porcentaje de aprobación y relación calificados/inscritos

Campo API: `courses[].pass_rate`, `courses[].graded_count`, `courses[].total_enrolled`

---

## Flujo de datos

```
page.tsx (server)
  └── StatsRepository.getCourseStats(token)
        └── GET /api/v1/stats/courses
              └── StatsResponse { summary, courses[] }
                    ├── StatsMetrics(summary)
                    ├── CourseAveragesBlock(courses)
                    ├── GradeDistributionBlock(summary.overall_grade_distribution)
                    └── CoursePassRateBlock(courses)
```

---

## Estado vacío

Si el endpoint falla (backend no disponible, token inválido, etc.), la página muestra un mensaje de error en lugar de las gráficas. No redirige al login; el middleware ya se encarga de eso.
