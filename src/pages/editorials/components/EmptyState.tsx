import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay editoriales registradas
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          Comienza creando tu primer editorial para organizar mejor tu biblioteca.
        </p>
      </CardContent>
    </Card>
  );
}