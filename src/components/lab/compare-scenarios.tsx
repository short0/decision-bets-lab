import { Card } from "@/components/ui/card";
import { compareScenarios } from "@/lib/mocked-insights";

export function CompareScenarios() {
  const scenarios = compareScenarios();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {scenarios.map((s) => (
        <Card key={s.title} className="space-y-2 p-4">
          <h4 className="text-sm font-semibold">{s.title}</h4>
          <p className="text-xs text-muted-foreground">{s.example}</p>
          <p className="text-xs">
            <span className="font-medium">Takeaway: </span>
            {s.takeaway}
          </p>
        </Card>
      ))}
    </div>
  );
}
