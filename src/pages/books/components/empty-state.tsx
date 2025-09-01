import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { FilterBook } from "@/api/types/book-api-response.interface";


export const EmptyState = ({ filters }: { filters: FilterBook }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">
            No se encontraron libros
          </p>
          <p className="text-sm mb-4">
            {filters.search
              ? `No hay libros que coincidan con "${filters.search}"`
              : "No hay libros disponibles"}
          </p>
        </div>
      </CardContent>
    </Card>
  );