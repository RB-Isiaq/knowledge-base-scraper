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
import type React from "react";
import toast from "react-hot-toast";

interface PdfUploadWidgetProps {
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export function PdfUploadWidget({ isLoading, onUpload }: PdfUploadWidgetProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (pdfFile) {
      const maxSize = 25 * 1024 * 1024; // 25MB in bytes
      if (pdfFile.size > maxSize) {
        toast.error(`File too large! PDF must be smaller than 25MB.`);
        return;
      }

      if (pdfFile.type !== "application/pdf") {
        toast.error("Please select a valid PDF file.");
        return;
      }

      onUpload(pdfFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPdfFile(file);
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
          <Label htmlFor="pdf-file">PDF File (Max 25MB)</Label>
          <Input
            id="pdf-file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {pdfFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {pdfFile.name} (
              {(pdfFile.size / 1024 / 1024).toFixed(1)}MB)
            </div>
          )}
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
