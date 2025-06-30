"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayWidgetProps {
  error: string | null;
}

export function ErrorDisplayWidget({ error }: ErrorDisplayWidgetProps) {
  if (!error) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-600">Error: {error}</p>
        </div>
      </CardContent>
    </Card>
  );
}
