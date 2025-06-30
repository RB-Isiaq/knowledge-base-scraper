"use client";

import { useState } from "react";
import { useScrapingOperations } from "@/hooks/useScrappingOperations";
import { ScrapedData } from "@/interface";
import { ConfigurationWidget } from "./widgets/ConfigurationWidget";
import { ScrapingTabsWidget } from "./widgets/ScrapingTabsWidget";
import { ErrorDisplayWidget } from "./widgets/ErrorDisplayWidget";
import { ResultsDisplayWidget } from "./widgets/ResultDisplayWidget";

export function WebScraperLayout() {
  const [results, setResults] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrapingOperations = useScrapingOperations({
    setResults,
    setError,
    setIsLoading,
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base Scraper</h1>
        <p className="text-gray-600">
          Import technical content from blogs, PDFs, and other sources into your
          knowledge base
        </p>
      </div>

      <div className="space-y-6">
        <ConfigurationWidget />

        <ScrapingTabsWidget
          isLoading={isLoading}
          operations={scrapingOperations}
        />

        <ErrorDisplayWidget error={error} />

        <ResultsDisplayWidget results={results} />
      </div>
    </div>
  );
}
