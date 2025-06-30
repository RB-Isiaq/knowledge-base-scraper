"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function CopyButton({
  text,
  label = "Copy",
  variant = "default",
  size = "default",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-1" />
          {label}
        </>
      )}
    </Button>
  );
}
