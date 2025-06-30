"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentItemWidget } from "./ContentItemWidget";
import { Download } from "lucide-react";
import { ResultsDisplayWidgetProps } from "@/interface";

export function ResultsDisplayWidget({ results }: ResultsDisplayWidgetProps) {
  if (!results) return null;

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scraped-content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Scraped Content</CardTitle>
            <CardDescription>
              Found {results.items.length} items for team: {results.team_id}
            </CardDescription>
          </div>
          <Button onClick={handleDownloadJson} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {results.items.map((item, index) => (
            <ContentItemWidget key={index} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
