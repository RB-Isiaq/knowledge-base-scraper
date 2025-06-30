"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { CopyButton } from "@/components/button/copyButton";
import { ExternalLink, User, Expand, Minimize } from "lucide-react";
import { ScrapedItem } from "@/interface";

interface ContentItemWidgetProps {
  item: ScrapedItem;
}

export function ContentItemWidget({ item }: ContentItemWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("markdown");

  const previewContent = item.content.substring(0, 500);
  const shouldShowExpand = item.content.length > 500;

  return (
    <Card className="border-l-2 md:border-l-4 border-l-blue-500">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{item.content_type}</Badge>
                {item.author && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="h-3 w-3" />
                    {item.author}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {shouldShowExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      <Minimize className="h-4 w-4 mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <Expand className="h-4 w-4 mr-1" />
                      Expand
                    </>
                  )}
                </Button>
              )}

              <CopyButton
                text={item.content}
                label="Copy Content"
                variant="outline"
                size="sm"
              />
            </div>
          </div>

          {/* Source URL */}
          {item.source_url && (
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate"
              >
                {item.source_url}
              </a>
            </div>
          )}

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
              <TabsTrigger value="raw">Raw Text</TabsTrigger>
            </TabsList>

            <TabsContent value="markdown" className="mt-4">
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <MarkdownRenderer
                  content={isExpanded ? item.content : previewContent}
                />
                {!isExpanded && shouldShowExpand && (
                  <div className="mt-2 text-sm text-gray-500">
                    ... (content truncated)
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="ttext-sm whitespace-pre-wrap font-mono">
                  {isExpanded ? item.content : previewContent}
                  {!isExpanded && shouldShowExpand && (
                    <span className="text-gray-500">
                      {"\n"}... (content truncated)
                    </span>
                  )}
                </pre>
              </div>
            </TabsContent>
          </Tabs>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
            <span>{item.content.length.toLocaleString()} characters</span>
            <span>{Math.ceil(item.content.length / 4)} tokens (approx)</span>
            <span>
              {Math.ceil(item.content.split(" ").length / 200)} min read
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
