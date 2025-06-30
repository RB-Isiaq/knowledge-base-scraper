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
import { Upload, FileText, Loader2 } from "lucide-react";

interface PdfUploadWidgetProps {
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export function PdfUploadWidget({ isLoading, onUpload }: PdfUploadWidgetProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (pdfFile) {
      onUpload(pdfFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload PDF
        </CardTitle>
        <CardDescription>
          Upload a PDF file to extract and chunk content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pdf-file">PDF File</Label>
          <Input
            id="pdf-file"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </div>
        <Button onClick={handleUpload} disabled={isLoading || !pdfFile}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Process PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
