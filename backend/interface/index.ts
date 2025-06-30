export interface KnowledgeItem {
  title: string;
  content: string;
  content_type:
    | "blog"
    | "podcast_transcript"
    | "call_transcript"
    | "linkedin_post"
    | "reddit_comment"
    | "book"
    | "other";
  source_url?: string;
  author?: string;
  user_id?: string;
}

export interface KnowledgebasePayload {
  team_id: string;
  items: KnowledgeItem[];
}

export interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

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
