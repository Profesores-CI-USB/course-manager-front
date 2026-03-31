import {
  BookOpen,
  Brain,
  ClipboardList,
  Gauge,
  GraduationCap,
  type LucideIcon,
  NotepadText,
  ScrollText,
  Users,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "Course Manager",
  description: "Gestor académico de cursos, estudiantes y evaluaciones",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: BookOpen,
    name: "Materias",
    href: "/subjects",
  },
  {
    icon: ScrollText,
    name: "Cursos",
    href: "/courses",
  },
  {
    icon: Users,
    name: "Estudiantes",
    href: "/students",
  },
  {
    icon: ClipboardList,
    name: "Evaluaciones",
    href: "/evaluations",
  },
  {
    icon: GraduationCap,
    name: "Inscripciones",
    href: "/enrollments",
  },
  {
    icon: NotepadText,
    name: "Calificaciones",
    href: "/grades",
  },
  {
    icon: Brain,
    name: "Modelos IA",
    href: "/ai-models",
  },
];
