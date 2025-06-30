import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import pdf from "pdf-parse";
import TurndownService from "turndown";
import type { ScrapedData, ScrapedItem } from "../interface";

// Initialize Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
});

// Configure turndown to preserve more formatting
turndownService.addRule("preserveCodeBlocks", {
  filter: ["pre", "code"],
  replacement: (content, node) => {
    if (node.nodeName === "PRE") {
      return "\n\n```\n" + content + "\n```\n\n";
    }
    return "`" + content + "`";
  },
});

// Better handling of paragraphs and spacing
turndownService.addRule("betterParagraphs", {
  filter: "p",
  replacement: (content) => {
    return "\n\n" + content + "\n\n";
  },
});

// Better handling of headings
turndownService.addRule("betterHeadings", {
  filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
  replacement: (content, node) => {
    const level = Number.parseInt(node.nodeName.charAt(1));
    const prefix = "#".repeat(level);
    return "\n\n" + prefix + " " + content + "\n\n";
  },
});

// Remove unwanted elements completely
turndownService.addRule("removeUnwanted", {
  filter: [
    "script",
    "style",
    "nav",
    "header",
    "footer",
    "aside",
    ".ads",
    ".advertisement",
    ".social-share",
    ".navigation",
    ".menu",
  ],
  replacement: () => "",
});

export async function scrapeUrl(
  url: string,
  teamId: string,
  userId: string
): Promise<ScrapedData> {
  try {
    console.log(`🔍 Scraping URL: ${url}`);

    // Check if this is a Substack URL
    const isSubstack = url.includes("substack.com");

    // Try simple HTTP request first, but for Substack always use Puppeteer
    let html: string;

    if (isSubstack) {
      console.log(
        `📧 Detected Substack, using Puppeteer with modal handling...`
      );
      html = await scrapeWithPuppeteer(url, true);
    } else {
      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            Connection: "keep-alive",
          },
          timeout: 15000,
          maxRedirects: 5,
        });
        html = response.data;
        console.log(`✅ Successfully fetched with Axios`);
      } catch (error) {
        console.log(`❌ Axios failed, trying Puppeteer...`);
        html = await scrapeWithPuppeteer(url, false);
      }
    }

    const $ = cheerio.load(html);
    const items: ScrapedItem[] = [];

    // Detect if this is a blog listing page
    const blogLinks = detectBlogLinks($, url);

    if (blogLinks.length > 0) {
      console.log(
        `📝 Found ${blogLinks.length} blog links, scraping articles...`
      );

      // Scrape individual articles (limit to prevent overwhelming)
      const linksToScrape = blogLinks.slice(0, 15);

      for (let i = 0; i < linksToScrape.length; i++) {
        const link = linksToScrape[i];
        try {
          console.log(
            `📄 Scraping article ${i + 1}/${linksToScrape.length}: ${link}`
          );
          const articleData = await scrapeIndividualArticle(
            link,
            teamId,
            userId
          );
          if (articleData) {
            items.push(articleData);
          }
          // Add small delay to be respectful
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`❌ Failed to scrape article ${link}:`, error);
        }
      }
    } else {
      console.log(`📄 Treating as single article/page`);
      // Single article/page
      const articleData = await scrapePageContent($, url, teamId, userId);
      if (articleData) {
        items.push(articleData);
      }
    }

    console.log(`✅ Scraping completed. Found ${items.length} items`);
    return {
      team_id: teamId,
      items,
    };
  } catch (error) {
    console.error("❌ Scraping error:", error);
    throw error;
  }
}

