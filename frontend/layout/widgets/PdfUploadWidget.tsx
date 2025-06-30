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
import { Upload, FileText, Loader2, AlertTriangle } from "lucide-react";
import type React from "react";

interface PdfUploadWidgetProps {
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export function PdfUploadWidget({ isLoading, onUpload }: PdfUploadWidgetProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleUpload = () => {
    if (pdfFile && !fileError) {
      onUpload(pdfFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (file) {
      // Vercel Hobby plan limit
      const maxSize = 4.5 * 1024 * 1024; // 4.5MB in bytes
      const sizeInMB = (file.size / 1024 / 1024).toFixed(1);

      if (file.size > maxSize) {
        setFileError(
          `File too large! Maximum size is 4.5MB. Your file is ${sizeInMB}MB.`
        );
        setPdfFile(null);
        return;
      }

      if (file.type !== "application/pdf") {
        setFileError("Please select a valid PDF file.");
        setPdfFile(null);
        return;
      }

      console.log(`Selected file: ${file.name} (${sizeInMB}MB)`);
    }

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
          Upload a PDF file to extract and chunk content (Max 4.5MB on Vercel
          Hobby plan)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pdf-file">PDF File (Max 4.5MB)</Label>
          <Input
            id="pdf-file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={fileError ? "border-red-500" : ""}
          />
          {pdfFile && !fileError && (
            <div className="mt-2 text-sm text-green-600">
              ✅ Selected: {pdfFile.name} (
              {(pdfFile.size / 1024 / 1024).toFixed(1)}MB)
            </div>
          )}
          {fileError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {fileError}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Tips for large files:</strong>
          <ul className="mt-1 space-y-1">
            <li>• Compress your PDF using online tools</li>
            <li>• Remove unnecessary images or pages</li>
          </ul>
        </div>

        <Button
          onClick={handleUpload}
          disabled={isLoading || !pdfFile || !!fileError}
        >
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
