import Container from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <Container className="flex h-16 items-center justify-between border-b border-border">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="flex items-center gap-2">
        {actions}
        <ThemeToggle />
      </div>
    </Container>
  );
}