export async function scrapeBulkUrls(
  urls: string[],
  teamId: string,
  userId: string
): Promise<ScrapedData> {
  const allItems: ScrapedItem[] = [];
  const errors: string[] = [];

  console.log(`🔄 Starting bulk scrape for ${urls.length} URLs`);

  // Process URLs with concurrency control
  const batchSize = 2; // Reduced for stability
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(
      `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        urls.length / batchSize
      )}`
    );

    const batchPromises = batch.map(async (url: string) => {
      try {
        const result = await scrapeUrl(url.trim(), teamId, userId);
        return result.items;
      } catch (error) {
        const errorMsg = `Failed to scrape ${url}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
        return [];
      }
    });

    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach((items: any) => allItems.push(...items));

    // Add delay between batches
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(
    `✅ Bulk scraping completed. Total items: ${allItems.length}, Errors: ${errors.length}`
  );

  return {
    team_id: teamId,
    items: allItems,
  };
}

export async function processPdf(
  pdfBuffer: Buffer,
  filename: string,
  teamId: string,
  userId: string
): Promise<ScrapedData> {
  try {
    console.log(`📚 Processing PDF: ${filename}`);

    // Add timeout to PDF parsing
    const parsePromise = pdf(pdfBuffer, {
      // Optimize for Vercel's constraints
      max: 0, // No page limit
      version: "v1.10.100", // Use specific version for consistency
    });

    // Add 45-second timeout (Vercel has 60s max)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("PDF parsing timeout after 45 seconds")),
        45000
      );
    });

    const data = (await Promise.race([parsePromise, timeoutPromise])) as any;
    const fullText = data.text;

    console.log(
      `📄 PDF contains ${data.numpages} pages, ${fullText.length} characters`
    );

    if (!fullText || fullText.length < 50) {
      throw new Error(
        "PDF appears to be empty or contains no extractable text"
      );
    }

    // Split into chapters/sections
    const chunks = chunkPDFContent(fullText, filename);
    console.log(`📑 Split PDF into ${chunks.length} chunks`);

    if (chunks.length === 0) {
      throw new Error("No content could be extracted from the PDF");
    }

    const items: ScrapedItem[] = chunks.map((chunk, index) => ({
      title: chunk.title || `${filename} - Section ${index + 1}`,
      content: chunk.content,
      content_type: "book",
      author: extractAuthorFromPDF(fullText),
      user_id: userId,
    }));

    console.log(`✅ PDF processing completed`);
    return {
      team_id: teamId,
      items,
    };
  } catch (error) {
    console.error("❌ PDF processing error:", error);

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error(
          "PDF processing timed out. The file may be too complex or large."
        );
      }
      if (error.message.includes("Invalid PDF")) {
        throw new Error(
          "The uploaded file is not a valid PDF or is corrupted."
        );
      }
      if (error.message.includes("encrypted")) {
        throw new Error("Password-protected PDFs are not supported.");
      }
    }

    throw error;
  }
}

async function scrapeWithPuppeteer(
  url: string,
  handleModals: boolean
): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
    ],
  });

  const page = await browser.newPage();

  // Set realistic viewport and user agent
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  try {
    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    if (handleModals) {
      console.log(`🚫 Handling modals and overlays...`);

      // Wait a bit for any modals to appear
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Try to close common modal selectors
      const modalSelectors = [
        '[data-testid="close-button"]',
        ".modal-close",
        ".close-button",
        '[aria-label="Close"]',
        '[aria-label="close"]',
        ".fa-times",
        ".fa-close",
        'button[title="Close"]',
        ".popup-close",
        ".overlay-close",
        // Substack specific
        'button[aria-label="Close dialog"]',
        '[data-testid="close-modal"]',
        '.pencraft button[aria-label="Close"]',
      ];

      for (const selector of modalSelectors) {
        try {
          const closeButton = await page.$(selector);
          if (closeButton) {
            console.log(`🎯 Found close button: ${selector}`);
            await closeButton.click();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            break;
          }
        } catch (error) {
          // Continue trying other selectors
        }
      }

      // Try clicking "No thanks" or similar dismissal links
      const dismissSelectors = [
        'text="No thanks"',
        'text="Maybe later"',
        'text="Skip"',
        'text="Continue reading"',
        '[data-testid="no-thanks"]',
      ];

      for (const selector of dismissSelectors) {
        try {
          const dismissButton = await page.$(selector);
          if (dismissButton) {
            console.log(`👋 Found dismiss button: ${selector}`);
            await dismissButton.click();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            break;
          }
        } catch (error) {
          // Continue trying other selectors
        }
      }

      // Press Escape key as a fallback
      try {
        await page.keyboard.press("Escape");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        // Ignore escape key errors
      }

      // Wait for content to be visible
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const html = await page.content();
    console.log(`✅ Successfully fetched with Puppeteer`);
    return html;
  } finally {
    await browser.close();
  }
}

function detectBlogLinks($: cheerio.Root, baseUrl: string): string[] {
  const links: string[] = [];
  const baseUrlObj = new URL(baseUrl);
  const isSubstack = baseUrl.includes("substack.com");

  // First remove navigation elements to avoid getting menu links
  $(
    `nav, .nav, .navbar, .navigation, .menu, header, footer,
     .breadcrumb, .pagination, .sidebar, .widget,
     [class*="nav"], [class*="menu"], [id*="nav"], [id*="menu"]`
  ).remove();

  let selectors = [
    'a[href*="/blog/"]',
    'a[href*="/post/"]',
    'a[href*="/article/"]',
    'a[href*="/guide/"]',
    'a[href*="/learn/"]',
    'a[href*="/topics/"]',
    ".post-title a",
    ".blog-post a",
    ".article-title a",
    ".entry-title a",
    "h2 a",
    "h3 a",
    ".card a",
    ".post-link",
  ];

  // Add Substack-specific selectors
  if (isSubstack) {
    selectors = [
      ...selectors,
      ".post-preview-title a",
      ".post-preview a",
      '[data-testid="post-preview-title"] a',
      '.pencraft a[href*="/p/"]',
      'a[href*="/p/"]', // Substack post URLs
      ".frontend-pencraft a",
      ".post-title a",
    ];
  }

  selectors.forEach((selector) => {
    $(selector).each((_, element) => {
      const href = $(element).attr("href");
      const linkText = $(element).text().trim().toLowerCase();

      // Skip navigation-like links
      if (
        linkText.includes("home") ||
        linkText.includes("about") ||
        linkText.includes("contact") ||
        linkText.includes("login") ||
        linkText.includes("signup") ||
        linkText.includes("subscribe") ||
        linkText.length < 10 // Very short link text is likely navigation
      ) {
        return;
      }

      if (href) {
        try {
          const fullUrl = new URL(href, baseUrl).toString();
          const urlObj = new URL(fullUrl);

          // For Substack, be more permissive with same-domain links
          if (isSubstack) {
            if (
              urlObj.hostname === baseUrlObj.hostname &&
              href.includes("/p/")
            ) {
              links.push(fullUrl);
            }
          } else {
            // Only include links from the same domain
            if (urlObj.hostname === baseUrlObj.hostname) {
              // Filter out non-content URLs
              const path = urlObj.pathname.toLowerCase();
              if (
                (!path.includes("/tag/") &&
                  !path.includes("/category/") &&
                  !path.includes("/author/") &&
                  !path.includes("/page/") &&
                  !path.endsWith("/")) ||
                path.split("/").length > 2
              ) {
                links.push(fullUrl);
              }
            }
          }
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });
  });

  // Remove duplicates and sort
  const uniqueLinks = [...new Set(links)];
  console.log(`🔗 Found ${uniqueLinks.length} unique links`);
  return uniqueLinks;
}

async function scrapeIndividualArticle(
  url: string,
  teamId: string,
  userId: string
): Promise<ScrapedItem | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    return scrapePageContent($, url, teamId, userId);
  } catch (error) {
    console.error(`❌ Failed to scrape individual article ${url}:`, error);
    return null;
  }
}

function scrapePageContent(
  $: cheerio.Root,
  url: string,
  teamId: string,
  userId: string
): ScrapedItem | null {
  try {
    // First, aggressively remove all navigation and non-content elements from the entire page
    $(
      `nav, header, footer, aside, 
       .nav, .navbar, .navigation, .menu, .header, .footer, .sidebar, 
       .ads, .advertisement, .social-share, .comments, .related-posts,
       .breadcrumb, .breadcrumbs, .pagination, .pager,
       .author-bio, .author-info, .author-card,
       .newsletter, .subscription, .signup,
       .tags, .categories, .meta, .post-meta,
       .share, .sharing, .social, .social-media,
       .widget, .widgets, .secondary, .tertiary,
       .promo, .promotion, .banner, .cta,
       [class*="nav"], [class*="menu"], [class*="header"], [class*="footer"],
       [class*="sidebar"], [class*="widget"], [class*="ad"],
       [id*="nav"], [id*="menu"], [id*="header"], [id*="footer"],
       [id*="sidebar"], [id*="widget"], [id*="ad"]`
    ).remove();

    // Also remove script and style tags
    $("script, style, noscript").remove();

    // Extract title with multiple fallbacks
    const title =
      $("h1").first().text().trim() ||
      $("title")
        .text()
        .trim()
        .replace(/\s*\|\s*.*$/, "") || // Remove site name after |
      $(".post-title").text().trim() ||
      $(".entry-title").text().trim() ||
      $(".article-title").text().trim() ||
      "Untitled";

    // Extract author with multiple fallbacks
    let author =
      $(".author").text().trim() ||
      $(".by-author").text().trim() ||
      $('[rel="author"]').text().trim() ||
      $(".post-author").text().trim() ||
      $(".article-author").text().trim() ||
      $('[class*="author"]').first().text().trim() ||
      "";

    // Clean up author text
    author = author.replace(/^(by|author:?|written by)\s*/i, "").trim();

    // Now find the main content after cleaning
    let contentElement: cheerio.Cheerio | null = null;
    const contentSelectors = [
      "article",
      ".post-content",
      ".entry-content",
      ".blog-content",
      ".article-content",
      ".content",
      ".post-body",
      ".article-body",
      "main",
      ".main-content",
      "#content",
      ".story-body", // Common in news sites
      ".article-text", // Common in articles
    ];

    // Find the best content container
    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length) {
        const textLength = element.text().trim().length;
        if (textLength > 500) {
          contentElement = element;
          break;
        }
      }
    }

    // If no specific content container found, try to extract from body
    // but be very selective about what we include
    if (!contentElement) {
      // Look for the largest text block that's likely to be content
      let largestElement: cheerio.Cheerio | null = null;
      let largestSize = 0;

      $("div, section").each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();

        // Skip if it contains navigation-like text
        if (
          text.toLowerCase().includes("menu") ||
          text.toLowerCase().includes("navigation") ||
          text.toLowerCase().includes("subscribe") ||
          text.toLowerCase().includes("follow us") ||
          text.length < 500
        ) {
          return;
        }

        if (text.length > largestSize) {
          largestSize = text.length;
          largestElement = $el;
        }
      });

      contentElement = largestElement;
    }

    if (!contentElement || contentElement.text().trim().length < 200) {
      console.log(`⚠️ Content too short for ${url}`);
      return null;
    }

    // Final cleanup of the content element
    contentElement
      .find(
        `script, style, nav, .nav, .navigation, .menu, .header, .footer,
         .ads, .advertisement, .social-share, .comments, .related-posts,
         .breadcrumb, .pagination, .author-bio, .newsletter, .tags,
         .share, .sharing, .social, .widget, .promo, .banner,
         [class*="nav"], [class*="menu"], [class*="ad"], [class*="widget"]`
      )
      .remove();

    // Remove elements that are likely navigation based on their text content
    contentElement.find("*").each((_, el) => {
      const $el = $(el);
      const text = $el.text().toLowerCase();

      // Remove elements with navigation-like text
      if (
        text.includes("open menu") ||
        text.includes("close menu") ||
        text.includes("toggle menu") ||
        text.includes("skip to") ||
        text.includes("go to") ||
        text.includes("back to top") ||
        (text.includes("previous") && text.includes("next")) ||
        text.match(/^(home|about|contact|blog|services|products)$/i) ||
        ($el.find("a").length > 3 && text.length < 100) // Likely a menu with multiple links
      ) {
        $el.remove();
      }
    });

    // Fix common HTML issues that cause markdown problems
    contentElement.find("div").each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();

      // Remove empty divs
      if (!text) {
        $el.remove();
        return;
      }

      // Convert divs that contain only text to paragraphs
      if (!$el.find("*").length && text.length > 0) {
        $el.replaceWith(`<p>${text}</p>`);
      }
    });

    // Ensure proper spacing around headings and paragraphs
    contentElement.find("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const $el = $(el);
      $el.before("\n\n");
      $el.after("\n\n");
    });

    contentElement.find("p").each((_, el) => {
      const $el = $(el);
      $el.after("\n\n");
    });

    // Convert to markdown with better structure
    const cleanHtml = contentElement.html() || "";
    let markdown = turndownService.turndown(cleanHtml);

    // Post-process the markdown for better formatting
    markdown = markdown
      // Fix multiple consecutive newlines
      .replace(/\n{4,}/g, "\n\n\n")
      // Fix spacing around headings
      .replace(/\n(#{1,6}\s)/g, "\n\n$1")
      .replace(/(#{1,6}.*)\n([^\n#])/g, "$1\n\n$2")
      // Fix list formatting
      .replace(/\n(\s*[-*+]\s)/g, "\n\n$1")
      .replace(/(\s*[-*+].*)\n([^\n\s-*+])/g, "$1\n\n$2")
      // Fix paragraph spacing
      .replace(/([.!?])\n([A-Z])/g, "$1\n\n$2")
      // Remove excessive whitespace but preserve intentional breaks
      .replace(/[ \t]+/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      // Clean up the beginning and end
      .trim();

    if (markdown.length < 100) {
      console.log(`⚠️ Processed content too short for ${url}`);
      return null;
    }

    // Determine content type based on URL and title
    let contentType = "blog";
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();

    if (urlLower.includes("/guide/") || titleLower.includes("guide")) {
      contentType = "guide";
    } else if (
      urlLower.includes("/tutorial/") ||
      titleLower.includes("tutorial")
    ) {
      contentType = "tutorial";
    } else if (urlLower.includes("/learn/") || titleLower.includes("learn")) {
      contentType = "educational";
    } else if (
      urlLower.includes("/interview/") ||
      titleLower.includes("interview")
    ) {
      contentType = "interview_guide";
    }

    const result = {
      title: title.substring(0, 200),
      content: markdown.substring(0, 15000),
      content_type: contentType,
      source_url: url,
      author: author.substring(0, 100),
      user_id: userId,
    };

    console.log(
      `✅ Scraped: "${result.title}" (${result.content.length} chars)`
    );
    return result;
  } catch (error) {
    console.error("❌ Error scraping page content:", error);
    return null;
  }
}

function chunkPDFContent(
  text: string,
  filename: string
): Array<{ title: string; content: string }> {
  const chunks: Array<{ title: string; content: string }> = [];

  // Try to split by chapters first
  const chapterRegex =
    /(?:^|\n)\s*(?:Chapter|CHAPTER)\s+(\d+|[IVX]+)[\s.:]\s*([^\n]*)/g;
  const chapters = [];
  let match;

  while ((match = chapterRegex.exec(text)) !== null) {
    chapters.push({
      index: match.index,
      number: match[1],
      title: match[2] || `Chapter ${match[1]}`,
      fullMatch: match[0],
    });
  }

  if (chapters.length > 0) {
    console.log(`📖 Found ${chapters.length} chapters in PDF`);
    // Split by chapters
    for (let i = 0; i < chapters.length; i++) {
      const currentChapter = chapters[i];
      const nextChapter = chapters[i + 1];

      const startIndex = currentChapter.index;
      const endIndex = nextChapter ? nextChapter.index : text.length;

      const chapterContent = text
        .slice(startIndex, endIndex)
        .replace(currentChapter.fullMatch, "") // Remove the chapter header
        .trim();

      if (chapterContent.length > 200) {
        // Only include substantial content
        chunks.push({
          title: `${filename} - ${currentChapter.title}`,
          content: cleanPDFText(chapterContent),
        });
      }
    }
  } else {
    console.log(`📄 No chapters found, splitting by size`);
    // No chapters found, split by size
    const maxChunkSize = 4000; // Increased chunk size
    const paragraphs = text.split(/\n\s*\n/);
    let currentChunk = "";
    let chunkIndex = 1;

    for (const paragraph of paragraphs) {
      if (
        currentChunk.length + paragraph.length > maxChunkSize &&
        currentChunk.length > 0
      ) {
        chunks.push({
          title: `${filename} - Section ${chunkIndex}`,
          content: cleanPDFText(currentChunk.trim()),
        });
        currentChunk = paragraph;
        chunkIndex++;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      }
    }

    // Add the last chunk
    if (currentChunk.trim()) {
      chunks.push({
        title: `${filename} - Section ${chunkIndex}`,
        content: cleanPDFText(currentChunk.trim()),
      });
    }
  }

  return chunks.filter((chunk) => chunk.content.length > 100); // Filter out very short chunks
}

function cleanPDFText(text: string): string {
  let cleanedText = text
    .replace(/\f/g, "\n") // Replace form feeds with newlines
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n") // Remove excessive line breaks
    .replace(/^\s+|\s+$/g, "") // Trim whitespace
    .replace(/(.)\n([a-z])/g, "$1 $2"); // Fix broken words across lines

  // Detect and format code blocks
  cleanedText = detectAndFormatCodeBlocks(cleanedText);

  return cleanedText.trim();
}

function detectAndFormatCodeBlocks(text: string): string {
  // Pattern to detect code blocks with line numbers
  const codeBlockPattern = /(\d+\s+def\s+\w+.*?)(?=\n\n|\n[A-Z]|\n\d+\.\s|$)/gs;

  return text.replace(codeBlockPattern, (match) => {
    // Clean up the code block
    const codeLines = match
      .split("\n")
      .map((line) => {
        // Remove line numbers at the beginning
        return line.replace(/^\s*\d+\s+/, "");
      })
      .filter((line) => line.trim().length > 0);

    if (codeLines.length > 0) {
      // Detect language (simple heuristic)
      const firstLine = codeLines[0].toLowerCase();
      let language = "";

      if (
        firstLine.includes("def ") ||
        firstLine.includes("import ") ||
        firstLine.includes("print(")
      ) {
        language = "python";
      } else if (
        firstLine.includes("function ") ||
        firstLine.includes("const ") ||
        firstLine.includes("let ")
      ) {
        language = "javascript";
      } else if (
        firstLine.includes("public ") ||
        firstLine.includes("class ") ||
        firstLine.includes("import java")
      ) {
        language = "java";
      }

      return `\n\n\`\`\`${language}\n${codeLines.join("\n")}\n\`\`\`\n\n`;
    }
    return match;
  });
}

function extractAuthorFromPDF(text: string): string {
  const firstLines = text.split("\n").slice(0, 30); // Check more lines

  for (const line of firstLines) {
    const authorMatch = line.match(/(?:by|author:?|written by)\s+([^\n]+)/i);
    if (authorMatch) {
      return authorMatch[1].trim().substring(0, 100); // Limit length
    }
  }

  return "";
}
