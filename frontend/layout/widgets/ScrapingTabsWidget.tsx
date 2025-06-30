"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkUrlsWidget } from "./BulkUrlsWidget";
import { PdfUploadWidget } from "./PdfUploadWidget";
import { ScrapingTabsWidgetProps } from "@/interface";
import { SingleUrlWidget } from "./SingleUrlWidget";

export function ScrapingTabsWidget({
  isLoading,
  operations,
}: ScrapingTabsWidgetProps) {
  return (
    <Tabs defaultValue="single-url">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="single-url">Single URL</TabsTrigger>
        <TabsTrigger value="pdf-upload">PDF Upload</TabsTrigger>
        <TabsTrigger value="bulk-urls">Bulk URLs</TabsTrigger>
      </TabsList>

      <TabsContent value="single-url">
        <SingleUrlWidget
          isLoading={isLoading}
          onScrape={operations.handleUrlScrape}
        />
      </TabsContent>

      <TabsContent value="pdf-upload">
        <PdfUploadWidget
          isLoading={isLoading}
          onUpload={operations.handlePdfUpload}
        />
      </TabsContent>

      <TabsContent value="bulk-urls">
        <BulkUrlsWidget
          isLoading={isLoading}
          onScrape={operations.handleBulkScrape}
        />
      </TabsContent>
    </Tabs>
  );
}
