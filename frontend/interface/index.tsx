export interface ScrapedItem {
  title: string;
  content: string;
  content_type: string;
  source_url?: string;
  author: string;
  user_id: string;
}

export interface ScrapedData {
  team_id: string;
  items: ScrapedItem[];
}

export interface ScrapingOperations {
  handleUrlScrape: (url: string) => Promise<void>;
  handlePdfUpload: (file: File) => Promise<void>;
  handleBulkScrape: (urls: string[]) => Promise<void>;
}

export interface UseScrapingOperationsProps {
  setResults: (results: ScrapedData | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export interface ResultsDisplayWidgetProps {
  results: ScrapedData | null;
}

export interface ScrapingTabsWidgetProps {
  isLoading: boolean;
  operations: ScrapingOperations;
}

export interface SingleUrlWidgetProps {
  isLoading: boolean;
  onScrape: (url: string) => Promise<void>;
}
