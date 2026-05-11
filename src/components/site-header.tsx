import { Link, useRouter } from "@tanstack/react-router";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useLabStore } from "@/lib/lab-store";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const reset = useLabStore((s) => s.reset);

  const handleReset = () => {
    reset();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs"
            aria-hidden
          >
            DB
          </span>
          <span className="hidden sm:inline">Decision Bets Lab</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/lab"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 text-sm font-medium text-foreground bg-accent" }}
          >
            Lab
          </Link>
          <Link
            to="/about"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-1.5 text-sm font-medium text-foreground bg-accent" }}
          >
            About
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Reset to home"
            onClick={handleReset}
            title="Reset to home"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggle}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}
