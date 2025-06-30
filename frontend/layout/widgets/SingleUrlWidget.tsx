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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Loader2 } from "lucide-react";
import { SingleUrlWidgetProps } from "@/interface";

export function SingleUrlWidget({ isLoading, onScrape }: SingleUrlWidgetProps) {
  const [blogUrl, setBlogUrl] = useState("");

  const handleScrape = () => {
    if (blogUrl.trim()) {
      onScrape(blogUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Scrape Single URL
        </CardTitle>
        <CardDescription>
          Enter a blog URL or website to scrape content from
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="blog-url">Blog/Website URL</Label>
          <Input
            id="blog-url"
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
            placeholder="https://interviewing.io/blog"
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
          />
        </div>
        <Button onClick={handleScrape} disabled={isLoading || !blogUrl.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            "Scrape Content"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
