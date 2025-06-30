"use client";

import { ScrapingOperations, UseScrapingOperationsProps } from "@/interface";
import { useScrapingConfig } from "./useScrapingConfig";
import { SCRAPE_BULK, SCRAPE_PDF, SCRAPE_URL } from "@/services/api";

export function useScrapingOperations({
  setResults,
  setError,
  setIsLoading,
}: UseScrapingOperationsProps): ScrapingOperations {
  const { teamId, userId } = useScrapingConfig();

  const handleUrlScrape = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(SCRAPE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          team_id: teamId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("team_id", teamId);
      formData.append("user_id", userId);

      const response = await fetch(SCRAPE_PDF, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkScrape = async (urls: string[]) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(SCRAPE_BULK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls,
          team_id: teamId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUrlScrape,
    handlePdfUpload,
    handleBulkScrape,
  };
}
