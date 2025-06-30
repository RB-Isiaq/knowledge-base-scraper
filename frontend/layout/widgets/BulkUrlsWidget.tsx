"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface BulkUrlsWidgetProps {
  isLoading: boolean;
  onScrape: (urls: string[]) => Promise<void>;
}

export function BulkUrlsWidget({ isLoading, onScrape }: BulkUrlsWidgetProps) {
  const [bulkUrls, setBulkUrls] = useState("");

  const handleScrape = () => {
    const urls = bulkUrls.split("\n").filter((url) => url.trim());
    if (urls.length > 0) {
      onScrape(urls);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk URL Scraping</CardTitle>
        <CardDescription>
          Enter multiple URLs (one per line) to scrape content from multiple
          sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bulk-urls">URLs (one per line)</Label>
          <Textarea
            id="bulk-urls"
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder={`https://interviewing.io/blog
https://nilmamano.com/blog/category/dsa
https://quill.co/blog`}
            rows={6}
          />
        </div>
        <Button onClick={handleScrape} disabled={isLoading || !bulkUrls.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            "Scrape All URLs"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
